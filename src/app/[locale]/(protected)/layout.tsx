// src/app/[locale]/(protected)/layout.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Suspense } from 'react'
import { Container } from '@/components/layout/Container'

async function getSession() {
  const supabase = await createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export default async function ProtectedLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const session = await getSession()
  
  if (!session) {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>

      <div className="h-16 lg:hidden" />

      <main className="lg:pl-80">
        <Container>
          {children}
        </Container>
      </main>
    </div>
  )
}