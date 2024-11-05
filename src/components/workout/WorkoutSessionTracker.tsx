// src/components/workout/WorkoutSessionTracker.tsx
'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/use-toast'
import { logSet } from '@/server/actions/sessions/index'
import type { WorkoutSession } from '@/types/shared'
import { SetLogger } from './SetLogger'

interface WorkoutSessionTrackerProps {
  session: WorkoutSession
  previousSession?: WorkoutSession
  initialExerciseId: string
}

export function WorkoutSessionTracker({ 
  session, 
  previousSession,
  initialExerciseId
}: WorkoutSessionTrackerProps) {
  const t = useTranslations('workout')
  const { toast } = useToast()
  
  // Encontra o exercício atual baseado no ID
  const currentExercise = session.workout?.exercises.find(
    ex => ex.id === initialExerciseId
  )

  // Mantemos apenas o estado das séries para o exercício atual
  const [currentSetNumber, setCurrentSetNumber] = useState(1)

  // Filtra as séries do exercício atual
  const currentExerciseSets = session.sets.filter(
    set => set.exerciseId === initialExerciseId
  ).sort((a, b) => a.setNumber - b.setNumber) // Garante ordem correta das séries

  // Funções de navegação entre séries
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

      // Avança para próxima série automaticamente se houver
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

  // Filtra as séries do exercício na sessão anterior
  const previousSets = previousSession?.sets.filter(
    set => set.exerciseId === currentExercise.id
  ).sort((a, b) => a.setNumber - b.setNumber) ?? []

  return (
    <div className="space-y-6">
      {/* Target de repetições */}
      <div className="text-sm text-muted-foreground text-center">
        {t('tracking.target_reps')}: {currentExercise.targetRepsMin}-{currentExercise.targetRepsMax}
      </div>

      {/* Componente de registro de séries */}
      <SetLogger
        exerciseId={currentExercise.id}
        sessionId={session.id}
        currentSetNumber={currentSetNumber}
        totalSets={currentExercise.targetSets}
        previousSets={previousSets}
        currentExerciseSets={currentExerciseSets}
        onPreviousSet={handlePreviousSet}
        onNextSet={handleNextSet}
        onLogSet={handleLogSet}
      />
    </div>
  )
}