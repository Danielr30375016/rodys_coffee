'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SectionBadge } from '@/components/ui/SectionBadge'

const STEPS = [
  {
    icon:        '🌱',
    title:       'Cultivo',
    description: 'Variedad Castillo en Anolaima, Cundinamarca a 1.750 msnm',
  },
  {
    icon:        '🍒',
    title:       'Cosecha Selectiva',
    description: 'Recolección manual en el punto exacto de maduración',
  },
  {
    icon:        '💧',
    title:       'Beneficio',
    description: 'Proceso húmedo para resaltar la limpieza y dulzura de la taza',
  },
  {
    icon:        '☀️',
    title:       'Secado',
    description: 'Secado natural en camas africanas para potenciar los aromas',
  },
  {
    icon:        '🔥',
    title:       'Tostión Media',
    description: 'Perfil de tueste que equilibra acidez, cuerpo y dulzura',
  },
]

export default function Process() {
  const ref     = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="proceso" ref={ref} className="py-20 lg:py-28 bg-crema dark:bg-negro">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <SectionBadge>Nuestro Proceso</SectionBadge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold
              text-negro dark:text-crema"
          >
            Del Campo a tu Taza
          </motion.h2>
        </div>

        {/* Timeline
            xs (< 640px): ícono a la izquierda, texto a la derecha — diseño lineal simple
            sm+: zigzag alternado con línea central */}
        <div className="relative">
          {/* Línea de fondo — solo en sm+ */}
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2
            bg-negro/10 dark:bg-crema/10" />

          {/* Línea animada — solo en sm+ */}
          <motion.div
            className="hidden sm:block absolute left-1/2 top-0 w-0.5 -translate-x-1/2 origin-top
              bg-gradient-to-b from-rojo to-dorado"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 2.2, delay: 0.4, ease: 'easeOut' }}
            style={{ height: '100%' }}
          />

          <div className="space-y-10 sm:space-y-14">
            {STEPS.map((step, i) => {
              const fromLeft = i % 2 === 0
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: fromLeft ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.3 + i * 0.18 }}
                  className={`relative
                    /* xs: siempre fila izq→der */
                    flex items-start gap-4
                    /* sm+: zigzag */
                    sm:items-center sm:gap-6
                    ${fromLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                >
                  {/* Ícono circular */}
                  <div className="relative z-10 shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full
                    flex items-center justify-center text-xl sm:text-2xl
                    bg-rojo dark:bg-dorado shadow-lg shadow-rojo/30 dark:shadow-dorado/20">
                    {step.icon}
                  </div>

                  {/* Texto
                      xs: siempre alineado a la izquierda
                      sm+: alternado según la columna */}
                  <div className={`flex-1
                    text-left
                    sm:${fromLeft ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-playfair text-lg sm:text-xl font-bold
                      text-negro dark:text-crema mb-1">
                      {step.title}
                    </h3>
                    <p className="text-negro/60 dark:text-crema/60 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Espacio espejo — solo en sm+ para centrar el ícono en la línea */}
                  <div className="hidden sm:block flex-1" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
