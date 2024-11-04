// src/server/actions/sessions/getPrevious.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { 
  WorkoutSession,
  dbToWorkoutSession,
  dbToWorkout,
  dbToWorkoutExercise,
  dbToExerciseSet
} from '@/types/shared'
import type { 
  WorkoutSessionWithData,
  ExerciseSetWithExercise
} from '@/types/database'

export async function getPreviousSession(workoutId: string): Promise<WorkoutSession | null> {
  const supabase = await createClient()

  try {
    console.log('Buscando sessão anterior para workout:', workoutId)

    // Primeiro, vamos pegar todas as sessões deste workout ordenadas por data
    const { data: sessions, error } = await supabase
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
      console.error('Erro ao buscar sessões:', error)
      throw error
    }

    console.log('Total de sessões encontradas:', sessions?.length)
    console.log('Sessões:', JSON.stringify(sessions, null, 2))

    // Se não houver sessões, retorna null
    if (!sessions?.length) {
      console.log('Nenhuma sessão encontrada')
      return null
    }

    // Se houver apenas uma sessão, é a atual, então não há sessão anterior
    if (sessions.length === 1) {
      console.log('Apenas uma sessão encontrada (atual)')
      return null
    }

    // A segunda sessão na lista (índice 1) será a anterior à atual
    const previousSession = sessions[1]
    console.log('Sessão anterior encontrada:', previousSession.id)

    // Tipagem e transformação dos dados
    const typedSession = previousSession as WorkoutSessionWithData
    
    const formattedSession = {
      ...dbToWorkoutSession(typedSession),
      workout: {
        ...dbToWorkout(typedSession.workout),
        exercises: typedSession.workout.exercises.map(dbToWorkoutExercise)
      },
      sets: typedSession.sets.map((set: ExerciseSetWithExercise) => ({
        ...dbToExerciseSet(set),
        exercise: dbToWorkoutExercise(set.exercise)
      }))
    }

    console.log('Sessão formatada:', JSON.stringify(formattedSession, null, 2))
    return formattedSession

  } catch (error) {
    console.error('Erro em getPreviousSession:', error)
    throw error
  }
}