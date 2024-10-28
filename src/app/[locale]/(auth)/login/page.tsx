// src/app/[locale]/(auth)/login/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/server/actions/auth'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const t = useTranslations()
  const [error, setError] = useState<string>('')
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    
    const result = await login(data)
    
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t('auth.sign_in')}</CardTitle>
          <CardDescription>
            {t('auth.welcome_back')}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Email */}
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

            {/* Password */}
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

            {/* General error */}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </CardContent>

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
        </form>
      </Card>
    </div>
  )
}