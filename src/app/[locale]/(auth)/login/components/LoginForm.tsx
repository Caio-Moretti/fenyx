'use client'

import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { login } from '@/server/actions/auth'
import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginForm() {
    const t = useTranslations()
    const [error, setError] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm<LoginFormData>()
  
    const onSubmit = async (data: LoginFormData) => {
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
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <EmailField register={register} errors={errors} />
          <PasswordField register={register} errors={errors} />
          <FormError error={error} />
        </CardContent>
  
        <FormActions isSubmitting={isSubmitting} />
      </form>
    )
  }

function EmailField({ 
  register, 
  errors
}: { 
  register: any, 
  errors: any
}) {
  const t = useTranslations()
  
  return (
    <div className="space-y-2">
      <Label htmlFor="email">{t('auth.email')}</Label>
      <Input
        id="email"
        type="email"
        {...register('email', { 
          required: t('errors.email_required'),
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t('errors.email_invalid')
          }
        })}
      />
      {errors.email && (
        <p className="text-sm text-destructive">{errors.email.message}</p>
      )}
    </div>
  )
}

function PasswordField({ 
  register, 
  errors
}: { 
  register: any, 
  errors: any
}) {
  const t = useTranslations()
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="password">{t('auth.password')}</Label>
        <Link 
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          {t('auth.forgot_password')}
        </Link>
      </div>
      <Input
        id="password"
        type="password"
        {...register('password', { 
          required: t('errors.password_required')
        })}
      />
      {errors.password && (
        <p className="text-sm text-destructive">{errors.password.message}</p>
      )}
    </div>
  )
}

function FormError({ error }: { error: string }) {
  if (!error) return null
  
  return <p className="text-sm text-destructive">{error}</p>
}

function FormActions({ 
  isSubmitting
}: { 
  isSubmitting: boolean
}) {
  const t = useTranslations()
  
  return (
    <CardFooter className="flex flex-col space-y-4">
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('common.loading') : t('auth.sign_in')}
      </Button>

      <Button 
        type="button"
        variant="outline" 
        className="w-full"
        onClick={() => {/* TODO: Implement Google login */}}
      >
        {t('auth.google_sign_in')}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        {t('auth.dont_have_account')}{' '}
        <Link 
          href="/register" 
          className="text-primary hover:underline"
        >
          {t('auth.sign_up')}
        </Link>
      </p>
    </CardFooter>
  )
}
