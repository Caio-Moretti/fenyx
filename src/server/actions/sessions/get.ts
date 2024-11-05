// src/server/actions/workouts/sessions.ts
'use server'

import { 
  WorkoutSession, 
  dbToWorkoutSession, 
  dbToWorkout, 
  dbToWorkoutExercise,
  dbToExerciseSet 
} from "@/types/shared"
import { createClient } from '@/lib/supabase/server'
import type { ExerciseSetWithExercise, WorkoutSessionWithData } from '@/types/database'

/**
 * Busca todas as sessões de um treino específico
 * Inclui dados do treino, exercícios e séries realizadas
 */
export async function getWorkoutSessions(workoutId: string): Promise<WorkoutSession[]> {
  const supabase = await createClient()

  try {
    // Busca sessões com dados relacionados
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        workout:workouts (
          *,
          exercises:workout_exercises (*)
        ),
        sets:exercise_sets (
          *,
          exercise:workout_exercises (*)
        )
      `)
      .eq('workout_id', workoutId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sessions:', error)
      throw new Error('Failed to load workout sessions')
    }

    // Converte e estrutura os dados
    return (data as WorkoutSessionWithData[]).map(session => ({
      ...dbToWorkoutSession(session),
      // Dados do treino e exercícios
      workout: session.workout ? {
        ...dbToWorkout(session.workout),
        exercises: session.workout.exercises.map(dbToWorkoutExercise)
      } : undefined,
      // Séries realizadas
      sets: session.sets?.map((set: ExerciseSetWithExercise) => ({
        ...dbToExerciseSet(set),
        exercise: dbToWorkoutExercise(set.exercise)
      })) ?? []
    }))

  } catch (error) {
    console.error('Error in getWorkoutSessions:', error)
    throw error instanceof Error 
      ? error 
      : new Error('Failed to load workout sessions')
  }
}