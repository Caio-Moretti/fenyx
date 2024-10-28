// src/app/[locale]/auth/confirm/route.ts

import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  // Extrai os parâmetros da URL
  const searchParams = new URL(request.url).searchParams
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Verifica se temos os parâmetros necessários
  if (token_hash && type) {
    const supabase = await createClient()

    // Verifica o token com o Supabase
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    // Se não houver erro, redireciona para a página especificada ou home
    if (!error) {
      return redirect(next)
    }
  }

  // Se algo der errado, redireciona para uma página de erro
  return redirect('/auth/error')
}