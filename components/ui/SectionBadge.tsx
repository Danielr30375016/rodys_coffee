/**
 * Badge de sección — pill de texto reutilizable en cada encabezado de sección.
 *
 * Uso:
 *   <SectionBadge>Nuestra Historia</SectionBadge>
 *   <SectionBadge inverted>Perfil de Taza</SectionBadge>  ← sobre fondos oscuros/rojos
 */
interface SectionBadgeProps {
  children: React.ReactNode
  /** Usa colores invertidos (para secciones con fondo oscuro) */
  inverted?: boolean
}

export function SectionBadge({ children, inverted = false }: SectionBadgeProps) {
  return (
    <span
      className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 ${
        inverted
          ? 'bg-white/10 text-dorado border border-dorado/30'
          : 'bg-rojo/10 dark:bg-dorado/10 text-rojo dark:text-dorado'
      }`}
    >
      {children}
    </span>
  )
}
