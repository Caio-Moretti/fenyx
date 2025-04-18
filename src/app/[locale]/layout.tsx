// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`@/../../public/locales/${locale}/common.json`)).default;
  } catch (error) {
    console.error('Failed to load messages:', error);
    messages = (await import(`@/../../public/locales/pt-BR/common.json`)).default;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}