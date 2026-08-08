/**
 * Configuración global del sitio.
 * Modifica este archivo para actualizar datos de contacto o textos globales.
 */

// ─── WhatsApp ────────────────────────────────────────────────────────────────

/** Número en formato internacional sin '+' (ej: 573101234567) */
export const WHATSAPP_NUMBER = '573026686020'

/**
 * Genera el enlace de WhatsApp con un mensaje predeterminado.
 * @param message - Texto del mensaje (sin encodeURIComponent, se aplica internamente)
 */
export function buildWhatsAppUrl(message?: string): string {
  const defaultMsg = 'Hola! Quiero pedir Rodys Coffee ☕'
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message ?? defaultMsg)}`
}

// ─── Marca ───────────────────────────────────────────────────────────────────

export const BRAND = {
  name:      'Rodys Coffee',
  tagline:   'Café Especial de Colombia',
  origin:    'Anolaima, Cundinamarca',
  altitude:  '1.750 msnm',
  variety:   'Variedad Castillo',
  cupscore:  85,
} as const