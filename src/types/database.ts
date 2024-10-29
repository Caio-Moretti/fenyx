// src/types/database.ts

export interface DbExercise {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface DbWorkout {
  id: string
  user_id: string
  name: string
  started_at: string
  finished_at: string | null
  created_at: string
}

export interface DbExerciseInstance {
  id: string
  workout_id: string
  exercise_id: string
  order: number
  sets_goal: number
  reps_goal: number
  created_at: string
}

export interface DbExerciseSet {
  id: string
  exercise_instance_id: string
  weight: number
  reps: number
  rir: number  // 0-5
  created_at: string
}

export type NewExercise = Omit<DbExercise, 'id' | 'created_at'>
export type NewWorkout = Omit<DbWorkout, 'id' | 'created_at'>
export type NewExerciseInstance = Omit<DbExerciseInstance, 'id' | 'created_at'>
export type NewExerciseSet = Omit<DbExerciseSet, 'id' | 'created_at'>

export type UpdateExercise = Partial<NewExercise>
export type UpdateWorkout = Partial<NewWorkout>
export type UpdateExerciseInstance = Partial<NewExerciseInstance>
export type UpdateExerciseSet = Partial<NewExerciseSet>