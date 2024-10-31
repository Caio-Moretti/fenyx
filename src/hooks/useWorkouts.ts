// src/hooks/useWorkouts.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Workout } from '@/types/shared'
import { getWorkouts } from '@/server/actions/workouts/index'

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadWorkouts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getWorkouts()
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid workouts data received')
      }

      const processedWorkouts = data.map(workout => ({
        ...workout,
        exercises: workout.exercises || []
      }))

      setWorkouts(processedWorkouts)
    } catch (e) {
      console.error('Error loading workouts:', e)
      setError(e instanceof Error ? e.message : 'Failed to load workouts')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWorkouts()
  }, [loadWorkouts])

  useEffect(() => {
    console.log('Current workouts state:', workouts)
  }, [workouts])

  return {
    workouts,
    isLoading,
    error,
    refresh: loadWorkouts
  }
}