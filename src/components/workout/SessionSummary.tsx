// src/components/workout/SessionSummary.tsx
'use client'

import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WorkoutSession } from '@/types/shared'
import { formatDateTime } from '@/lib/dateUtils'
import { CalendarDays, ChevronDown, Dumbbell, Scale, Repeat, Activity } from 'lucide-react'

interface SessionSummaryProps {
  sessions: WorkoutSession[]
  currentSessionId: string
  onSessionChange: (sessionId: string) => void
}

export function SessionSummary({ 
  sessions,
  currentSessionId,
  onSessionChange
}: SessionSummaryProps) {
  const t = useTranslations()
  const currentSession = sessions.find(s => s.id === currentSessionId)
  
  if (!currentSession?.workout) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Seletor de Sessão Estilizado */}
      <div className="relative">
        <Select
          value={currentSessionId}
          onValueChange={onSessionChange}
        >
            <SelectTrigger className="w-full bg-secondary/50 border-0 h-14 px-4">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-start flex-1">
                    <SelectValue placeholder={t('workout.sessions_words.select_session')}>
                        <span className="font-semibold text-base">
                        {t('workout.sessions_words.workout_number', { 
                            number: sessions.length - sessions.findIndex(s => s.id === currentSessionId)
                        })}
                        </span>
                    </SelectValue>
                    <span className="text-sm text-muted-foreground">
                        {formatDateTime(currentSession.createdAt).fullDateTime}
                    </span>
                    </div>
                </div>
            </SelectTrigger>
          <SelectContent>
            {sessions.map((session, index) => {
              const { date, time } = formatDateTime(session.createdAt)
              return (
                <SelectItem 
                  key={session.id} 
                  value={session.id}
                  className="py-3"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {t('workout.sessions_words.workout_number', { 
                        number: sessions.length - index 
                      })}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <CalendarDays className="h-3 w-3" />
                      {t('workout.sessions_words.session_date', { date, time })}
                    </span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Exercícios Moderna */}
      <Accordion 
        type="single" 
        collapsible 
        className="space-y-3"
      >
        {currentSession.workout.exercises.map((exercise) => {
          // Filtra as séries deste exercício
          const exerciseSets = currentSession.sets.filter(
            set => set.exerciseId === exercise.id
          ).sort((a, b) => a.setNumber - b.setNumber)

          // Calcula métricas do exercício
          const totalWeight = exerciseSets.reduce((sum, set) => sum + (set.weight * set.reps), 0)
          const totalReps = exerciseSets.reduce((sum, set) => sum + set.reps, 0)
          const avgRIR = exerciseSets.length > 0
            ? (exerciseSets.reduce((sum, set) => sum + set.difficulty, 0) / exerciseSets.length).toFixed(1)
            : '-'

          return (
            <AccordionItem 
              key={exercise.id} 
              value={exercise.id}
              className="border-0 bg-secondary/50 rounded-xl overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-4 hover:no-underline">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-lg font-medium">
                    {exercise.name}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {exerciseSets.length > 0 ? (
                  <div className="px-4 pb-4 space-y-4">
                    {/* Métricas do Exercício */}
                    <div className="grid grid-cols-3 gap-2 pt-2 pb-4">
                      <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                        <Scale className="h-4 w-4 text-primary mb-1" />
                        <span className="text-sm font-medium">{totalWeight}kg</span>
                        <span className="text-xs text-muted-foreground">Volume</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                        <Repeat className="h-4 w-4 text-primary mb-1" />
                        <span className="text-sm font-medium">{totalReps}</span>
                        <span className="text-xs text-muted-foreground">Reps</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                        <Activity className="h-4 w-4 text-primary mb-1" />
                        <span className="text-sm font-medium">{avgRIR}</span>
                        <span className="text-xs text-muted-foreground">RIR</span>
                      </div>
                    </div>

                    {/* Tabela de Séries */}
                    <div className="space-y-2">
                      {exerciseSets.map((set) => (
                        <div 
                          key={set.id}
                          className="grid grid-cols-4 items-center bg-background/50 rounded-lg p-3 text-sm"
                        >
                          <div>
                            <span className="text-xs text-muted-foreground block">Série</span>
                            <span>{set.setNumber}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">Peso</span>
                            <span>{set.weight}kg</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">Reps</span>
                            <span>{set.reps}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">RIR</span>
                            <span>{set.difficulty}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {t('workout.sessions_words.no_sets_recorded')}
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}