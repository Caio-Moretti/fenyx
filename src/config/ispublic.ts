// src/config/ispublic.ts

// Rotas que não precisam de autenticação
export const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/auth/confirm'
] as readonly string[]


export function isPublicPath(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/(?:pt-BR|en)/, '')
  
  if (pathWithoutLocale === '' || pathWithoutLocale === '/') {
    return true
  }
  
  return PUBLIC_PATHS.includes(pathWithoutLocale)
}