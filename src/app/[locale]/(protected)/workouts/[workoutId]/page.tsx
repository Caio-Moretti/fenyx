// src/app/[locale]/(protected)/workouts/[workoutId]/page.tsx
'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { startWorkoutSession } from '@/server/actions/sessions/index'
import type { WorkoutSession } from '@/types/shared'

interface WorkoutSessionsPageProps {
  params: {
    workoutId: string
  }
}

export default function WorkoutSessionsPage({ params }: WorkoutSessionsPageProps) {
  const t = useTranslations()
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newSession, setNewSession] = useState<WorkoutSession | null>(null)

  // Função para iniciar uma nova sessão
  const handleStartSession = async () => {
    try {
      setIsStarting(true)
      setError(null)

      const session = await startWorkoutSession(params.workoutId)
      setNewSession(session)
      
    } catch (err) {
      console.error('Error starting session:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : t('errors.unknown_error')
      )
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
        >
          <Link href="/workouts">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">{t('common.back')}</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('workout.sessions')}
          </h1>
          <p className="text-muted-foreground">
            {t('workout.sessions_description')}
          </p>
        </div>
      </div>

      {/* Empty State ou Create Session Card */}
      {!newSession ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <CardHeader>
            <CardTitle>{t('workout.no_sessions_title')}</CardTitle>
            <CardDescription>
              {t('workout.no_sessions_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleStartSession}
              disabled={isStarting}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {isStarting 
                ? t('common.loading')
                : t('workout.start_first_session')
              }
            </Button>

            {error && (
              <p className="text-sm text-destructive mt-4">
                {error}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        // Card da nova sessão criada
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>{t('workout.new_session_created')}</CardTitle>
            <CardDescription>
              {t('workout.click_to_start_tracking')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full gap-2">
              <Link href={`/workouts/${params.workoutId}/sessions/${newSession.id}`}>
                {t('workout.go_to_session')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
          {/* Efeito de highlight */}
          <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
        </Card>
      )}
    </div>
  )
}