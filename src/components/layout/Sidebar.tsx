// src/components/layout/Sidebar.tsx
'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Flame, Menu, LineChart, Dumbbell, User, LogOut, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/server/actions/auth'

export function Sidebar() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations()
  const pathname = usePathname()

  const locale = pathname.startsWith('/en') ? 'en' : 'pt-BR'

  const navigation = [
    {
      href: '/workouts',
      label: t('workout.my_workouts'),
      icon: Dumbbell
    },
    {
      href: '/workouts/dashboard', // placeholder
      label: t('workout.dashboard'),
      icon: LineChart
    }
  ]

  const handleLogout = () => {
    startTransition(() => {
      logout(locale)
    })
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t('common.menu')}</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[300px] p-0">
          <div className="border-b border-border/40 p-6">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-br from-primary to-red-900 bg-clip-text text-transparent">
                {t('common.app_name')}
              </span>
            </div>
          </div>

          <nav className="space-y-1 p-4">
            {navigation.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href)
              
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-border/40">
            <Button 
              variant="ghost"
              className="flex w-full items-center justify-start gap-3 p-4 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-none"
              onClick={handleLogout}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              {isPending ? t('common.loading') : t('auth.sign_out')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}