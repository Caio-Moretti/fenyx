// src/app/[locale]/(protected)/workouts/new/page.tsx
'use client'

import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { createWorkout } from '@/server/actions/workouts/index'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { createWorkoutSchema  } from './utils'

type CreateWorkoutFormData = z.infer<typeof createWorkoutSchema>

export default function CreateWorkoutPage() {
  const t = useTranslations()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateWorkoutFormData>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: {
      name: '',
      exercises: [] 
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises"
  })

  const onSubmit = async (data: CreateWorkoutFormData) => {
    try {
      setError(null)
      
      await createWorkout({
        name: data.name,
        exercises: data.exercises.map(exercise => ({
          name: exercise.name,
          targetSets: exercise.targetSets,
          targetRepsMin: exercise.targetRepsMin,
          targetRepsMax: exercise.targetRepsMax
        }))
      })

      router.push('/workouts')
      
      router.refresh()
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(t('errors.unknown_error'))
      }

    }
  }

  const addExercise = () => {
    append({
      name: '',
      targetSets: 3, // Valores padrão
      targetRepsMin: 8,
      targetRepsMax: 12,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
        >
          <Link href="/workouts">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">{t('common.back')}</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('workout.create_workout')}
          </h1>
          <p className="text-muted-foreground">
            {t('workout.create_workout_description')}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Detalhes básicos do treino */}
        <Card>
          <CardHeader>
            <CardTitle>{t('workout.workout_details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nome do treino */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('workout.workout_name')}
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={t('workout.workout_name_placeholder')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de exercícios */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('workout.exercises_section')}</CardTitle>
            <Button 
              type="button"
              variant="secondary" 
              size="sm"
              onClick={addExercise}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('workout.add_exercise')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mensagem de nenhum exercício */}
            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t('workout.no_exercises')}</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={addExercise}
                  className="mt-2"
                >
                  {t('workout.add_first_exercise')}
                </Button>
              </div>
            )}

            {/* Lista de exercícios */}
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                {index > 0 && <Separator />}
                
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {t('workout.exercise')} {index + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">
                      {t('workout.remove_exercise')}
                    </span>
                  </Button>
                </div>

                {/* Nome do exercício */}
                <div className="space-y-2">
                  <Label>
                    {t('workout.exercise_name')}
                  </Label>
                  <Input
                    {...register(`exercises.${index}.name`)}
                    placeholder={t('workout.exercise_name_placeholder')}
                  />
                  {errors.exercises?.[index]?.name && (
                    <p className="text-sm text-destructive">
                      {errors.exercises[index]?.name?.message}
                    </p>
                  )}
                </div>

                {/* Configurações do exercício em grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Número de séries */}
                  <div className="space-y-2">
                    <Label>
                      {t('workout.target_sets')}
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...register(`exercises.${index}.targetSets`)}
                    />
                    {errors.exercises?.[index]?.targetSets && (
                      <p className="text-sm text-destructive">
                        {errors.exercises[index]?.targetSets?.message}
                      </p>
                    )}
                  </div>

                  {/* Range de repetições - Mínimo */}
                  <div className="space-y-2">
                    <Label>
                      {t('workout.min_reps')}
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      {...register(`exercises.${index}.targetRepsMin`)}
                    />
                    {errors.exercises?.[index]?.targetRepsMin && (
                      <p className="text-sm text-destructive">
                        {errors.exercises[index]?.targetRepsMin?.message}
                      </p>
                    )}
                  </div>

                  {/* Range de repetições - Máximo */}
                  <div className="space-y-2">
                    <Label>
                      {t('workout.max_reps')}
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      {...register(`exercises.${index}.targetRepsMax`)}
                    />
                    {errors.exercises?.[index]?.targetRepsMax && (
                      <p className="text-sm text-destructive">
                        {errors.exercises[index]?.targetRepsMax?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Erro geral de exercícios */}
            {errors.exercises && (
              <p className="text-sm text-destructive">
                {errors.exercises.message}
              </p>
            )}
            
            {/* Botão de adicionar ao final da lista */}
            {fields.length > 0 && (
              <div className="flex justify-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExercise}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t('workout.add_exercise')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Erro geral */}
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            asChild
          >
            <Link href="/workouts">
              {t('common.cancel')}
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? t('common.loading')
              : t('common.create')
            }
          </Button>
        </div>
      </form>
    </div>
  )
}