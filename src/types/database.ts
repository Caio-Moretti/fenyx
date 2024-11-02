// src/types/database.ts

/**
 * Tipos das tabelas do Supabase
 */

// Tabela workouts
export interface DbWorkout {
  id: string
  user_id: string
  name: string
  created_at: string
}

// Tabela workout_exercises
export interface DbWorkoutExercise {
  id: string
  workout_id: string
  name: string
  order_index: number
  target_sets: number
  target_reps_min: number
  target_reps_max: number
  created_at: string
}

// Tabela workout_sessions
export interface DbWorkoutSession {
  id: string
  workout_id: string
  created_at: string
}

// Tabela exercise_sets
export interface DbExerciseSet {
  id: string
  session_id: string
  exercise_id: string
  set_number: number
  weight: number
  reps: number
  difficulty: number // 0-5 (RIR invertido)
  created_at: string
}

// Tipos para JOIN queries
export interface WorkoutWithExercises extends DbWorkout {
  exercises: DbWorkoutExercise[]
}

export interface WorkoutSessionWithData extends DbWorkoutSession {
  workout: WorkoutWithExercises
  sets: Array<DbExerciseSet & {
    exercise: DbWorkoutExercise
  }>
}

/**
 * Tipos para operações de inserção
 * Omitimos campos gerados automaticamente
 */
export type NewWorkout = Omit<DbWorkout, 'id' | 'created_at'>
export type NewWorkoutExercise = Omit<DbWorkoutExercise, 'id' | 'created_at'>
export type NewWorkoutSession = Omit<DbWorkoutSession, 'id' | 'created_at'>
export type NewExerciseSet = Omit<DbExerciseSet, 'id' | 'created_at'>

/**
 * Tipos para operações de atualização
 * Todos os campos são opcionais
 */
export type UpdateWorkout = Partial<NewWorkout>
export type UpdateWorkoutExercise = Partial<NewWorkoutExercise>
export type UpdateWorkoutSession = Partial<NewWorkoutSession>
export type UpdateExerciseSet = Partial<NewExerciseSet>