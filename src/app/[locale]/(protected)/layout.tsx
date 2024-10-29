// src/app/[locale]/(protected)/layout.tsx

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Suspense } from 'react'

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
      {/* Sidebar */}
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>

      {/* Main Content */}
      <main className="container mx-auto p-4 pt-16"> {/* padding-top para o botão do menu */}
        {children}
      </main>
    </div>
  )
}