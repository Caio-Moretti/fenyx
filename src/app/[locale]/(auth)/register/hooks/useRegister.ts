'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { register } from '@/server/actions/auth'

export interface RegisterFormData {
  name: string
  email: string
  password: string
}

export function useRegister(locale: string) {
  const t = useTranslations()
  const [error, setError] = useState<string>('')
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>()

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('')
      
      const result = await register(data, locale)
      
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError(t('errors.unknown_error'))
    }
  }

  return {
    registerField,
    handleSubmit,
    errors,
    isSubmitting,
    error,
    onSubmit
  }
}