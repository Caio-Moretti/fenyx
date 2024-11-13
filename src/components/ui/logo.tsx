// src/components/ui/logo.tsx
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: number // tamanho em pixels
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <Image
      src="/images/logo_fenyx.svg"
      alt="FENYX"
      width={size}
      height={size}
      className={className}
      priority // Carrega a logo com prioridade alta
    />
  )
}