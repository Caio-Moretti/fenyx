// src/app/[locale]/(protected)/workouts/[workoutId]/sessions/[sessionId]/[exerciseId]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { getWorkoutSession } from '@/server/actions/sessions/index'
import { WorkoutSessionTracker } from '@/components/workout/WorkoutSessionTracker'
import type { WorkoutSession } from '@/types/shared'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function WorkoutExercisePage() {
  const t = useTranslations('workout')
  const { toast } = useToast()
  const params = useParams()
  const { workoutId, sessionId, exerciseId } = params

  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [previousSession, setPreviousSession] = useState<WorkoutSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSession() {
      try {
        setIsLoading(true)
        setError(null)

        if (!sessionId || typeof sessionId !== 'string') {
          throw new Error('Invalid session ID')
        }

        const sessionData = await getWorkoutSession(sessionId)
        setSession(sessionData)

        // TODO: Implementar carregamento da sessão anterior
        // const previousSessionData = await getPreviousSession(workoutId as string)
        // setPreviousSession(previousSessionData)

      } catch (error) {
        console.error('Error loading session:', error)
        setError(
          error instanceof Error 
            ? error.message 
            : t('errors.session_load_failed')
        )
        
        toast({
          variant: 'destructive',
          title: t('errors.session_load_failed'),
          description: t('errors.try_again')
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [sessionId, workoutId, t, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !session) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="py-8 space-y-4 text-center">
          <p className="text-muted-foreground">
            {error || t('errors.session_not_found')}
          </p>
          <Button asChild variant="outline">
            <Link href={`/workouts/${workoutId}`}>
              {t('common.back_to_workout')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentExercise = session.workout?.exercises.find(
    ex => ex.id === exerciseId
  )

  if (!currentExercise) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="py-8 space-y-4 text-center">
          <p className="text-muted-foreground">
            {t('errors.exercise_not_found')}
          </p>
          <Button asChild variant="outline">
            <Link href={`/workouts/${workoutId}/sessions/${sessionId}`}>
              {t('common.back_to_session')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-6 space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {session.workout?.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('tracking.session_started', {
              time: new Date(session.createdAt).toLocaleTimeString()
            })}
          </p>
        </div>

        <Button
          variant="outline"
          asChild
        >
          <Link href={`/workouts/${workoutId}/sessions/${sessionId}`}>
            {t('tracking.exercise_list')}
          </Link>
        </Button>
      </div>

      {/* Tracker do exercício */}
      <WorkoutSessionTracker
        session={session}
        previousSession={previousSession ?? undefined}
        initialExerciseId={exerciseId as string}
      />
    </div>
  )
}