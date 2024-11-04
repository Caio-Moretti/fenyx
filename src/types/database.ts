// src/types/database.ts

/**
 * Tipos das tabelas do Supabase
 * Representam a estrutura exata das tabelas no banco
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
  started_at: string  // Adicionado para tracking de início da sessão
  finished_at: string | null  // Adicionado para tracking de fim da sessão
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

/**
 * Tipos para consultas com JOIN
 * Representam a estrutura dos dados quando fazemos queries mais complexas
 */
export interface WorkoutWithExercises extends DbWorkout {
  exercises: DbWorkoutExercise[]
}

export interface ExerciseSetWithExercise extends DbExerciseSet {
  exercise: DbWorkoutExercise
}

export interface WorkoutSessionWithData extends DbWorkoutSession {
  workout: WorkoutWithExercises
  sets: ExerciseSetWithExercise[]
}

/**
 * Tipos para consultas específicas
 * Úteis para quando precisamos de uma estrutura particular dos dados
 */
export interface SessionExerciseProgress {
  exercise_id: string
  completed_sets: number
  total_volume: number // peso * reps
  avg_difficulty: number
}

/**
 * Tipos para operações de inserção
 * Omitimos campos gerados automaticamente pelo banco
 */
export type NewWorkout = Omit<DbWorkout, 'id' | 'created_at'>
export type NewWorkoutExercise = Omit<DbWorkoutExercise, 'id' | 'created_at'>
export type NewWorkoutSession = Omit<DbWorkoutSession, 'id' | 'created_at' | 'finished_at'>
export type NewExerciseSet = Omit<DbExerciseSet, 'id' | 'created_at'>

/**
 * Tipos para operações de atualização
 * Todos os campos são opcionais pois podemos atualizar apenas parte dos dados
 */
export type UpdateWorkout = Partial<NewWorkout>
export type UpdateWorkoutExercise = Partial<NewWorkoutExercise>
export type UpdateWorkoutSession = Partial<NewWorkoutSession>
export type UpdateExerciseSet = Partial<NewExerciseSet>

/**
 * Tipos para respostas de queries
 * Útil para tipar corretamente as respostas do Supabase
 */
export interface QueryResult<T> {
  data: T | null
  error: Error | null
}

export interface QueryResultList<T> {
  data: T[]
  error: Error | null
}