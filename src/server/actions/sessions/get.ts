// src/server/actions/workouts/sessions.ts
'use server'

import { WorkoutSession, dbToWorkoutSession, dbToWorkout, dbToWorkoutExercise } from "@/types/shared"
import { createClient } from '@/lib/supabase/server'

export async function getWorkoutSessions(workoutId: string): Promise<WorkoutSession[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout:workouts (
        *,
        exercises:workout_exercises (*)
      )
    `)
    .eq('workout_id', workoutId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching sessions:', error)
    throw new Error('Failed to load workout sessions')
  }

  return data.map(session => ({
    ...dbToWorkoutSession(session),
    workout: session.workout ? {
      ...dbToWorkout(session.workout),
      exercises: session.workout.exercises.map(dbToWorkoutExercise)
    } : undefined
  }))
}