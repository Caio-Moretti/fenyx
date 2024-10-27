// src/app/[locale]/(auth)/register/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Link from 'next/link'
import { register } from '@/server/actions/auth'

// UI Components
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

interface RegisterFormData {
  name: string
  email: string
  password: string
}

export default function RegisterPage() {
  const t = useTranslations()
  const [error, setError] = useState<string>('')
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>()

  const onSubmit = async (data: RegisterFormData) => {
    setError('')
    
    const result = await register(data)
    
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t('auth.sign_up')}</CardTitle>
          <CardDescription>
            {t('auth.create_account_description')}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('common.name')}</Label>
              <Input
                id="name"
                type="text"
                {...registerField('name', { required: t('errors.name_required') })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                {...registerField('email', { 
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

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                {...registerField('password', { 
                  required: t('errors.password_required'),
                  minLength: {
                    value: 6,
                    message: t('errors.password_min_length')
                  }
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
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
              {isSubmitting ? t('common.loading') : t('auth.sign_up')}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              {t('auth.already_have_account')}{' '}
              <Link 
                href="/login" 
                className="text-primary hover:underline"
              >
                {t('auth.sign_in')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}