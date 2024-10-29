// src/app/[locale]/(protected)/workouts/page.tsx
'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useWorkouts } from '@/hooks/useWorkouts'
import { Skeleton } from '@/components/ui/skeleton'

export default function WorkoutsPage() {
  const t = useTranslations()
  const { workouts, isLoading, error } = useWorkouts()
  
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
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
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
          <Link href="/workouts/new" className="gap-2">
            <Plus className="h-4 w-4" />
            {t('workout.create_workout')}
          </Link>
        </Button>
      </div>

      {/* Workouts Grid */}
      {workouts.length === 0 ? (
        // Empty State
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mx-auto w-full max-w-md space-y-4">
            <CardHeader>
              <CardTitle>{t('workout.no_workouts')}</CardTitle>
              <CardDescription>
                {t('workout.no_workouts_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/workouts/new" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('workout.create_first_workout')}
                </Link>
              </Button>
            </CardContent>
          </div>
        </Card>
      ) : (
        // Workouts List/Grid
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout) => (
            <Link 
              key={workout.id} 
              href={`/workouts/${workout.id}`}
              className="transition-transform hover:scale-[1.02]"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    {workout.name}
                  </CardTitle>
                  <CardDescription>
                    {workout.exercises?.length > 0 
                      ? t('workout.exercises', { count: workout.exercises.length })
                      : t('workout.no_exercises')}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="secondary" className="w-full gap-2">
                    {t('workout.start_workout')}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}