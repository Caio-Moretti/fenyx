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
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions'
import { formatDate } from '@/lib/dateUtils'
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
  const { sessions, isLoading, refresh } = useWorkoutSessions(params.workoutId)
  const [newSession, setNewSession] = useState<WorkoutSession | null>(null)

  // Função para iniciar uma nova sessão
  const handleStartSession = async () => {
    try {
      setIsStarting(true)
      setError(null)

      const session = await startWorkoutSession(params.workoutId)
      setNewSession(session)
      refresh() // Atualiza a lista de sessões
      
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

      <div className="space-y-4">
        {/* Sessão Nova (se existir) */}
        {newSession && (
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>
                {t('workout.session_number', { 
                  number: sessions.length + 1
                })}
              </CardTitle>
              <CardDescription>
                {t('workout.click_to_start_tracking')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

        {/* Estado vazio */}
        {sessions.length === 0 && !newSession && (
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
            </CardContent>
          </Card>
        )}

        {/* Lista de Sessões */}
        {sessions.length > 0 && (
          <>
            {/* Lista de sessões anteriores */}
            {sessions.map((session, index) => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle className='text-red-600'>
                    {t('workout.session_number', { 
                      number: sessions.length - index 
                    })}
                  </CardTitle>
                  <CardDescription>
                    {formatDate(session.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/workouts/${params.workoutId}/sessions/${session.id}`}>
                      {t('workout.view_session')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Botão de nova sessão (se não houver uma em criação) */}
            {!newSession && (
              <Button
                onClick={handleStartSession}
                disabled={isStarting}
                className="w-full gap-2 bg-red-600"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                {isStarting 
                  ? t('common.loading')
                  : t('workout.start_new_session')
                }
              </Button>
            )}
          </>
        )}

        {/* Erro */}
        {error && (
          <p className="text-sm text-destructive mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}