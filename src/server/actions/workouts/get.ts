// src/server/actions/workouts/get.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { Workout } from '@/types/shared'

export async function getWorkouts(): Promise<Workout[]> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!user) throw new Error('User not authenticated')

  try {
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select(`
        id,
        user_id,
        name,
        created_at,
        workout_exercises (
          id,
          name,
          order_index,
          target_sets,
          target_reps_min,
          target_reps_max,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })


    if (workoutsError) throw workoutsError

    if (!workouts) return []

    const formattedWorkouts = workouts.map(workout => {

      return {
        id: workout.id,
        userId: workout.user_id,
        name: workout.name,
        createdAt: workout.created_at,
        exercises: Array.isArray(workout.workout_exercises) 
          ? workout.workout_exercises.map(exercise => ({
              id: exercise.id,
              workoutId: workout.id,
              name: exercise.name,
              orderIndex: exercise.order_index,
              targetSets: exercise.target_sets,
              targetRepsMin: exercise.target_reps_min,
              targetRepsMax: exercise.target_reps_max,
              createdAt: exercise.created_at
            }))
          : []
      }
    })


    return formattedWorkouts
  } catch (error) {
    throw error
  }
}