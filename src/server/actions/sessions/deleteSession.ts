// src/server/actions/sessions/deleteSession.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteSession(sessionId: string) {
  const supabase = await createClient()

  try {
    // 1. Primeiro vamos buscar a sessão para ter o workout_id (para revalidação)
    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .select('workout_id')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      throw new Error('Session not found')
    }

    // 2. Deleta a sessão (as séries serão deletadas em cascade)
    const { error: deleteError } = await supabase
      .from('workout_sessions')
      .delete()
      .eq('id', sessionId)

    if (deleteError) {
      throw deleteError
    }

    // 3. Revalida o caminho do workout para atualizar a lista
    revalidatePath(`/workouts/${session.workout_id}`)

  } catch (error) {
    console.error('Error deleting session:', error)
    throw error
  }
}