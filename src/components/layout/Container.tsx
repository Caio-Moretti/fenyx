// src/components/layout/Container.tsx
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("w-full max-w-5xl mx-auto px-4", className)} {...props}>
      {children}
    </div>
  )
}