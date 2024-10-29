// src/types/shared.ts

import type { DbExercise, DbExerciseInstance, DbExerciseSet, DbWorkout } from './database'

// User profile mantém-se igual pois vem do auth do Supabase
export interface User {
  id: string
  email: string
  name: string
  preferences: {
    language: 'en' | 'pt-BR'
    theme: 'dark' | 'light'
  }
}

// Interface que representa um exercício na aplicação
export interface Exercise {
  id: string
  userId: string
  name: string
  createdAt: string
}

// Interface que representa um treino na aplicação
export interface Workout {
  id: string
  userId: string
  name: string
  startedAt: string
  finishedAt: string | null
  createdAt: string
  exercises: ExerciseInstance[] // Relação com exercícios
}

// Interface que representa uma instância de exercício em um treino
export interface ExerciseInstance {
  id: string
  workoutId: string
  exerciseId: string
  order: number
  setsGoal: number
  repsGoal: number
  createdAt: string
  exercise?: Exercise // Opcional, carregado quando necessário
  sets?: ExerciseSet[] // Opcional, carregado quando necessário
}

// Interface que representa uma série realizada
export interface ExerciseSet {
  id: string
  exerciseInstanceId: string
  weight: number
  reps: number
  rir: number
  createdAt: string
}

/**
 * Funções auxiliares para converter entre tipos do DB e da aplicação
 */
export const dbToExercise = (db: DbExercise): Exercise => ({
  id: db.id,
  userId: db.user_id,
  name: db.name,
  createdAt: db.created_at
})

export const dbToWorkout = (db: DbWorkout): Workout => ({
  id: db.id,
  userId: db.user_id,
  name: db.name,
  startedAt: db.started_at,
  finishedAt: db.finished_at,
  createdAt: db.created_at,
  exercises: [] // Precisa ser preenchido separadamente
})

export const dbToExerciseInstance = (db: DbExerciseInstance): ExerciseInstance => ({
  id: db.id,
  workoutId: db.workout_id,
  exerciseId: db.exercise_id,
  order: db.order,
  setsGoal: db.sets_goal,
  repsGoal: db.reps_goal,
  createdAt: db.created_at
})

export const dbToExerciseSet = (db: DbExerciseSet): ExerciseSet => ({
  id: db.id,
  exerciseInstanceId: db.exercise_instance_id,
  weight: db.weight,
  reps: db.reps,
  rir: db.rir,
  createdAt: db.created_at
})