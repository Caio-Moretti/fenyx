// src/hooks/useWorkouts.ts
'use client'

import { useState, useEffect } from 'react'
import type { Workout } from '@/types/shared'
import { getWorkouts } from '@/server/actions/workouts'

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadWorkouts() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getWorkouts()
        setWorkouts(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load workouts')
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkouts()
  }, [])

  return {
    workouts,
    isLoading,
    error,
    // Podemos adicionar mais funções aqui depois, como:
    // createWorkout, updateWorkout, deleteWorkout, etc.
  }
}