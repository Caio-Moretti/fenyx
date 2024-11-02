import Link from 'next/link'
import { Trash2, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface WorkoutCardProps {
  id: string
  name: string
  exerciseCount: number
  onDelete: (id: string) => void
  t: (key: string) => string
}

export default function WorkoutCard({ id, name, exerciseCount, onDelete, t }: WorkoutCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-primary/10">
      <Link href={`/workouts/${id}`} className="block h-full">
        <CardHeader className="relative pb-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="line-clamp-1 text-lg font-semibold leading-none tracking-tight">
                {name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {exerciseCount === 0
                  ? t('workout.no_exercises')
                  : `${exerciseCount} ${t(exerciseCount === 1 ? 'workout.exercise' : 'workout.exercises')}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Dumbbell className="h-4 w-4" />
              <span>{t('workout.view_details')}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete(id)
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">{t('common.delete')}</span>
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}