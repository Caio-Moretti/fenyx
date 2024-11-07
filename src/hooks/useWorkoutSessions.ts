// src/hooks/useWorkoutSessions.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { WorkoutSession } from '@/types/shared'
import { getWorkoutSessions, startWorkoutSession } from '@/server/actions/sessions/index'
import { useRouter } from 'next/navigation'

export function useWorkoutSessions(workoutId: string) {
  const router = useRouter()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
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

  // Função para iniciar uma nova sessão
  const startSession = useCallback(async () => {
    try {
      setIsStarting(true)
      setError(null)
      
      // Cria a nova sessão
      const newSession = await startWorkoutSession(workoutId)
      
      // Atualiza o estado local adicionando a nova sessão
      setSessions(prev => [newSession, ...prev])
      
      // Navega para a nova sessão
      router.push(`/workouts/${workoutId}/sessions/${newSession.id}`)
      
    } catch (err) {
      console.error('Error starting session:', err)
      setError(err instanceof Error ? err.message : 'Failed to start session')
      throw err // Re-throw para que o componente possa tratar se necessário
    } finally {
      setIsStarting(false)
    }
  }, [workoutId, router])

  // Efeito para carregar as sessões quando o workoutId mudar
  useEffect(() => {
    loadSessions()
  }, [workoutId, loadSessions])

  return {
    sessions,
    isLoading,
    isStarting,
    error,
    refresh: loadSessions,
    startSession
  }
}