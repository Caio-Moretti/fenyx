'use client'

import { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'

interface AuthCardProps {
  titleKey: string
  descriptionKey?: string
  children: ReactNode
}

export default function AuthCard({ 
  titleKey, 
  descriptionKey, 
  children 
}: AuthCardProps) {
  const t = useTranslations()
  
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t(titleKey)}</CardTitle>
          {descriptionKey && (
            <CardDescription>
              {t(descriptionKey)}
            </CardDescription>
          )}
        </CardHeader>
        
        {children}
      </Card>
    </div>
  )
}