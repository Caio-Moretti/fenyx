// src/server/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface RegisterData {
  name: string
  email: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

interface PasswordResetRequestData {
  email: string
}

interface PasswordResetData {
  password: string
}

export async function register(data: RegisterData) {
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { 
        name: data.name 
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}`
    }
  })

  if (error) {
    switch (error.message) {
      case 'User already registered':
        return { error: 'Este email já está registrado. Por favor, faça login ou recupere sua senha.' }
      case 'Password should be at least 6 characters':
        return { error: 'A senha deve ter pelo menos 6 caracteres.' }
      default:
        console.error('Erro no registro:', error)
        return { error: 'Ocorreu um erro no registro. Por favor, tente novamente.' }
    }
  }

  if (!authData.user?.identities?.length) {
    return { error: 'Este email já está associado a uma conta. Tente recuperar sua senha.' }
  }

  redirect('/auth/verify-email')
}

export async function login(data: LoginData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    switch (error.message) {
      case 'Invalid login credentials':
        return { error: 'Email ou senha incorretos.' }
      case 'Email not confirmed':
        return { error: 'Por favor, confirme seu email antes de fazer login.' }
      default:
        console.error('Erro no login:', error)
        return { error: 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.' }
    }
  }

  redirect('/dashboard')
}

export async function requestPasswordReset(data: PasswordResetRequestData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/pt-BR/reset-password`,
  })

  if (error) {
    console.error('Erro ao solicitar reset de senha:', error)
    return { 
      error: 'Ocorreu um erro ao solicitar a redefinição de senha. Por favor, tente novamente.' 
    }
  }

  return { success: true }
}


export async function resetPassword(data: PasswordResetData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: data.password
  })

  if (error) {
    switch (error.message) {
      case 'Password should be at least 6 characters':
        return { error: 'A senha deve ter pelo menos 6 caracteres.' }
      case 'New password should be different from the old password':
        return { error: 'A nova senha deve ser diferente da senha atual.' }
      default:
        console.error('Erro ao atualizar senha:', error)
        return { error: 'Ocorreu um erro ao atualizar a senha. Por favor, tente novamente.' }
    }
  }

  redirect('/dashboard')
}


export async function logout(locale: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Erro ao fazer logout:', error)
    return { error: 'Ocorreu um erro ao tentar sair. Por favor, tente novamente.' }
  }

  redirect(`/${locale}/login`)
}