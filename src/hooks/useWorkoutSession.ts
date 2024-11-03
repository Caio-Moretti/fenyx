// src/hooks/useWorkoutSession.ts

'use client'

import { useState, useEffect } from 'react'
import type { WorkoutSession } from '@/types/shared'
import { getWorkoutSession } from '@/server/actions/sessions/index'

export function useWorkoutSession(sessionId: string) {
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSession() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getWorkoutSession(sessionId)
        setSession(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load session')
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [sessionId])

  return {
    session,
    isLoading,
    error,
  }
}