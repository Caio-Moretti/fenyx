// src/app/[locale]/(auth)/forgot-password/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/server/actions/auth'

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
import { MailCheck } from 'lucide-react'

interface ForgotPasswordFormData {
  email: string
}

export default function ForgotPasswordPage() {
  const t = useTranslations()
  const [error, setError] = useState<string>('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormData>()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError('')
      const result = await requestPasswordReset(data)
      
      if (result?.error) {
        setError(result.error)
      } else {
        setIsEmailSent(true)
      }
    } catch (err) {
      setError(t('errors.unknown_error'))
    }
  }

  // Se o email foi enviado com sucesso, mostra a mensagem de confirmação
  if (isEmailSent) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>{t('auth.reset_password.check_email_title')}</CardTitle>
            <CardDescription>
              {t('auth.reset_password.check_email_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {t('auth.reset_password.check_spam')}
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsEmailSent(false)}
            >
              {t('auth.reset_password.try_different_email')}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link 
              href="/login" 
              className="text-sm text-primary hover:underline"
            >
              {t('auth.back_to_login')}
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t('auth.reset_password.title')}</CardTitle>
          <CardDescription>
            {t('auth.reset_password.description')}
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

            {/* Erro geral */}
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
              {isSubmitting 
                ? t('common.loading') 
                : t('auth.reset_password.submit')}
            </Button>

            <Link 
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              {t('auth.back_to_login')}
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}