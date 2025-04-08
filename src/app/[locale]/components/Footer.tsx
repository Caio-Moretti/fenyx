'use client';

import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations()
  return (
    <footer className="py-8 text-center text-sm text-muted-foreground">
      <p>&copy; 2024 {t('common.app_name')}. {t('footer.rights')}</p>
    </footer>
  );
}
