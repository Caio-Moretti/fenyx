// // src/components/workout/WorkoutTracker.tsx
// 'use client'

// import { useTranslations } from 'next-intl'
// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import type { WorkoutSession, WorkoutExercise, ExerciseSet } from '@/types/shared'
// // import { getWorkoutSession } from '@/server/actions/workouts/index'

// interface WorkoutTrackerProps {
//   workoutId: string
//   initialData?: WorkoutSession
// }

// export default function WorkoutTracker({ workoutId, initialData }: WorkoutTrackerProps) {
//   const t = useTranslations('workout')
//   const [session, setSession] = useState<WorkoutSession | null>(null)
//   const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
//   const [isLoading, setIsLoading] = useState(!initialData)
//   const [error, setError] = useState<string | null>(null)

//   // Carregar dados da sessão se não fornecidos
//   useEffect(() => {
//     if (initialData) {
//       setSession(initialData)
//       return
//     }

//     async function loadSession() {
//       try {
//         setIsLoading(true)
//         setError(null)
//         const data = await getWorkoutSession(workoutId)
//         setSession(data)
//       } catch (e) {
//         setError(e instanceof Error ? e.message : 'Erro ao carregar sessão')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadSession()
//   }, [workoutId, initialData])

//   // Renderização de estados
//   if (isLoading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>{t('loading')}</CardTitle>
//         </CardHeader>
//       </Card>
//     )
//   }

//   if (error || !session) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>{t('error')}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-destructive">{error}</p>
//           <Button 
//             variant="outline" 
//             onClick={() => window.location.reload()}
//             className="mt-4"
//           >
//             {t('try_again')}
//           </Button>
//         </CardContent>
//       </Card>
//     )
//   }

//   // Pegamos o exercício atual
//   const currentExercise = session.workout?.exercises[currentExerciseIndex]
//   if (!currentExercise) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>{t('no_exercises')}</CardTitle>
//         </CardHeader>
//       </Card>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>{session.workout?.name}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {/* Nome do exercício atual */}
//             <h2 className="text-2xl font-bold">
//               {currentExercise.name}
//             </h2>

//             {/* Meta de séries e repetições */}
//             <p className="text-muted-foreground">
//               {t('sets_goal', { 
//                 sets: currentExercise.targetSets,
//                 reps: `${currentExercise.targetRepsMin}-${currentExercise.targetRepsMax}`
//               })}
//             </p>

//             {/* TODO: Interface de registro de séries */}
//             {/* TODO: Histórico do exercício */}
//             {/* TODO: Controles de navegação */}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }