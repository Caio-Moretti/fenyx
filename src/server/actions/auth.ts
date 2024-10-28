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
  console.log('Iniciando registro com dados:', {
    email: data.email,
    name: data.name,
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/pt-BR/auth/confirm`
  })
  
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { 
        name: data.name 
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/pt-BR/auth/confirm`
    }
  })

  // Log detalhado da resposta
  console.log('Resposta do Supabase:', {
    success: !!authData.user,
    error: error?.message,
    identities: authData.user?.identities
  })

  if (error) {
    switch (error.message) {
      case 'User already registered':
        return { 
          error: 'Este email já está registrado. Por favor, faça login ou recupere sua senha.'
        }
      case 'Password should be at least 6 characters':
        return {
          error: 'A senha deve ter pelo menos 6 caracteres.'
        }
      default:
        console.error('Erro no registro:', error)
        return { 
          error: 'Ocorreu um erro no registro. Por favor, tente novamente.'
        }
    }
  }

  // Se não há identities, significa que o usuário já existe
  if (!authData.user?.identities?.length) {
    return { 
      error: 'Este email já está associado a uma conta. Tente recuperar sua senha.'
    }
  }

  // Sucesso - redireciona para página de verificação
  redirect('/pt-BR/verify-email')
}