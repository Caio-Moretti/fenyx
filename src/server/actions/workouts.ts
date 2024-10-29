// src/server/actions/workouts.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { DbExercise, DbExerciseInstance, DbExerciseSet, DbWorkout } from '@/types/database'
import type { Workout } from '@/types/shared'
import { dbToExercise, dbToExerciseInstance, dbToExerciseSet, dbToWorkout } from '@/types/shared'

interface CreateWorkoutInput {
  name: string
}

interface WorkoutWithRelations extends DbWorkout {
  exercise_instances: Array<DbExerciseInstance & {
    exercise: DbExercise | null
    sets: DbExerciseSet[]
  }>
}

export async function createWorkout(input: CreateWorkoutInput): Promise<Workout> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!user) throw new Error('User not authenticated')

  const { data: workout, error } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      name: input.name,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating workout:', error)
    throw error
  }

  revalidatePath('/workouts')

  return dbToWorkout(workout as DbWorkout)
}


export async function getWorkouts(): Promise<Workout[]> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!user) throw new Error('User not authenticated')

  const { data: workouts, error } = await supabase
    .from('workouts')
    .select(`
      *,
      exercise_instances:exercise_instances (
        *,
        exercise:exercises (*),
        sets:exercise_sets (*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching workouts:', error)
    throw error
  }

  return (workouts as WorkoutWithRelations[]).map(workout => ({
    ...dbToWorkout(workout),
    exercises: workout.exercise_instances.map(instance => ({
      ...dbToExerciseInstance(instance),
      exercise: instance.exercise ? dbToExercise(instance.exercise) : undefined,
      sets: instance.sets?.map(dbToExerciseSet) || []
    }))
  }))
}