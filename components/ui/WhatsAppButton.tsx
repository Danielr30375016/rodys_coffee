'use client'

import { WhatsAppIcon } from './WhatsAppIcon'

interface WhatsAppButtonProps {
  /** URL completa con mensaje ya encodado (usa buildWhatsAppUrl de lib/config) */
  href:      string
  children:  React.ReactNode
  /** Variante de estilo */
  variant?:  'primary' | 'outline' | 'gold'
  /** Tamaño del botón */
  size?:     'md' | 'lg'
  /** Mostrar ícono de WhatsApp */
  showIcon?: boolean
  className?: string
}

/**
 * Botón de WhatsApp reutilizable.
 * Siempre abre en nueva pestaña con rel="noopener noreferrer".
 *
 * Uso:
 *   <WhatsAppButton href={buildWhatsAppUrl()} variant="primary">Pedir ahora</WhatsAppButton>
 */
export function WhatsAppButton({
  href,
  children,
  variant   = 'primary',
  size      = 'md',
  showIcon  = false,
  className = '',
}: WhatsAppButtonProps) {
  const sizeClasses = size === 'lg'
    ? 'px-10 py-5 text-xl gap-3'
    : 'px-8 py-4 text-base gap-2'

  const variantClasses: Record<NonNullable<WhatsAppButtonProps['variant']>, string> = {
    primary: `bg-rojo dark:bg-dorado text-white dark:text-negro
              shadow-lg hover:shadow-xl hover:shadow-rojo/30 dark:hover:shadow-dorado/30`,
    outline: `border-2 border-rojo dark:border-dorado text-rojo dark:text-dorado
              hover:bg-rojo hover:text-white dark:hover:bg-dorado dark:hover:text-negro`,
    gold:    `bg-dorado hover:bg-dorado/90 text-negro shadow-lg shadow-dorado/30`,
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        relative overflow-hidden inline-flex items-center justify-center font-semibold
        rounded-full transition-all duration-300 group
        ${sizeClasses} ${variantClasses[variant]} ${className}
      `}
    >
      {showIcon && <WhatsAppIcon size={size === 'lg' ? 28 : 20} />}
      <span className="relative z-10">{children}</span>

      {/* Efecto shimmer de izquierda a derecha al hover */}
      <span
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full
          transition-transform duration-700
          bg-gradient-to-r from-transparent via-white/25 to-transparent"
        aria-hidden
      />
    </a>
  )
}
