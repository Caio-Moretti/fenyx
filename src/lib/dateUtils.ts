// src/lib/dateUtils.ts

interface FormattedDateTime {
  date: string
  time: string
  fullDateTime: string
}

/**
 * Formata uma data para exibição completa
 * Mantida para compatibilidade com código existente
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(dateObj)
}


export function formatDateTime(date: string | Date): FormattedDateTime {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Para a data (2 de novembro de 2024)
  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Para o horário (15:05)
  const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
    hour: 'numeric',
    minute: 'numeric'
  })

  // Para a exibição completa (mantém o formato existente)
  const fullDateTime = formatDate(dateObj)

  return {
    date: dateFormatter.format(dateObj),
    time: timeFormatter.format(dateObj),
    fullDateTime
  }
}