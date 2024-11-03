// src/components/layout/PageContainer.tsx
interface PageContainerProps {
    children: React.ReactNode
    showBackButton?: boolean
    title?: string
  }
  
  export function PageContainer({ 
    children,
    showBackButton,
    title 
  }: PageContainerProps) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Área reservada para o header fixo */}
        <div className="h-14 lg:h-0" />
        
        {/* Conteúdo da página */}
        <div className="flex-1 container max-w-7xl mx-auto p-4">
          {children}
        </div>
      </div>
    )
  }