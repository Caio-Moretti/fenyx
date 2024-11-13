// src/app/[locale]/page.tsx

'use client';

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo' // Importando o componente Logo
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight, Dumbbell, LineChart, Zap } from 'lucide-react'

export default function Home() {
  const t = useTranslations()
  
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center space-y-8">
        <div className="space-y-6 max-w-3xl">
          {/* Logo */}
          <div className="flex justify-center">
            <Logo size={80} className="text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            {t('common.app_name')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            {t('hero.tagline')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/register" className="gap-2">
              {t('auth.sign_up')}
              <ArrowRight size={20} />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">
              {t('auth.sign_in')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-16 max-w-6xl mx-auto">
        <Card className="bg-secondary">
          <CardHeader>
            <Dumbbell className="w-10 h-10 text-primary mb-4" />
            <CardTitle>{t('features.tracking.title')}</CardTitle>
            <CardDescription>{t('features.tracking.description')}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-secondary">
          <CardHeader>
            <LineChart className="w-10 h-10 text-primary mb-4" />
            <CardTitle>{t('features.progress.title')}</CardTitle>
            <CardDescription>{t('features.progress.description')}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-secondary">
          <CardHeader>
            <Zap className="w-10 h-10 text-primary mb-4" />
            <CardTitle>{t('features.custom.title')}</CardTitle>
            <CardDescription>{t('features.custom.description')}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2024 {t('common.app_name')}. {t('footer.rights')}</p>
      </footer>
    </main>
  )
}