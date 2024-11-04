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
  previousSession,
  initialExerciseId
}: WorkoutSessionTrackerProps) {
  const t = useTranslations('workout')
  const { toast } = useToast()
  
  // Removemos o estado currentExerciseIndex pois agora lidamos com apenas um exercício
  const currentExercise = session.workout?.exercises.find(
    ex => ex.id === initialExerciseId
  )

  // Mantemos apenas o estado das séries para o exercício atual
  const [currentSetNumber, setCurrentSetNumber] = useState(1)

  // Simplificamos as funções de navegação apenas para séries
  const handlePreviousSet = useCallback(() => {
    if (currentSetNumber > 1) {
      setCurrentSetNumber(prev => prev - 1)
    }
  }, [currentSetNumber])

  const handleNextSet = useCallback(() => {
    if (!currentExercise?.targetSets) return
    if (currentSetNumber < currentExercise.targetSets) {
      setCurrentSetNumber(prev => prev + 1)
    }
  }, [currentExercise?.targetSets, currentSetNumber])

  const handleLogSet = useCallback(async (data: {
    weight: number
    reps: number
    difficulty: number
  }) => {
    if (!currentExercise) return

    try {
      await logSet({
        sessionId: session.id,
        exerciseId: currentExercise.id,
        setNumber: currentSetNumber,
        ...data
      })

      toast({
        title: t('tracking.set_logged'),
        description: t('tracking.set_logged_description', {
          exercise: currentExercise.name,
          setNumber: currentSetNumber
        })
      })

      // Avança para próxima série se houver
      if (currentSetNumber < currentExercise.targetSets) {
        handleNextSet()
      }
      
    } catch (error) {
      console.error('Error logging set:', error)
      toast({
        variant: 'destructive',
        title: t('errors.set_log_failed'),
        description: t('errors.try_again')
      })
    }
  }, [currentExercise, currentSetNumber, session.id, t, toast, handleNextSet])

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
      {/* Aqui pode ficar o target de repetições se quiser */}
      <div className="text-sm text-muted-foreground text-center">
        {t('tracking.target_reps')}: {currentExercise.targetRepsMin}-{currentExercise.targetRepsMax}
      </div>

      {/* Componente de registro de séries */}
      <SetLogger
        exerciseId={currentExercise.id}
        currentSetNumber={currentSetNumber}
        totalSets={currentExercise.targetSets}
        previousSets={previousSets}
        onPreviousSet={handlePreviousSet}
        onNextSet={handleNextSet}
        onLogSet={handleLogSet}
      />

      {/* Status do exercício */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground text-center">
            {t('tracking.sets_completed')}: {currentExerciseSets.length}/{currentExercise.targetSets}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}