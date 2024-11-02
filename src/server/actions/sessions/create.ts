// src/server/actions/workouts/sessions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { DbExerciseSet, DbWorkoutExercise } from '@/types/database'
import type { WorkoutSession } from '@/types/shared'
import { dbToWorkoutSession, dbToWorkout, dbToWorkoutExercise, dbToExerciseSet } from '@/types/shared'


export async function startWorkoutSession(workoutId: string): Promise<WorkoutSession> {
  const supabase = await createClient()

  // Verifica se o usuário está autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user) throw new Error('User not authenticated')

  // Verifica se o treino existe e pertence ao usuário
  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .select()
    .eq('id', workoutId)
    .eq('user_id', user.id)
    .single()

  if (workoutError || !workout) {
    console.error('Error fetching workout:', workoutError)
    throw new Error('Workout not found or access denied')
  }

  // Cria uma nova sessão
  const { data: session, error: sessionError } = await supabase
    .from('workout_sessions')
    .insert({
      workout_id: workoutId,
    })
    .select(`
      *,
      workout:workouts (
        *,
        exercises:workout_exercises (*)
      )
    `)
    .single()

  if (sessionError || !session) {
    console.error('Error creating session:', sessionError)
    throw new Error('Failed to create workout session')
  }

  // Converte os dados do banco para o formato da aplicação
  const workoutData = session.workout
  return {
    ...dbToWorkoutSession(session),
    workout: {
      ...dbToWorkout(workoutData),
      exercises: workoutData.exercises.map(dbToWorkoutExercise)
    },
    sets: [] // Sessão nova começa sem séries
  }
}


export async function getWorkoutSession(sessionId: string): Promise<WorkoutSession> {
  const supabase = await createClient()

  const { data: session, error } = await supabase
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
    .eq('id', sessionId)
    .single()

  if (error || !session) {
    console.error('Error fetching session:', error)
    throw new Error('Session not found')
  }

  // Converte os dados do banco para o formato da aplicação
  const workoutData = session.workout
  return {
    ...dbToWorkoutSession(session),
    workout: {
      ...dbToWorkout(workoutData),
      exercises: workoutData.exercises.map(dbToWorkoutExercise)
    },
    sets: session.sets.map((set: DbExerciseSet & { exercise: DbWorkoutExercise }) => ({
      ...dbToExerciseSet(set),
      exercise: dbToWorkoutExercise(set.exercise)
    }))
  }
}