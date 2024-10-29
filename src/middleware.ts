// src/middleware.ts

import { type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const supabaseResponse = await updateSession(request)
  
  if (supabaseResponse instanceof Response && supabaseResponse.headers.has('location')) {
    return supabaseResponse
  }
  
  const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'pt-BR'],
    defaultLocale: 'pt-BR',
    localePrefix: 'always'
  })
  
  const response = await intlMiddleware(request)

  supabaseResponse.cookies.getAll().forEach(cookie => {
    response.cookies.set(cookie)
  })

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}