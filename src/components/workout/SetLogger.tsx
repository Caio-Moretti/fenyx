// src/components/workout/SetLogger.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
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
 const [isHistoryOpen, setIsHistoryOpen] = useState(false)

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
     {/* Acordeão com histórico em estilo dark */}
     <div className="rounded-lg bg-secondary/50">
       <button
         className="w-full px-4 py-3 flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
         onClick={() => setIsHistoryOpen(!isHistoryOpen)}
       >
         {t('tracking.view_previous')}
         <ChevronDown 
           className={`h-4 w-4 transition-transform ${isHistoryOpen ? 'rotate-180' : ''}`}
         />
       </button>

       {/* Tabela de histórico com estilo dark */}
       {isHistoryOpen && (
         <div className="px-4 pb-3">
           <table className="w-full border-separate border-spacing-y-2">
             <thead>
               <tr className="text-xs text-muted-foreground">
                 <th className="text-left font-normal">{t('tracking.set')}</th>
                 <th className="text-left font-normal">{t('tracking.weight')}</th>
                 <th className="text-left font-normal">{t('tracking.reps')}</th>
                 <th className="text-left font-normal">{t('tracking.rir')}</th>
               </tr>
             </thead>
             <tbody>
               {previousSets.map((set) => (
                 <tr key={set.setNumber} className="text-sm">
                   <td className="py-1">{set.setNumber}</td>
                   <td className="py-1">{set.weight}kg</td>
                   <td className="py-1">{set.reps}</td>
                   <td className="py-1">{set.difficulty}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       )}
     </div>

     {/* Card de registro da série atual */}
     <div className="rounded-lg bg-secondary/50 p-4 space-y-6">
       {/* Título da série simplificado */}
       <div className="flex justify-between items-center">
         <Button
           variant="ghost"
           size="icon"
           onClick={onPreviousSet}
           disabled={currentSetNumber === 1}
         >
           <ChevronLeft className="h-4 w-4" />
         </Button>
         
         <div className="text-center">
           <h2 className="text-lg font-medium">
             {`${t('tracking.set')} ${currentSetNumber} / ${totalSets}`}
           </h2>
         </div>
         
         <Button
           variant="ghost"
           size="icon"
           onClick={onNextSet}
           disabled={currentSetNumber === totalSets}
         >
           <ChevronRight className="h-4 w-4" />
         </Button>
       </div>

       {/* Campos de input */}
       <div className="space-y-4">
         {/* Peso */}
         <div className="space-y-2">
           <label className="text-sm text-muted-foreground">
             {t('tracking.weight')}
             {previousSets?.[currentSetNumber - 1] && (
               <span className="text-xs ml-2 text-muted-foreground">
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
             className="bg-background/50"
             placeholder="0"
           />
         </div>

         {/* Repetições */}
         <div className="space-y-2">
           <label className="text-sm text-muted-foreground">
             {t('tracking.reps')}
             {previousSets?.[currentSetNumber - 1] && (
               <span className="text-xs ml-2 text-muted-foreground">
                 ({t('tracking.previous')}: {previousSets[currentSetNumber - 1].reps})
               </span>
             )}
           </label>
           <Input
             type="number"
             min={0}
             value={reps}
             onChange={(e) => setReps(e.target.value)}
             className="bg-background/50"
             placeholder="0"
           />
         </div>

         {/* RIR */}
         <div className="space-y-2">
           <label className="text-sm text-muted-foreground">
             {t('tracking.rir')}
             {previousSets?.[currentSetNumber - 1] && (
               <span className="text-xs ml-2 text-muted-foreground">
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
             className="bg-background/50"
             placeholder="0"
           />
         </div>
       </div>

       {/* Botão de registro */}
       <Button 
         className="w-full bg-primary hover:bg-primary/90"
         onClick={handleSubmit}
         disabled={isSubmitting || !weight || !reps || !difficulty}
       >
         {isSubmitting ? t('common.loading') : t('tracking.log_set')}
       </Button>
     </div>
   </div>
 )
}