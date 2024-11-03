// src/hooks/useWorkout.ts
'use client'

import { useState, useEffect } from 'react'
import type { Workout } from '@/types/shared'
import { getWorkout } from '@/server/actions/workouts/index'

export function useWorkout(workoutId: string) {
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadWorkout() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getWorkout(workoutId)
        setWorkout(data)
      } catch (err) {
        console.error('Error loading workout:', err)
        setError(err instanceof Error ? err.message : 'Failed to load workout')
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkout()
  }, [workoutId])

  return {
    workout,
    isLoading,
    error,
  }
}