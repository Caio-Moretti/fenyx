// src/server/actions/workouts/delete.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteWorkout(workoutId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!user) throw new Error('User not authenticated')

  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .select('user_id')
    .eq('id', workoutId)
    .single()

  if (workoutError) {
    throw workoutError
  }

  if (!workout) {
    throw new Error('Workout not found')
  }

  if (workout.user_id !== user.id) {
    throw new Error('You do not have permission to delete this workout')
  }

  const { error: deleteError } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId)

  if (deleteError) {
    throw deleteError
  }

  revalidatePath('/workouts')
}