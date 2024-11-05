// src/components/layout/Sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu,
  ChevronDown,
  Flame,
  Dumbbell,
  BarChart2,
  LogOut,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/server/actions/auth'
import { useWorkoutsList } from '@/hooks/useWorkoutsList'

interface NavItemProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  isNew?: boolean
  children?: {
    title: string
    href: string
  }[]
}

const NavItem = ({ item, isChild = false }: { item: NavItemProps, isChild?: boolean }) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const isActive = item.href ? pathname === item.href : false
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      {item.href ? (
        <Link
          href={item.href}
          className={cn(
            "flex items-center justify-between w-full text-sm transition-colors",
            "rounded-md px-3 py-2 hover:bg-accent/50",
            isActive ? "text-primary font-medium" : "text-muted-foreground",
            isChild && "pl-6"
          )}
        >
          <span className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            {item.title}
          </span>
          {item.isNew && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </Link>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full text-sm transition-colors",
            "rounded-md px-3 py-2 hover:bg-accent/50",
            "text-muted-foreground/70"
          )}
        >
          <span className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            {item.title}
          </span>
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </button>
      )}
      
      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "flex items-center w-full text-sm transition-colors",
                "rounded-md pl-10 pr-3 py-2 hover:bg-accent/50",
                pathname === child.href 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const WorkoutsList = () => {
  const { workouts, isLoading } = useWorkoutsList()
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const t = useTranslations()

  if (isLoading) {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full text-sm transition-colors",
          "rounded-md px-3 py-2 hover:bg-accent/50",
          "text-muted-foreground/70"
        )}
      >
        <span className="flex items-center gap-3">
          <Dumbbell className="h-4 w-4" />
          {t('workout.my_workouts')}
        </span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <div className="mt-1 space-y-1">
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              href={`/workouts/${workout.id}`}
              className={cn(
                "flex items-center w-full text-sm transition-colors",
                "rounded-md pl-10 pr-3 py-2 hover:bg-accent/50",
                pathname === `/workouts/${workout.id}`
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
            >
              {workout.name}
            </Link>
          ))}

          <Link
            href="/workouts/new"
            className="flex items-center w-full text-sm text-primary/70 hover:text-primary transition-colors rounded-md pl-10 pr-3 py-2 hover:bg-accent/50"
          >
            + {t('workout.create_workout')}
          </Link>
        </div>
      )}
    </div>
  )
}

const SidebarContent = () => {
  const t = useTranslations()
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'pt-BR'

  const navigation: NavItemProps[] = [
    {
      title: t('workout.dashboard'),
      icon: BarChart2,
      href: '/workouts',
      isNew: true
    }
  ]

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14">
        <Flame className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">
          {t('common.app_name')}
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2 py-2 space-y-1">
        <WorkoutsList />
        
        {navigation.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </div>

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => logout(locale)}
        >
          <LogOut className="h-4 w-4" />
          {t('auth.sign_out')}
        </Button>
      </div>
    </div>
  )
}

const Sidebar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-40 lg:hidden"
          // Aumentei o z-index e movi para a direita
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
        </SheetTrigger>

        {/* Mobile Sidebar */}
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-0 lg:flex lg:w-80">
        <SidebarContent />
      </div>
    </>
  )
}

export { Sidebar }