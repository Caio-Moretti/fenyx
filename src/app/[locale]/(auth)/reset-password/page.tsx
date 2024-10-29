// src/app/[locale]/(auth)/reset-password/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { resetPassword } from '@/server/actions/auth'

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
import { AlertCircle } from 'lucide-react'

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const t = useTranslations()
  const [error, setError] = useState<string>('')
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormData>()

  const password = watch('password')

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError('')
      
      // Validate password match
      if (data.password !== data.confirmPassword) {
        setError(t('auth.reset_password.passwords_dont_match'))
        return
      }

      const result = await resetPassword({ password: data.password })
      
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError(t('errors.unknown_error'))
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t('auth.reset_password.new_password_title')}</CardTitle>
          <CardDescription>
            {t('auth.reset_password.new_password_description')}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { 
                  required: t('errors.password_required'),
                  minLength: {
                    value: 6,
                    message: t('errors.password_min_length')
                  }
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t('auth.reset_password.confirm_password')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: t('errors.confirm_password_required'),
                  validate: (value) =>
                    value === password || t('auth.reset_password.passwords_dont_match')
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Erro geral */}
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? t('common.loading')
                : t('auth.reset_password.update_password')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}