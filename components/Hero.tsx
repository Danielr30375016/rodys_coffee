'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { buildWhatsAppUrl } from '@/lib/config'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

const WHATSAPP_URL = buildWhatsAppUrl()

// Partículas de café — valores deterministas para evitar errores de hidratación
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left:     ((i * 37 + 13) % 97) + 1.5,
  top:      ((i * 53 + 7)  % 95) + 2.5,
  size:     ((i % 3) + 1) * 5,
  duration: 3 + (i % 4) * 0.8,
  delay:    (i * 0.28) % 3,
  opacity:  0.15 + (i % 5) * 0.06,
}))

function CoffeeParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-dorado"
          style={{
            left:    `${p.left}%`,
            top:     `${p.top}%`,
            width:   p.size,
            height:  p.size,
            opacity: p.opacity,
          }}
          animate={{ y: [0, -28, 0], opacity: [p.opacity, p.opacity * 2.5, p.opacity] }}
          transition={{
            duration:   p.duration,
            delay:      p.delay,
            repeat:     Infinity,
            ease:       'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden
        bg-gradient-to-br from-crema to-[#f5e6d0]
        dark:from-[#8B1A1A] dark:to-negro"
    >
      <CoffeeParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Contenido textual ── */}
          <div className="text-center lg:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full
                bg-rojo/10 dark:bg-dorado/10
                border border-rojo/30 dark:border-dorado/30
                text-rojo dark:text-dorado text-sm font-medium mb-6"
            >
              ☕ Café Especial · Prueba de Taza 85 pts
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.4 }}
              className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold
                text-negro dark:text-crema leading-tight mb-6"
            >
              El Sabor de Anolaima{' '}
              <span className="text-rojo dark:text-dorado">en Cada Taza</span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.6 }}
              className="text-base sm:text-lg text-negro/70 dark:text-crema/70
                max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Café especial cultivado a <strong>1.750 m</strong> sobre el nivel del mar en
              Cundinamarca, Colombia. Variedad Castillo con notas acaramelizadas.
            </motion.p>

            {/* Botones */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <WhatsAppButton href={WHATSAPP_URL} variant="primary">
                Pedir por WhatsApp
              </WhatsAppButton>

              {/* CTA secundario — scroll interno, no WhatsApp */}
              <a
                href="#productos"
                className="inline-flex items-center justify-center
                  px-8 py-4 rounded-full font-semibold text-lg
                  border-2 border-rojo dark:border-dorado
                  text-rojo dark:text-dorado
                  hover:bg-rojo/5 dark:hover:bg-dorado/5
                  transition-all duration-300"
              >
                Ver Productos
              </a>
            </motion.div>
          </div>

          {/* ── Imagen del empaque flotando ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            {/* Contenedor con animación float */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Halo/sombra dramática */}
              <div
                className="absolute inset-0 rounded-full
                  bg-rojo/25 dark:bg-dorado/20 blur-3xl
                  scale-75 translate-y-12"
              />
              {/* Imagen */}
              <div className="relative w-64 h-[360px] sm:w-80 sm:h-[440px]">
                <Image
                  src="/empaque-cafe-1.jpeg"
                  alt="Empaque Rodys Coffee"
                  fill
                  sizes="(max-width: 640px) 256px, 320px"
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Indicador de scroll ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1
          text-negro/40 dark:text-crema/40 select-none"
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
