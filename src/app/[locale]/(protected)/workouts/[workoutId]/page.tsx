// src/app/[locale]/(protected)/workouts/[workoutId]/page.tsx
'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from '@/components/ui/skeleton'
import { startWorkoutSession } from '@/server/actions/sessions/index'
import { deleteSession } from '@/server/actions/sessions/deleteSession'
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions'
import { useWorkout } from '@/hooks/useWorkout'
import { formatDate } from '@/lib/dateUtils'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface WorkoutSessionsPageProps {
  params: {
    workoutId: string
  }
}

export default function WorkoutSessionsPage({ params }: WorkoutSessionsPageProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { sessions, isLoading: isLoadingSessions, error: sessionsError, refresh } = useWorkoutSessions(params.workoutId)
  const { workout, isLoading: isLoadingWorkout, error: workoutError } = useWorkout(params.workoutId)

  const handleStartSession = async () => {
    try {
      setIsStarting(true)
      setError(null)
      await startWorkoutSession(params.workoutId)
      refresh()
    } catch (err) {
      console.error('Error starting session:', err)
      setError(err instanceof Error ? err.message : t('errors.unknown_error'))
    } finally {
      setIsStarting(false)
    }
  }

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return

    try {
      setIsDeleting(true)
      await deleteSession(sessionToDelete)
      
      toast({
        title: t('workout.session_deleted'),
        description: t('workout.session_deleted_description'),
      })
      
      refresh()
      setSessionToDelete(null)
    } catch (err) {
      console.error('Error deleting session:', err)
      toast({
        variant: 'destructive',
        title: t('errors.delete_failed'),
        description: err instanceof Error ? err.message : t('errors.unknown_error')
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Loading states
  if (isLoadingWorkout || isLoadingSessions) {
    return (
      <div className="max-w-lg mx-auto p-4">
        {/* Header Skeleton */}
        <div className="flex items-start gap-2 mb-8">
          <div className="shrink-0 mt-1 w-10 h-10" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>

        {/* Button Skeleton */}
        <Skeleton className="w-full h-10 mb-6" />

        {/* Sessions List Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((_, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error states
  if (workoutError || sessionsError) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <Card className="border-0 shadow-sm bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">
              {t('errors.load_failed')}
            </CardTitle>
            <CardDescription>
              {workoutError || sessionsError}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              {t('common.try_again')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Header */}
      <div className="flex items-start gap-2 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          className="shrink-0 mt-1" 
          asChild
        >
          <Link href="/workouts">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">{t('common.back')}</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {t('workout.sessions')}
          </h1>
          <h2 className="text-lg font-semibold text-primary">
            {workout?.name}
          </h2>
        </div>
      </div>

      {/* Start Session Button */}
      <Button
        onClick={handleStartSession}
        disabled={isStarting}
        className="w-full mb-6"
      >
        {isStarting ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t('common.loading')}
          </div>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            {t('workout.start_new_session')}
          </>
        )}
      </Button>

      {/* Sessions List */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <Card 
              key={session.id} 
              className={cn(
                "border border-border/50 shadow-sm",
                "transition-colors hover:border-border",
                "active:bg-accent/50 focus-within:border-border"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-primary">
                      {t('workout.session_number', { 
                        number: sessions.length - index 
                      })}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(session.createdAt)}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive focus:text-destructive"
                    onClick={() => setSessionToDelete(session.id)}
                  >
                    <Trash2 className="h-4 w-4"/>
                    <span className="sr-only">{t('common.delete')}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                >
                  <Link href={`/workouts/${params.workoutId}/sessions/${session.id}`}>
                    {t('workout.view_session')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sessions.length === 0 && (
        <Card className="text-center border border-border/50 p-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {t('workout.no_sessions_title')}
            </CardTitle>
            <CardDescription>
              {t('workout.no_sessions_description')}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="mt-4 border-0 bg-destructive/10">
          <CardContent className="p-3">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!sessionToDelete} 
        onOpenChange={() => setSessionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('workout.delete_session_confirmation_title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('workout.delete_session_confirmation_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSession}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? t('common.loading') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}