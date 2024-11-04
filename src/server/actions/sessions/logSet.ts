// src/server/actions/sessions/logSet.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { 
  DbWorkout, 
  DbWorkoutExercise,
  DbWorkoutSession,
  DbExerciseSet
} from '@/types/database'
import type { 
  Workout, 
  WorkoutSession,
  ExerciseSet 
} from '@/types/shared'
import { 
  dbToWorkout, 
  dbToWorkoutExercise,
  dbToWorkoutSession, 
  dbToExerciseSet 
} from '@/types/shared'

// ... outros imports e interfaces existentes ...

interface LogSetInput {
  sessionId: string
  exerciseId: string
  setNumber: number
  weight: number
  reps: number
  difficulty: number
}

/**
 * Registra uma série de exercício
 * Valida os dados e garante que não existam séries duplicadas
 */
export async function logSet(input: LogSetInput): Promise<ExerciseSet> {
  const supabase = await createClient()

  try {
    // 1. Validações básicas
    if (input.weight < 0) throw new Error('Weight cannot be negative')
    if (input.reps < 0) throw new Error('Reps cannot be negative')
    if (input.difficulty < 0 || input.difficulty > 5) throw new Error('Difficulty must be between 0 and 5')

    // 2. Verifica se a sessão existe e está ativa
    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', input.sessionId)
      .single()

    if (sessionError || !session) {
      throw new Error('Session not found')
    }

    if (session.finished_at) {
      throw new Error('Cannot log sets on a finished session')
    }

    // 3. Verifica se o exercício pertence ao workout da sessão
    const { data: exercise, error: exerciseError } = await supabase
      .from('workout_exercises')
      .select('*')
      .eq('id', input.exerciseId)
      .single()

    if (exerciseError || !exercise) {
      throw new Error('Exercise not found')
    }

    // 4. Verifica se já existe uma série com este número
    const { data: existingSet, error: existingSetError } = await supabase
      .from('exercise_sets')
      .select('*')
      .eq('session_id', input.sessionId)
      .eq('exercise_id', input.exerciseId)
      .eq('set_number', input.setNumber)
      .maybeSingle()

    // Se já existe uma série, atualiza em vez de criar
    if (existingSet) {
      const { data: updatedSet, error: updateError } = await supabase
        .from('exercise_sets')
        .update({
          weight: input.weight,
          reps: input.reps,
          difficulty: input.difficulty
        })
        .eq('id', existingSet.id)
        .select(`
          *,
          exercise:workout_exercises (*)
        `)
        .single()

      if (updateError || !updatedSet) {
        throw new Error('Failed to update set')
      }

      revalidatePath(`/workouts/${session.workout_id}`)
      
      return {
        ...dbToExerciseSet(updatedSet),
        exercise: dbToWorkoutExercise(updatedSet.exercise)
      }
    }

    // 5. Insere a nova série
    const { data: newSet, error: insertError } = await supabase
      .from('exercise_sets')
      .insert({
        session_id: input.sessionId,
        exercise_id: input.exerciseId,
        set_number: input.setNumber,
        weight: input.weight,
        reps: input.reps,
        difficulty: input.difficulty
      })
      .select(`
        *,
        exercise:workout_exercises (*)
      `)
      .single()

    if (insertError || !newSet) {
      throw new Error('Failed to log set')
    }

    // 6. Revalida os dados da página
    revalidatePath(`/workouts/${session.workout_id}`)

    return {
      ...dbToExerciseSet(newSet),
      exercise: dbToWorkoutExercise(newSet.exercise)
    }

  } catch (error) {
    console.error('Error in logSet:', error)
    throw error
  }
}
