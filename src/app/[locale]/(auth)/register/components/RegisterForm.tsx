'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegister } from '../hooks/useRegister'

export default function RegisterForm() {
  const {
    registerField,
    handleSubmit,
    errors,
    isSubmitting,
    error,
    onSubmit
  } = useRegister()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-4">
        <NameField registerField={registerField} errors={errors} />
        <EmailField registerField={registerField} errors={errors} />
        <PasswordField registerField={registerField} errors={errors} />
        <FormError error={error} />
      </CardContent>

      <FormActions isSubmitting={isSubmitting} />
    </form>
  )
}

function NameField({ 
  registerField, 
  errors 
}: { 
  registerField: any, 
  errors: any 
}) {
  const t = useTranslations()
  
  return (
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
  )
}

function EmailField({ 
  registerField, 
  errors 
}: { 
  registerField: any, 
  errors: any 
}) {
  const t = useTranslations()
  
  return (
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
  )
}

function PasswordField({ 
  registerField, 
  errors 
}: { 
  registerField: any, 
  errors: any 
}) {
  const t = useTranslations()
  
  return (
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
  )
}