// src/types/shared.ts

import type { 
  DbWorkout, 
  DbWorkoutExercise, 
  DbWorkoutSession, 
  DbExerciseSet 
} from './database'

/**
 * Interface de um treino com seus exercícios
 */
export interface Workout {
  id: string
  userId: string
  name: string
  createdAt: string
  exercises: WorkoutExercise[] // Relacionamento com exercícios
}

/**
 * Interface de um exercício em um treino
 */
export interface WorkoutExercise {
  id: string
  workoutId: string
  name: string
  orderIndex: number
  targetSets: number
  targetRepsMin: number
  targetRepsMax: number
  createdAt: string
  sets?: ExerciseSet[] // Opcional, carregado quando necessário
}

/**
 * Interface de uma sessão de treino
 */
export interface WorkoutSession {
  id: string
  workoutId: string
  createdAt: string
  workout?: Workout // Opcional, carregado quando necessário
  sets: ExerciseSet[] // Séries realizadas nesta sessão
}

/**
 * Interface de uma série realizada
 */
export interface ExerciseSet {
  id: string
  sessionId: string
  exerciseId: string
  setNumber: number
  weight: number
  reps: number
  difficulty: number // 0-5 (RIR/RPE invertido)
  createdAt: string
  exercise?: WorkoutExercise // Opcional, carregado quando necessário
}

/**
 * Funções para converter tipos do banco para tipos da aplicação
 */
export function dbToWorkout(db: DbWorkout): Workout {
  return {
    id: db.id,
    userId: db.user_id,
    name: db.name,
    createdAt: db.created_at,
    exercises: [] // Precisa ser preenchido separadamente
  }
}

export function dbToWorkoutExercise(db: DbWorkoutExercise): WorkoutExercise {
  return {
    id: db.id,
    workoutId: db.workout_id,
    name: db.name,
    orderIndex: db.order_index,
    targetSets: db.target_sets,
    targetRepsMin: db.target_reps_min,
    targetRepsMax: db.target_reps_max,
    createdAt: db.created_at
  }
}

export function dbToWorkoutSession(db: DbWorkoutSession): WorkoutSession {
  return {
    id: db.id,
    workoutId: db.workout_id,
    createdAt: db.created_at,
    sets: [] // Precisa ser preenchido separadamente
  }
}

export function dbToExerciseSet(db: DbExerciseSet): ExerciseSet {
  return {
    id: db.id,
    sessionId: db.session_id,
    exerciseId: db.exercise_id,
    setNumber: db.set_number,
    weight: db.weight,
    reps: db.reps,
    difficulty: db.difficulty,
    createdAt: db.created_at
  }
}