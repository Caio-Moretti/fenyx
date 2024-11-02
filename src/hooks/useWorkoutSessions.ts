// src/hooks/useWorkoutSessions.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { WorkoutSession } from '@/types/shared'
import { getWorkoutSessions } from '@/server/actions/sessions/index'

export function useWorkoutSessions(workoutId: string) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para carregar as sessões
  const loadSessions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getWorkoutSessions(workoutId)
      setSessions(data)
    } catch (err) {
      console.error('Error loading sessions:', err)
      setError(err instanceof Error ? err.message : 'Failed to load sessions')
    } finally {
      setIsLoading(false)
    }
  }, [workoutId])

  // Efeito para carregar as sessões quando o workoutId mudar
  useEffect(() => {
    loadSessions()
  }, [workoutId, loadSessions]) // Adicionamos workoutId e loadSessions como dependências

  return {
    sessions,
    isLoading,
    error,
    refresh: loadSessions
  }
}