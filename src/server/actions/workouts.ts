// // src/server/actions/workouts.ts
// 'use server'

// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'
// import type { 
//   DbWorkout, 
//   DbWorkoutExercise,
//   DbWorkoutSession,
//   DbExerciseSet
// } from '@/types/database'
// import type { Workout, WorkoutSession } from '@/types/shared'
// import { 
//   dbToWorkout, 
//   dbToWorkoutExercise,
//   dbToWorkoutSession, 
//   dbToExerciseSet 
// } from '@/types/shared'

// interface CreateWorkoutInput {
//   name: string
//   exercises: Array<{
//     name: string
//     targetSets: number
//     targetRepsMin: number
//     targetRepsMax: number
//   }>
// }

// interface WorkoutWithExercises extends DbWorkout {
//   exercises: DbWorkoutExercise[]
// }

// interface WorkoutSessionWithData extends DbWorkoutSession {
//   workout: WorkoutWithExercises
//   sets: Array<DbExerciseSet & {
//     exercise: DbWorkoutExercise
//   }>
// }

// interface LogSetInput {
//   sessionId: string
//   exerciseId: string
//   setNumber: number
//   weight: number
//   reps: number
//   difficulty: number
// }

// /**
//  * Cria um novo treino com seus exercícios
//  */
// export async function createWorkout(input: CreateWorkoutInput): Promise<Workout> {
//   const supabase = await createClient()

//   // Verificar autenticação
//   const { data: { user }, error: userError } = await supabase.auth.getUser()
//   if (userError) throw userError
//   if (!user) throw new Error('User not authenticated')

//   // Criar treino
//   const { data: workout, error: workoutError } = await supabase
//     .from('workouts')
//     .insert({
//       user_id: user.id,
//       name: input.name,
//     })
//     .select()
//     .single()

//   if (workoutError || !workout) {
//     console.error('Error creating workout:', workoutError)
//     throw workoutError
//   }

//   // Criar exercícios para o treino
//   const exercisesData = input.exercises.map((exercise, index) => ({
//     workout_id: workout.id,
//     name: exercise.name,
//     order_index: index,
//     target_sets: exercise.targetSets,
//     target_reps_min: exercise.targetRepsMin,
//     target_reps_max: exercise.targetRepsMax
//   }))

//   const { data: exercises, error: exercisesError } = await supabase
//     .from('workout_exercises')
//     .insert(exercisesData)
//     .select()

//   if (exercisesError) {
//     console.error('Error creating exercises:', exercisesError)
//     throw exercisesError
//   }

//   revalidatePath('/workouts')

//   return {
//     ...dbToWorkout(workout as DbWorkout),
//     exercises: exercises.map(dbToWorkoutExercise)
//   }
// }

// /**
//  * Inicia uma nova sessão de treino
//  */
// export async function startWorkoutSession(workoutId: string): Promise<WorkoutSession> {
//   const supabase = await createClient()

//   const { data: session, error } = await supabase
//     .from('workout_sessions')
//     .insert({
//       workout_id: workoutId
//     })
//     .select(`
//       *,
//       workout:workouts (
//         *,
//         exercises:workout_exercises (*)
//       )
//     `)
//     .single()

//   if (error || !session) {
//     console.error('Error starting session:', error)
//     throw error || new Error('Failed to start session')
//   }

//   const typedSession = session as WorkoutSessionWithData

//   return {
//     ...dbToWorkoutSession(typedSession),
//     workout: {
//       ...dbToWorkout(typedSession.workout),
//       exercises: typedSession.workout.exercises.map(dbToWorkoutExercise)
//     },
//     sets: [] // Sessão nova, ainda não tem séries
//   }
// }

// export async function getWorkoutSession(sessionId: string): Promise<WorkoutSession> {
//   const supabase = await createClient()

//   const { data: session, error } = await supabase
//     .from('workout_sessions')
//     .select(`
//       *,
//       workout:workouts (
//         *,
//         exercises:workout_exercises (*)
//       ),
//       sets:exercise_sets (
//         *,
//         exercise:workout_exercises (*)
//       )
//     `)
//     .eq('id', sessionId)
//     .single()

//   if (error || !session) {
//     console.error('Error fetching session:', error)
//     throw error || new Error('Session not found')
//   }

//   const typedSession = session as WorkoutSessionWithData
  
//   return {
//     ...dbToWorkoutSession(typedSession),
//     workout: {
//       ...dbToWorkout(typedSession.workout),
//       exercises: typedSession.workout.exercises.map(dbToWorkoutExercise)
//     },
//     sets: typedSession.sets.map(set => ({
//       ...dbToExerciseSet(set),
//       exercise: dbToWorkoutExercise(set.exercise)
//     }))
//   }
// }


// export async function logSet(input: LogSetInput) {
//   const supabase = await createClient()

//   const { data: set, error } = await supabase
//     .from('exercise_sets')
//     .insert({
//       session_id: input.sessionId,
//       exercise_id: input.exerciseId,
//       set_number: input.setNumber,
//       weight: input.weight,
//       reps: input.reps,
//       difficulty: input.difficulty
//     })
//     .select(`
//       *,
//       exercise:workout_exercises (*)
//     `)
//     .single()

//   if (error) {
//     console.error('Error logging set:', error)
//     throw error
//   }

//   return {
//     ...dbToExerciseSet(set),
//     exercise: dbToWorkoutExercise(set.exercise)
//   }
// }

// export async function deleteWorkout(workoutId: string) {
//   const supabase = await createClient()

//   const { error } = await supabase
//     .from('workouts')
//     .delete()
//     .eq('id', workoutId)

//   if (error) {
//     console.error('Error deleting workout:', error)
//     throw error
//   }

//   revalidatePath('/workouts')
// }