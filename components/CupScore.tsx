'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SectionBadge } from '@/components/ui/SectionBadge'
import { BRAND } from '@/lib/config'

const ATTRIBUTES = [
  { label: 'Dulzura',             value: 88 },
  { label: 'Acidez',              value: 72 },
  { label: 'Cuerpo',              value: 80 },
  { label: 'Aroma Caramelizado',  value: 90 },
]

const TASTING_NOTES = ['Caramelo', 'Panela', 'Frutos Secos', 'Chocolate', 'Floral']

function Bar({ value, delay, active }: { value: number; delay: number; active: boolean }) {
  return (
    <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-dorado to-rojo"
        initial={{ width: 0 }}
        animate={active ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      />
    </div>
  )
}

export default function CupScore() {
  const ref     = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 lg:py-28 bg-rojo dark:bg-negro">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionBadge inverted>Perfil de Taza</SectionBadge>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Perfil Sensorial
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/70 text-lg"
          >
            Puntuación SCA:{' '}
            <span className="text-dorado font-bold">{BRAND.cupscore} / 100</span>
            {' '}— Café Especial Certificado
          </motion.p>
        </div>

        {/* Barras de atributos */}
        <div className="space-y-6 mb-12">
          {ATTRIBUTES.map((attr, i) => (
            <motion.div
              key={attr.label}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.14 }}
              className="flex flex-col gap-1"
            >
              {/* En xs: etiqueta arriba barra abajo. En sm+: fila horizontal */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="sm:w-40 sm:shrink-0 sm:text-right text-left
                  text-white/90 text-sm font-medium">
                  {attr.label}
                </span>
                <Bar value={attr.value} delay={0.5 + i * 0.14} active={isInView} />
                <span className="hidden sm:block w-11 shrink-0 text-dorado font-bold text-sm tabular-nums">
                  {attr.value}%
                </span>
              </div>
              {/* Porcentaje visible solo en xs, alineado a la derecha */}
              <span className="sm:hidden text-right text-dorado font-bold text-xs tabular-nums mt-0.5">
                {attr.value}%
              </span>
            </motion.div>
          ))}
        </div>

        {/* Notas de taza */}
        <div className="flex flex-wrap justify-center gap-3">
          {TASTING_NOTES.map((note, i) => (
            <motion.span
              key={note}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.0 + i * 0.1 }}
              className="px-5 py-2 rounded-full border border-dorado/40 bg-white/5
                text-dorado text-sm font-medium"
            >
              {note}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
