// src/app/[locale]/(protected)/sessions/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, Dumbbell, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from '@/hooks/use-toast'
import { SessionSummary } from '@/components/workout/SessionSummary'
import { getWorkoutSessions } from '@/server/actions/sessions'
import { getWorkouts } from '@/server/actions/workouts/index'
import type { WorkoutSession } from '@/types/shared'
import type { Workout } from '@/types/shared'
import { cn } from '@/lib/utils'

export default function WorkoutSessionsPage() {
  const t = useTranslations()
  const { toast } = useToast()

  // Estados
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('')
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true)
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Encontra o treino selecionado
  const selectedWorkout = workouts.find(w => w.id === selectedWorkoutId)

  // Carrega a lista de treinos disponíveis
  useEffect(() => {
    async function loadWorkouts() {
      try {
        setIsLoadingWorkouts(true)
        setError(null)

        const workoutsData = await getWorkouts()
        setWorkouts(workoutsData)

        // Se houver treinos, seleciona o primeiro por padrão
        if (workoutsData.length > 0) {
          setSelectedWorkoutId(workoutsData[0].id)
        }

      } catch (err) {
        console.error('Error loading workouts:', err)
        setError(
          err instanceof Error 
            ? err.message 
            : t('errors.workouts_load_failed')
        )
        
        toast({
          variant: 'destructive',
          title: t('errors.workouts_load_failed'),
          description: t('errors.try_again')
        })
      } finally {
        setIsLoadingWorkouts(false)
      }
    }

    loadWorkouts()
  }, [t, toast])

  // Carrega as sessões do treino selecionado
  useEffect(() => {
    async function loadSessions() {
      if (!selectedWorkoutId) return

      try {
        setIsLoadingSessions(true)
        setError(null)

        const sessionsData = await getWorkoutSessions(selectedWorkoutId)
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
        setIsLoadingSessions(false)
      }
    }

    if (selectedWorkoutId) {
      loadSessions()
    }
  }, [selectedWorkoutId, t, toast])

  if (isLoadingWorkouts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Se não houver treinos cadastrados
  if (workouts.length === 0) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="py-8 space-y-4 text-center">
          <p className="text-muted-foreground">
            {t('workout.no_workouts')}
          </p>
          <Button asChild variant="outline">
            <Link href="/workouts/new">
              {t('workout.create_first')}
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
          <Link href="/workouts">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">{t('common.back')}</span>
          </Link>
        </Button>

        <h1 className="text-2xl font-bold">
          {t('workout.sessions_words.history')}
        </h1>
      </div>

      {/* Card Principal com Dropdown */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Card 
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent/50",
              isOpen && "bg-accent/50"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">
                      {selectedWorkout?.name || t('workout.select_workout')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedWorkout?.exercises.length || 0}{' '}
                      {t(
                        selectedWorkout?.exercises.length === 1 
                          ? 'workout.exercise' 
                          : 'workout.exercises'
                      )}
                    </p>
                  </div>
                </div>
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  )} 
                />
              </div>
            </CardContent>
          </Card>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100%-2rem)] p-0" align="center">
          <div className="max-h-[300px] overflow-y-auto py-1">
            {workouts.map(workout => (
              <div
                key={workout.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-accent/50 transition-colors",
                  workout.id === selectedWorkoutId && "bg-accent/50"
                )}
                onClick={() => {
                  setSelectedWorkoutId(workout.id)
                  setIsOpen(false)
                }}
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {workout.exercises.length}{' '}
                    {t(
                      workout.exercises.length === 1 
                        ? 'workout.exercise' 
                        : 'workout.exercises'
                    )}
                  </p>
                </div>
                {workout.id === selectedWorkoutId && (
                  <div className="ml-auto">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Estado de carregamento das sessões */}
      {isLoadingSessions ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <Card className="mx-auto">
          <CardContent className="py-8 space-y-4 text-center">
            <p className="text-muted-foreground">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => setSelectedWorkoutId(selectedWorkoutId)}
            >
              {t('common.try_again')}
            </Button>
          </CardContent>
        </Card>
      ) : sessions.length === 0 ? (
        <Card className="mx-auto">
          <CardContent className="py-8 space-y-4 text-center">
            <p className="text-muted-foreground">
              {t('workout.sessions_words.no_sessions')}
            </p>
            <Button asChild variant="outline">
              <Link href={`/workouts/${selectedWorkoutId}`}>
                {t('workout.start_session')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Componente de Resumo da Sessão */
        <SessionSummary
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionChange={setCurrentSessionId}
        />
      )}
    </div>
  )
}