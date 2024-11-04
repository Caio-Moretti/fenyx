// src/components/workout/SetLogger.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ExerciseSet } from '@/types/shared'

interface SetLoggerProps {
  exerciseId: string
  currentSetNumber: number
  totalSets: number
  previousSets?: ExerciseSet[]
  onPreviousSet: () => void
  onNextSet: () => void 
  onLogSet: (data: {
    weight: number
    reps: number
    difficulty: number
  }) => Promise<void>
}

export function SetLogger({
  exerciseId,
  currentSetNumber,
  totalSets,
  previousSets = [],
  onPreviousSet,
  onNextSet,
  onLogSet
}: SetLoggerProps) {
  const t = useTranslations('workout')
  const [weight, setWeight] = useState<string>('')
  const [reps, setReps] = useState<string>('')
  const [difficulty, setDifficulty] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Organiza os sets anteriores em uma tabela
  const previousSetsTable = previousSets.map(set => ({
    setNumber: set.setNumber,
    weight: set.weight,
    reps: set.reps,
    rir: set.difficulty
  }))

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      await onLogSet({
        weight: Number(weight),
        reps: Number(reps),
        difficulty: Number(difficulty)
      })

      // Limpa os campos após sucesso
      setWeight('')
      setReps('')
      setDifficulty('')
      
    } catch (error) {
      console.error('Error logging set:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Histórico da última sessão */}
      <Accordion type="single" collapsible>
        <AccordionItem value="previous">
          <AccordionTrigger>
            {t('tracking.view_previous')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2">{t('tracking.set')}</th>
                    <th className="px-4 py-2">{t('tracking.weight')}</th>
                    <th className="px-4 py-2">{t('tracking.reps')}</th>
                    <th className="px-4 py-2">{t('tracking.rir')}</th>
                  </tr>
                </thead>
                <tbody>
                  {previousSetsTable.map((set) => (
                    <tr key={set.setNumber} className="border-b border-border/50">
                      <td className="px-4 py-2">{set.setNumber}</td>
                      <td className="px-4 py-2">{set.weight}kg</td>
                      <td className="px-4 py-2">{set.reps}</td>
                      <td className="px-4 py-2">{set.rir}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Registro da série atual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {t('tracking.set')} {currentSetNumber} / {totalSets}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Navegação entre séries */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={onPreviousSet}
              disabled={currentSetNumber === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="font-medium">
              {t('tracking.set')} {currentSetNumber}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={onNextSet}
              disabled={currentSetNumber === totalSets}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Campos de input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                {t('tracking.weight')}
                {previousSets?.[currentSetNumber - 1] && (
                  <span className="text-xs ml-2">
                    ({t('tracking.previous')}: {previousSets[currentSetNumber - 1].weight}kg)
                  </span>
                )}
              </label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                {t('tracking.reps')}
                {previousSets?.[currentSetNumber - 1] && (
                  <span className="text-xs ml-2">
                    ({t('tracking.previous')}: {previousSets[currentSetNumber - 1].reps})
                  </span>
                )}
              </label>
              <Input
                type="number"
                min={0}
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                {t('tracking.difficulty')}
                {previousSets?.[currentSetNumber - 1] && (
                  <span className="text-xs ml-2">
                    ({t('tracking.previous')}: {previousSets[currentSetNumber - 1].difficulty})
                  </span>
                )}
              </label>
              <Input
                type="number"
                min={0}
                max={5}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Botão de registro */}
          <Button 
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting || !weight || !reps || !difficulty}
          >
            {isSubmitting ? t('common.loading') : t('tracking.log_set')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}