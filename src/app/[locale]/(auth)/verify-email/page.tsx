// src/app/[locale]/(auth)/verify-email/page.tsx
'use client'

import { useTranslations } from 'next-intl'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  const t = useTranslations()

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>{t('auth.verify_email.title')}</CardTitle>
          <CardDescription className='text-md'>
            {t('auth.verify_email.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground text-center">
            {t('auth.verify_email.check_spam')}
          </p>
          {/* <Button variant="outline" className="w-full">
            {t('auth.verify_email.resend')}
          </Button> */}
        </CardContent>
      </Card>
    </div>
  )
}