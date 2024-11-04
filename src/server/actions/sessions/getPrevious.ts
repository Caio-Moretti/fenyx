// src/server/actions/sessions/getPrevious.ts

import { 
    WorkoutSession, 
    dbToWorkoutSession, 
    dbToWorkout, 
    dbToWorkoutExercise, 
    dbToExerciseSet 
  } from "@/types/shared"
  import { createClient } from '@/lib/supabase/server'
  import { 
    WorkoutSessionWithData, 
    ExerciseSetWithExercise 
  } from "@/types/database"
  
  /**
   * Busca a última sessão completada de um treino específico
   */
  export async function getPreviousSession(workoutId: string): Promise<WorkoutSession | null> {
    const supabase = await createClient()
  
    try {
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
        .eq('workout_id', workoutId)
        .eq('finished_at', 'not.is.null')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
  
      if (error) {
        console.error('Error fetching previous session:', error)
        throw error
      }
  
      if (!session) return null
  
      // Tipagem explícita para o resultado do Supabase
      const typedSession = session as WorkoutSessionWithData
  
      return {
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
    } catch (error) {
      console.error('Error in getPreviousSession:', error)
      throw error
    }
  }