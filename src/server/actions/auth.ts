// src/server/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface RegisterData {
  name: string
  email: string
  password: string
}

export async function register(data: RegisterData) {
    console.log('Register data:', data); // Log dos dados recebidos
    
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name }
      }
    })
  
    console.log('Supabase response:', error); // Log da resposta
    
    if (error) {
      return { error: error.message }
    }
  
    // redirect('/auth/verify-email')
    console.log("redirect para verify email")
  }