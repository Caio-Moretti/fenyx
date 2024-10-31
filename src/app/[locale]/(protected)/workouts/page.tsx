// src/app/[locale]/(protected)/workouts/page.tsx
'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { Dumbbell, Layers, Trash2 } from 'lucide-react'
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
import { useWorkouts } from '@/hooks/useWorkouts'
import { deleteWorkout } from '@/server/actions/workouts/index'

export default function WorkoutsPage() {
  const t = useTranslations()
  const { workouts, isLoading, error, refresh } = useWorkouts()
  const [isDeleting, setIsDeleting] = useState(false)
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!workoutToDelete) return

    try {
      setIsDeleting(true)
      setDeleteError(null)
      
      await deleteWorkout(workoutToDelete)
      
      setWorkoutToDelete(null)
      
      refresh()
      
    } catch (err) {
      console.error('Error deleting workout:', err)
      setDeleteError(
        err instanceof Error 
          ? err.message 
          : t('errors.delete_failed')
      )
    } finally {
      setIsDeleting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-10 w-[150px]" />
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[140px]" />
                <Skeleton className="h-4 w-[100px]" />
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

  // Error state
  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <CardHeader>
          <CardTitle className="text-destructive">{t('errors.load_failed')}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            {t('common.try_again')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('workout.my_workouts')}
          </h1>
          <p className="text-muted-foreground">
            {t('workout.manage_description')}
          </p>
        </div>
        
        <Button asChild>
          <Link href="/workouts/new">
            {t('workout.create_workout')}
          </Link>
        </Button>
      </div>

      {/* Workouts Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <Card 
            key={workout.id} 
            className="bg-card hover:bg-accent/50 transition-colors relative group"
          >
            <Link href={`/workouts/${workout.id}`} className="block">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{workout.name}</CardTitle>
                <CardContent className="p-0 pt-4">
                  <div className="space-y-3">
                    {/* Exercícios */}
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Dumbbell className="h-5 w-5 text-primary" />
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-medium text-foreground">
                          {workout.exercises?.length || 0}
                        </span>
                        <span className="text-sm">
                          {t(workout.exercises?.length === 1 ? 'workout.exercise' : 'workout.exercises')}
                        </span>
                      </div>
                    </div>

                    {/* Séries totais */}
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Layers className="h-5 w-5 text-primary" />
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-medium text-foreground">
                          {workout.exercises?.reduce((total, ex) => total + (ex.targetSets || 0), 0)}
                        </span>
                        <span className="text-sm">
                          {t('workout.total_sets')}
                        </span>
                      </div>
                    </div>

                    {/* Sessões realizadas */}
                    {/* <div className="flex items-center gap-3 text-muted-foreground">
                      <History className="h-5 w-5 text-primary" />
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-medium text-foreground">
                          {workout.completedSessions || 0}
                        </span>
                        <span className="text-sm">
                          {t('workout.completed_sessions')}
                        </span>
                      </div>
                    </div> */}
                  </div>
                </CardContent>
              </CardHeader>
            </Link>

            {/* Botão de delete */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8"
              onClick={(e) => {
                e.preventDefault();
                setWorkoutToDelete(workout.id);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-600"/>
              <span className="sr-only">{t('common.delete')}</span>
            </Button>
          </Card>
        ))}
      </div>

      {/* Dialog de confirmação de delete */}
      <AlertDialog 
        open={!!workoutToDelete} 
        onOpenChange={() => setWorkoutToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('workout.delete_confirmation_title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('workout.delete_confirmation_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {deleteError && (
            <p className="text-sm text-destructive">
              {deleteError}
            </p>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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