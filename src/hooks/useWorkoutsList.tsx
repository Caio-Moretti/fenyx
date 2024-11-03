// src/hooks/useWorkoutsList.ts
'use client'

import { useState, useEffect } from 'react'
import { getWorkouts } from '@/server/actions/workouts/index'
import type { Workout } from '@/types/shared'

export function useWorkoutsList() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await getWorkouts()
        setWorkouts(data)
      } catch (error) {
        console.error('Error loading workouts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkouts()
  }, [])

  return {
    workouts,
    isLoading
  }
}