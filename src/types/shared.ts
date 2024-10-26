// File: src/types/shared.ts

// User profile
export interface User {
    id: string
    email: string
    name: string
    preferences: {
      language: 'en' | 'pt-BR'
      theme: 'dark' | 'light'
    }
  }
  
  // Workout program
  export interface WorkoutProgram {
    id: string
    userId: string
    name: string
    splits: WorkoutSplit[]
    createdAt: string
    updatedAt: string
  }
  
  // Workout split (A, B, C, etc.)
  export interface WorkoutSplit {
    id: string
    programId: string
    name: string
    exercises: ExerciseInstance[]
    order: number
  }
  
  // Exercise definition
  export interface Exercise {
    id: string
    nameEn: string
    namePtBr: string
    description?: string
    createdBy: string
    isCustom: boolean
  }
  
  // Exercise instance in a workout
  export interface ExerciseInstance {
    id: string
    exerciseId: string
    splitId: string
    order: number
    targetSets: number
    targetRepsMin: number
    targetRepsMax: number
    exercise: Exercise
  }
  
  // Set log
  export interface ExerciseSet {
    id: string
    exerciseInstanceId: string
    weight: number
    reps: number
    rir: number
    timestamp: string
  }
  
  // Active workout session
  export interface WorkoutSession {
    id: string
    splitId: string
    startTime: string
    endTime?: string
    exercises: ExerciseInstance[]
    completedSets: ExerciseSet[]
    status: 'in-progress' | 'completed' | 'abandoned'
  }