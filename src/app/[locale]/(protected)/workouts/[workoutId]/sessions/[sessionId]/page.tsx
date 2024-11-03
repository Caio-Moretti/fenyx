// src/app/[locale]/(protected)/workouts/[workoutId]/sessions/[sessionId]/page.tsx
'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, LineChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useWorkoutSession } from '@/hooks/useWorkoutSession'
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions'
import { formatDate } from '@/lib/dateUtils'
import { cn } from '@/lib/utils'

interface SessionExercisesPageProps {
  params: {
    workoutId: string
    sessionId: string
  }
}

export default function SessionExercisesPage({ params }: SessionExercisesPageProps) {
  const t = useTranslations()
  const { session, isLoading: isLoadingSession, error: sessionError } = useWorkoutSession(params.sessionId)
  const { sessions, isLoading: isLoadingSessions } = useWorkoutSessions(params.workoutId)
  
  // Calcula o número da sessão
  const sessionNumber = !isLoadingSessions && sessions.length > 0 
    ? sessions.length - sessions.findIndex(s => s.id === params.sessionId)
    : null

  // Loading state
  if (isLoadingSession || isLoadingSessions) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <div className="flex items-start gap-2 mb-8">
          <div className="shrink-0 mt-1">
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-secondary/90">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Card className="border border-secondary/90">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  // Error state
  if (sessionError || !session?.workout) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <Card className="border border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">
              {t('errors.load_failed')}
            </CardTitle>
            <CardDescription>
              {sessionError || t('errors.session_not_found')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href={`/workouts/${params.workoutId}`}>
                {t('workout.return_to_sessions')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-8">
            {/* Botão de voltar */}
            <Button 
                variant="ghost" 
                size="icon"
                className="shrink-0 -ml-2 mt-0.5" 
                asChild
            >
                <Link href={`/workouts/${params.workoutId}`}>
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">{t('common.back')}</span>
                </Link>
            </Button>

            {/* Conteúdo principal */}
            <div className="flex-1 min-w-0"> {/* min-w-0 previne overflow */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h1 className="text-xl font-bold truncate">
                        {session.workout.name}
                    </h1>
                    
                    {/* Número da sessão */}
                    {sessionNumber && (
                        <div className="shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                {t('workout.session')} {sessionNumber}
                            </span>
                        </div>
                    )}
                </div>

                {/* Data */}
                <p className="text-sm text-muted-foreground">
                    {formatDate(session.createdAt)}
                </p>
            </div>
        </div>

      {/* Lista de Exercícios */}
      <div className="space-y-3">
        {session.workout.exercises.map((exercise) => (
          <Card 
            key={exercise.id} 
            className={cn(
              "border border-secondary/90 hover:border-secondary transition-colors",
              "hover:bg-accent/50"
            )}
          >
            <Link href={`/workouts/${params.workoutId}/sessions/${params.sessionId}/exercises/${exercise.id}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {exercise.name}
                </CardTitle>
                <CardDescription>
                  {t('workout.sets_info', {
                    current: (session.sets ?? []).filter(s => s.exerciseId === exercise.id).length,
                    total: exercise.targetSets
                  })}
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>

      {/* Card de Resumo da Sessão como botão */}
      <Link 
        href={`/workouts/${params.workoutId}/sessions/${params.sessionId}/dashboard`}
        className="block mt-6"
      >
        <Card 
          className={cn(
            "relative overflow-hidden",
            "bg-gradient-to-br from-red-500/90 to-red-600/90",
            "hover:from-red-500 hover:to-red-600",
            "border-none shadow-lg",
            "transform transition-all duration-300",
            "hover:scale-[1.02] hover:shadow-xl",
            "cursor-pointer"
          )}
        >
          {/* Overlay pattern para dar profundidade */}
          <div className="absolute inset-0 bg-[linear-gradient(60deg,transparent_40%,rgba(255,255,255,0.1)_45%,rgba(255,255,255,0.1)_55%,transparent_60%)] pointer-events-none" />

          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <LineChart className="h-5 w-5" strokeWidth={2.5} />
                  {t('workout.session_summary')}
                </CardTitle>
                <CardDescription className="text-white/90 font-medium">
                  {t('workout.total_volume')}: {
                    (session.sets ?? []).reduce((acc, set) => acc + (set.weight * set.reps), 0)
                  }kg
                </CardDescription>
              </div>
              
              {/* Ícone de seta */}
              <div className="text-white/80 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm text-white/90">
                <span>{t('workout.progress')}</span>
                <span className="font-medium">
                  {Math.round((session.sets?.length || 0) / 
                    (session.workout.exercises.reduce((acc, ex) => acc + ex.targetSets, 0)) * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/90 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.round((session.sets?.length || 0) / 
                      (session.workout.exercises.reduce((acc, ex) => acc + ex.targetSets, 0)) * 100)}%` 
                  }}
                />
              </div>
            </div>
          </CardHeader>
        </Card>
      </Link>
    </div>
  )
}