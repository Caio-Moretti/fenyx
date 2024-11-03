// src/components/layout/PageHeader.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ 
  title, 
  description,
  children,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {/* Botões e ações à direita */}
      {children && (
        <div className="flex items-center space-x-2">
          {children}
        </div>
      )}
    </div>
  )
}