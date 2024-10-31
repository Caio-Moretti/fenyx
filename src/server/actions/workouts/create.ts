// src/server/actions/workouts/create.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { DbWorkout } from '@/types/database'
import type { Workout } from '@/types/shared'
import { dbToWorkout, dbToWorkoutExercise } from '@/types/shared'

export interface CreateWorkoutInput {
  name: string
  exercises: Array<{
    name: string
    targetSets: number
    targetRepsMin: number
    targetRepsMax: number
  }>
}

export async function createWorkout(input: CreateWorkoutInput): Promise<Workout> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!user) throw new Error('User not authenticated')

  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      name: input.name,
    })
    .select()
    .single()

  if (workoutError || !workout) {
    console.error('Error creating workout:', workoutError)
    throw workoutError
  }

  const exercisesData = input.exercises.map((exercise, index) => ({
    workout_id: workout.id,
    name: exercise.name,
    order_index: index,
    target_sets: exercise.targetSets,
    target_reps_min: exercise.targetRepsMin,
    target_reps_max: exercise.targetRepsMax
  }))

  const { data: exercises, error: exercisesError } = await supabase
    .from('workout_exercises')
    .insert(exercisesData)
    .select()

  if (exercisesError) {
    console.error('Error creating exercises:', exercisesError)
    throw exercisesError
  }

  revalidatePath('/workouts')

  return {
    ...dbToWorkout(workout as DbWorkout),
    exercises: exercises.map(dbToWorkoutExercise)
  }
}