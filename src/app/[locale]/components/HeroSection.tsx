'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
    const t = useTranslations()
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center space-y-8">
      <div className="space-y-6 max-w-3xl">

        <div className="flex justify-center">
          <Logo size={80} className="text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          {t('common.app_name')}
        </h1>
        <p className="text-xl md:text-2xl text-primary">
          {"Rise stronger"}
        </p>
        <p className="text-xl md:text-xl text-muted-foreground">
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
  );
}