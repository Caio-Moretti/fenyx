// src/server/actions/workouts/getWorkout.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { Workout } from '@/types/shared'
import { dbToWorkout, dbToWorkoutExercise } from '@/types/shared'

export async function getWorkout(workoutId: string): Promise<Workout> {
  const supabase = await createClient()

  // Verifica se o usuário está autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user) throw new Error('User not authenticated')

  // Busca o treino com seus exercícios
  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .select(`
      *,
      exercises:workout_exercises (*)
    `)
    .eq('id', workoutId)
    .eq('user_id', user.id)
    .single()

  if (workoutError || !workout) {
    console.error('Error fetching workout:', workoutError)
    throw new Error('Workout not found or access denied')
  }

  // Converte os dados do banco para o formato da aplicação
  return {
    ...dbToWorkout(workout),
    exercises: workout.exercises?.map(dbToWorkoutExercise) || []
  }
}