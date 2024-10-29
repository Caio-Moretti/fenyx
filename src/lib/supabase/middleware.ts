// src/lib/supabase/middleware.ts

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isPublicPath } from '@/config/ispublic'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options })
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const locale = request.nextUrl.pathname.startsWith('/en') ? 'en' : 'pt-BR'
    const loginUrl = new URL(`/${locale}/login`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}