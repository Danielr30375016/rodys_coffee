'use client'

import { motion } from 'framer-motion'
import FadeIn from './FadeIn'
import { buildWhatsAppUrl } from '@/lib/config'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

const WHATSAPP_URL = buildWhatsAppUrl()

/** Patrón decorativo de granos de café en SVG con opacidad muy baja */
function CoffeePattern() {
  const ITEMS = Array.from({ length: 18 }, (_, i) => ({
    id:     i,
    x:      ((i * 79 + 23) % 96) + 2,
    y:      ((i * 61 + 11) % 94) + 3,
    rotate: (i * 41) % 360,
    scale:  0.5 + (i % 3) * 0.35,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06]" aria-hidden>
      {ITEMS.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={{
            left:      `${item.x}%`,
            top:       `${item.y}%`,
            transform: `rotate(${item.rotate}deg) scale(${item.scale})`,
          }}
        >
          {/* Grano de café SVG inline */}
          <svg width="36" height="54" viewBox="0 0 36 54" fill="white">
            <ellipse cx="18" cy="27" rx="14" ry="24" />
            <line x1="18" y1="3" x2="18" y2="51" stroke="rgba(0,0,0,0.4)" strokeWidth="2"/>
          </svg>
        </div>
      ))}
    </div>
  )
}

export default function CTA() {
  return (
    <section
      id="contacto"
      className="relative py-24 lg:py-36 overflow-hidden
        bg-gradient-to-br from-rojo via-cafe to-negro"
    >
      <CoffeePattern />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <FadeIn direction="up">
          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold
            text-white leading-tight mb-6">
            ¿Listo para probar el mejor café de Anolaima?
          </h2>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-12">
            Pedidos directos, envío a todo Colombia. Escríbenos y te asesoramos.
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.4}>
          {/* Botón con efecto pulse continuo */}
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative overflow-hidden inline-flex items-center gap-3
              px-10 py-5 rounded-full
              bg-dorado hover:bg-dorado/90 text-negro font-bold text-xl
              shadow-2xl shadow-dorado/30 group transition-colors duration-300"
          >
            <WhatsAppIcon size={28} />
            <span className="relative z-10">☕ Pedir por WhatsApp Ahora</span>
            {/* Shimmer izq→der al hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full
              transition-transform duration-700
              bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.a>
        </FadeIn>
      </div>
    </section>
  )
}
