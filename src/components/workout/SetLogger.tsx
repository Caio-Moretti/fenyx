// src/components/workout/SetLogger.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  Dumbbell, 
  RotateCcw, 
  Target, 
  CheckCircle2,
  History
} from 'lucide-react'
import type { ExerciseSet } from '@/types/shared'

interface FormData {
  weight: string
  reps: string
  difficulty: string
}

interface SetLoggerProps {
  exerciseId: string
  currentSetNumber: number
  totalSets: number
  previousSets?: ExerciseSet[]
  currentExerciseSets: ExerciseSet[]
  sessionId: string
  onPreviousSet: () => void
  onNextSet: () => void 
  onLogSet: (data: {
    weight: number
    reps: number
    difficulty: number
  }) => Promise<void>
}

const getStorageKey = (sessionId: string, exerciseId: string, setNumber: number) => 
  `fenyx_set_${sessionId}_${exerciseId}_${setNumber}`

export function SetLogger({
  exerciseId,
  sessionId,
  currentSetNumber,
  totalSets,
  previousSets = [],
  currentExerciseSets,
  onPreviousSet,
  onNextSet,
  onLogSet
}: SetLoggerProps) {
  const t = useTranslations('workout')
  const [formData, setFormData] = useState<FormData>({
    weight: '',
    reps: '',
    difficulty: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Recupera dados do localStorage quando o set muda
  useEffect(() => {
    const storageKey = getStorageKey(sessionId, exerciseId, currentSetNumber)
    const savedData = localStorage.getItem(storageKey)
    
    if (savedData) {
      setFormData(JSON.parse(savedData))
    } else {
      setFormData({ weight: '', reps: '', difficulty: '' })
    }
  }, [sessionId, exerciseId, currentSetNumber])

  // Salva dados no localStorage quando são alterados
  useEffect(() => {
    const storageKey = getStorageKey(sessionId, exerciseId, currentSetNumber)
    localStorage.setItem(storageKey, JSON.stringify(formData))
  }, [formData, sessionId, exerciseId, currentSetNumber])

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      await onLogSet({
        weight: Number(formData.weight),
        reps: Number(formData.reps),
        difficulty: Number(formData.difficulty)
      })

      // Limpa o localStorage após sucesso
      const storageKey = getStorageKey(sessionId, exerciseId, currentSetNumber)
      localStorage.removeItem(storageKey)
      
      // Limpa o formulário
      setFormData({ weight: '', reps: '', difficulty: '' })
      
    } catch (error) {
      console.error('Error logging set:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Verifica se a série atual já foi registrada
  const isCurrentSetLogged = currentExerciseSets.some(
    set => set.setNumber === currentSetNumber
  )

  // Encontra a série atual nos registros
  const currentLoggedSet = currentExerciseSets.find(
    set => set.setNumber === currentSetNumber
  )

  // Calcula progresso baseado em séries efetivamente registradas
  const completedSets = currentExerciseSets.length
  const progress = (completedSets / totalSets) * 100

  return (
    <div className="space-y-6">
      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Progresso</span>
          <span>{completedSets}/{totalSets} séries</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Card Principal */}
      <div className="rounded-lg bg-card border border-border/50 overflow-hidden">
        {/* Header com navegação e status */}
        <div className="border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPreviousSet}
              disabled={currentSetNumber === 1}
              className="hover:bg-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {t('tracking.set_of', { current: currentSetNumber, total: totalSets })}
              </h2>
              {isCurrentSetLogged && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onNextSet}
              disabled={currentSetNumber === totalSets}
              className="hover:bg-accent"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Se a série já foi registrada, mostra os dados */}
        {isCurrentSetLogged && currentLoggedSet ? (
          <div className="p-6 space-y-4">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Série Registrada</p>
                <div className="flex items-center justify-center gap-6 text-muted-foreground">
                  <span>{currentLoggedSet.weight}kg</span>
                  <span>{currentLoggedSet.reps} reps</span>
                  <span>RIR {currentLoggedSet.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Campos de Input com Layout em Grid */
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Peso */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  {t('tracking.weight')}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="bg-background/50 pr-8"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    kg
                  </span>
                </div>
                {previousSets?.[currentSetNumber - 1] && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" />
                    {previousSets[currentSetNumber - 1].weight}kg
                  </p>
                )}
              </div>

              {/* Repetições */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4 text-primary" />
                  {t('tracking.reps')}
                </label>
                <Input
                  type="number"
                  min={0}
                  value={formData.reps}
                  onChange={(e) => setFormData(prev => ({ ...prev, reps: e.target.value }))}
                  className="bg-background/50"
                  placeholder="0"
                />
                {previousSets?.[currentSetNumber - 1] && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" />
                    {previousSets[currentSetNumber - 1].reps} reps
                  </p>
                )}
              </div>
            </div>

            {/* RIR em linha única */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-primary" />
                {t('tracking.rir')}
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={formData.difficulty === value.toString() ? "default" : "outline"}
                    className={cn(
                      "h-12 text-lg font-medium",
                      formData.difficulty === value.toString() && "bg-primary hover:bg-primary/90"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: value.toString() }))}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              {previousSets?.[currentSetNumber - 1] && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <RotateCcw className="h-3 w-3" />
                  RIR {previousSets[currentSetNumber - 1].difficulty}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Botão de registro */}
        {!isCurrentSetLogged && (
          <div className="p-4 border-t border-border/50">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-medium"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.weight || !formData.reps || !formData.difficulty}
            >
              {isSubmitting ? t('common.loading') : t('tracking.log_set')}
            </Button>
          </div>
        )}
      </div>

      {/* Histórico em Card Separado */}
      <div className="rounded-lg bg-card border border-border/50 overflow-hidden">
        <button
          className="w-full px-6 py-4 flex items-center justify-between text-sm hover:bg-accent/50 transition-colors"
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        >
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <span className="font-medium">{t('tracking.view_previous')}</span>
          </div>
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isHistoryOpen && "rotate-180"
            )}
          />
        </button>

        {isHistoryOpen && (
          <div className="border-t border-border/50">
            {previousSets.length > 0 ? (
              <div className="p-4">
                {/* Headers com cores mais suaves */}
                <div className="grid grid-cols-4 items-center text-center mb-2">
                  <div className="text-xs ">Série</div>
                  <div className="text-xs ">Peso</div>
                  <div className="text-xs ">Reps</div>
                  <div className="text-xs ">RIR</div>
                </div>
                
                {/* Linhas com mais espaço e melhor organização */}
                <div className="space-y-3">
                  {previousSets.map((set) => (
                    <div 
                      key={set.setNumber}
                      className="grid grid-cols-4 items-center text-center py-2 px-1 rounded-lg hover:bg-accent/30 transition-colors"
                    >
                      {/* Número da Série com Circle */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10">
                          <span className="text-sm font-semibold text-primary">
                            {set.setNumber}
                          </span>
                        </div>
                      </div>

                      {/* Peso com unidade */}
                      <div className="flex items-center justify-center">
                        <span className="text-sm font-medium ">
                          {set.weight}
                          <span className="text-xs  ml-0.5">kg</span>
                        </span>
                      </div>

                      {/* Repetições */}
                      <div className="flex items-center justify-center">
                        <span className="text-sm font-medium ">
                          {set.reps}
                        </span>
                      </div>

                      {/* RIR com gradiente de cor baseado no valor */}
                      <div className="flex items-center justify-center">
                        <span 
                          className={cn(
                            "text-sm font-medium",
                            set.difficulty <= 1 ? "text-red-400/90" :
                            set.difficulty <= 2 ? "text-amber-400/90" :
                            "text-emerald-400/90"
                          )}
                        >
                          {set.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhum dado da sessão anterior
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}