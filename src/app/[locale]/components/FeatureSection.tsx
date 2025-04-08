'use client';

import { Dumbbell, LineChart, Zap } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function FeaturesSection() {
    const t = useTranslations()
  return (
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
  );
}