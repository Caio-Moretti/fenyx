// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'pt-BR'].includes(locale as any)) notFound();

  return {
    messages: (await import(`@/../../public/locales/${locale}/common.json`)).default
  };
});