// src/app/[locale]/(protected)/workouts/[workoutId]/sessions/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { SessionSummary } from '@/components/workout/SessionSummary'
import { getWorkoutSessions } from '@/server/actions/sessions'
import type { WorkoutSession } from '@/types/shared'

export default function WorkoutSessionsPage() {
  const t = useTranslations()
  const { toast } = useToast()
  const params = useParams()
  const { workoutId } = params

  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSessions() {
      if (!workoutId || typeof workoutId !== 'string') return

      try {
        setIsLoading(true)
        setError(null)

        const sessionsData = await getWorkoutSessions(workoutId)
        setSessions(sessionsData)
        
        // Define a sessão mais recente como atual
        if (sessionsData.length > 0) {
          setCurrentSessionId(sessionsData[0].id)
        }

      } catch (err) {
        console.error('Error loading sessions:', err)
        setError(
          err instanceof Error 
            ? err.message 
            : t('errors.sessions_load_failed')
        )
        
        toast({
          variant: 'destructive',
          title: t('errors.sessions_load_failed'),
          description: t('errors.try_again')
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSessions()
  }, [workoutId, t, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || sessions.length === 0) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="py-8 space-y-4 text-center">
          <p className="text-muted-foreground">
            {error || t('workout.sessions.no_sessions')}
          </p>
          <Button asChild variant="outline">
            <Link href={`/workouts/${workoutId}`}>
              {t('common.back')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-4 space-y-6">
      {/* Cabeçalho */}
      <div className="relative flex items-center justify-center">
        <Button 
          variant="ghost" 
          size="icon"
          asChild
          className="absolute left-0"
        >
          <Link href={`/workouts/${workoutId}`}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">{t('common.back')}</span>
          </Link>
        </Button>

        <h1 className="text-2xl font-bold">
          {t('workout.sessions_words.history')}
        </h1>
      </div>

      {/* Componente de Resumo da Sessão */}
      <SessionSummary
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionChange={setCurrentSessionId}
      />
    </div>
  )
}