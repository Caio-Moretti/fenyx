// src/components/workout/WorkoutSessionTracker.tsx
'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SetLogger } from './SetLogger'
import { useToast } from '@/hooks/use-toast'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { logSet } from '@/server/actions/sessions/index'
import type { WorkoutSession } from '@/types/shared'

interface WorkoutSessionTrackerProps {
    session: WorkoutSession
    previousSession?: WorkoutSession
    initialExerciseId: string  // Novo: ID do exercício inicial
}

export function WorkoutSessionTracker({ 
  session, 
  previousSession 
}: WorkoutSessionTrackerProps) {
  const t = useTranslations('workout')
  const { toast } = useToast()
  
  // Estado para controlar exercício e série atual
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetNumbers, setCurrentSetNumbers] = useState<Record<string, number>>(() => {
    // Inicializa com 1 para cada exercício
    if (session.workout?.exercises) {
      return Object.fromEntries(
        session.workout.exercises.map(ex => [ex.id, 1])
      )
    }
    return {}
  })

  const handlePreviousExercise = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1)
    }
  }, [currentExerciseIndex])

  const handleNextExercise = useCallback(() => {
    if (!session.workout?.exercises) return
    
    if (currentExerciseIndex < session.workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
    }
  }, [currentExerciseIndex, session.workout?.exercises])

  const handlePreviousSet = useCallback(() => {
    const currentExercise = session.workout?.exercises?.[currentExerciseIndex]
    if (!currentExercise) return

    if (currentSetNumbers[currentExercise.id] > 1) {
      setCurrentSetNumbers(prev => ({
        ...prev,
        [currentExercise.id]: prev[currentExercise.id] - 1
      }))
    }
  }, [currentExerciseIndex, currentSetNumbers, session.workout?.exercises])

  const handleNextSet = useCallback(() => {
    const currentExercise = session.workout?.exercises?.[currentExerciseIndex]
    if (!currentExercise?.targetSets) return

    if (currentSetNumbers[currentExercise.id] < currentExercise.targetSets) {
      setCurrentSetNumbers(prev => ({
        ...prev,
        [currentExercise.id]: prev[currentExercise.id] + 1
      }))
    }
  }, [currentExerciseIndex, currentSetNumbers, session.workout?.exercises])

  const handleLogSet = useCallback(async (data: {
    weight: number
    reps: number
    difficulty: number
  }) => {
    const currentExercise = session.workout?.exercises?.[currentExerciseIndex]
    if (!session.workout?.exercises || !currentExercise) return

    try {
      // Registra a série
      await logSet({
        sessionId: session.id,
        exerciseId: currentExercise.id,
        setNumber: currentSetNumbers[currentExercise.id],
        ...data
      })

      // Feedback de sucesso
      toast({
        title: t('tracking.set_logged'),
        description: t('tracking.set_logged_description', {
          exercise: currentExercise.name,
          setNumber: currentSetNumbers[currentExercise.id]
        })
      })

      // Avança para próxima série ou exercício
      if (currentSetNumbers[currentExercise.id] < currentExercise.targetSets) {
        handleNextSet()
      } else if (currentExerciseIndex < session.workout.exercises.length - 1) {
        handleNextExercise()
      }
      
    } catch (error) {
      console.error('Error logging set:', error)
      toast({
        variant: 'destructive',
        title: t('errors.set_log_failed'),
        description: t('errors.try_again')
      })
    }
  }, [
    currentExerciseIndex,
    currentSetNumbers,
    session.id,
    session.workout?.exercises,
    t,
    toast,
    handleNextSet,
    handleNextExercise
  ])

  if (!session.workout?.exercises?.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            {t('errors.no_workout_data')}
          </p>
        </CardContent>
      </Card>
    )
  }

  const currentExercise = session.workout.exercises[currentExerciseIndex]
  if (!currentExercise) {
    return null
  }

  const previousSets = previousSession?.sets.filter(
    set => set.exerciseId === currentExercise.id
  ) ?? []

  const currentExerciseSets = session.sets.filter(
    set => set.exerciseId === currentExercise.id
  )

  return (
    <div className="space-y-6">
      {/* Cabeçalho com navegação entre exercícios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousExercise}
              disabled={currentExerciseIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <CardTitle>
              {currentExercise.name}
            </CardTitle>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextExercise}
              disabled={!session.workout?.exercises || currentExerciseIndex === session.workout.exercises.length - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center">
            {t('tracking.target_reps')}: {currentExercise.targetRepsMin}-{currentExercise.targetRepsMax}
          </div>
        </CardContent>
      </Card>

      {/* Componente de registro de séries */}
      <SetLogger
        exerciseId={currentExercise.id}
        currentSetNumber={currentSetNumbers[currentExercise.id]}
        totalSets={currentExercise.targetSets}
        previousSets={previousSets}
        onPreviousSet={handlePreviousSet}
        onNextSet={handleNextSet}
        onLogSet={handleLogSet}
      />

      {/* Status do exercício atual */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {t('tracking.sets_completed')}: {currentExerciseSets.length}/{currentExercise.targetSets}
            </span>
            <span>
              {t('tracking.exercise')}: {currentExerciseIndex + 1}/{session.workout.exercises.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}