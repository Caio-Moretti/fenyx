// src/app/[locale]/(auth)/login/hooks/useLogin.ts
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { login } from '@/server/actions/auth'

export interface LoginFormData {
  email: string
  password: string
}

export function useLogin() {
  const t = useTranslations()
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true)
      setError('')
      
      const result = await login(data)
      
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError(t('errors.unknown_error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    error,
    isSubmitting,
    handleLogin
  }
}