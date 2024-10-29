// src/app/[locale]/(protected)/workouts/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CreateWorkoutForm {
  name: string
}

export default function NewWorkoutPage() {
  const t = useTranslations()
  const router = useRouter()
  const [error, setError] = useState<string>('')
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateWorkoutForm>()

  const onSubmit = async (data: CreateWorkoutForm) => {
    try {
      setError('')
      // TODO: Implementar a criação do treino
      console.log('Criar treino:', data)
      router.push('/workouts')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.unknown_error'))
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {t('workout.create_workout')}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('workout.workout_details')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('workout.workout_name')}</Label>
              <Input
                id="name"
                {...register('name', { 
                  required: t('errors.name_required') 
                })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.loading') : t('common.create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}