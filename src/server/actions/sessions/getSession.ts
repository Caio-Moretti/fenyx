// src/server/actions/workouts/getWorkoutSession.ts

'use server'

import { createClient } from '@/lib/supabase/server'
import type { WorkoutSession } from '@/types/shared'
import type { DbWorkoutSession, DbExerciseSet, DbWorkoutExercise } from '@/types/database'
import { dbToWorkoutSession, dbToWorkoutExercise, dbToExerciseSet } from '@/types/shared'

interface SessionWithRelations extends DbWorkoutSession {
  workout: {
    id: string
    user_id: string
    name: string
    exercises: DbWorkoutExercise[]
  }
  sets: Array<DbExerciseSet & {
    exercise: DbWorkoutExercise
  }>
}

export async function getWorkoutSession(sessionId: string): Promise<WorkoutSession> {
  const supabase = await createClient()

  // Verifica se o usuário está autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user) throw new Error('User not authenticated')

  // Busca a sessão com todos os dados relacionados
  const { data: session, error } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout:workouts (
        id,
        user_id,
        name,
        exercises:workout_exercises (*)
      ),
      sets:exercise_sets (
        *,
        exercise:workout_exercises (*)
      )
    `)
    .eq('id', sessionId)
    .single()

  if (error || !session) {
    console.error('Error fetching session:', error)
    throw error || new Error('Session not found')
  }

  const typedSession = session as SessionWithRelations

  // Verifica se o usuário tem acesso a esta sessão
  if (typedSession.workout.user_id !== user.id) {
    throw new Error('Access denied')
  }

  // Converte os dados do banco para o formato da aplicação
  return {
    ...dbToWorkoutSession(typedSession),
    workout: {
      id: typedSession.workout.id,
      name: typedSession.workout.name,
      exercises: typedSession.workout.exercises.map(dbToWorkoutExercise)
    },
    sets: typedSession.sets.map((set) => ({
      ...dbToExerciseSet(set),
      exercise: dbToWorkoutExercise(set.exercise)
    }))
  }
}