'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { buildWhatsAppUrl } from '@/lib/config'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { SectionBadge } from '@/components/ui/SectionBadge'

type Grind = 'Molido' | 'En Grano'

interface CardProps {
  title:        string
  description:  string
  badge:        string
  isBestValue?: boolean
  delay:        number
}

/** Ícono SVG de bolsa de café */
function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} width="28" height="28">
      <path
        d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function ProductCard({ title, description, badge, isBestValue = false, delay }: CardProps) {
  const [grind, setGrind] = useState<Grind>('Molido')
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const message = `Hola! Quiero pedir ${title} [${grind}] ☕`
  const url     = buildWhatsAppUrl(message)

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl p-8 transition-shadow duration-300
        hover:shadow-2xl hover:shadow-rojo/20
        ${isBestValue
          ? 'bg-white dark:bg-cafe border-2 border-dorado'
          : 'bg-white dark:bg-cafe/40 border border-negro/10 dark:border-crema/10'
        }`}
    >
      {/* Shimmer animado en la tarjeta de mejor valor */}
      {isBestValue && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: ['-110%', '210%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-dorado/15 to-transparent skew-x-12"
          />
        </div>
      )}

      <div className="relative z-10">
        {/* Cabecera: badge + ícono */}
        <div className="flex items-center justify-between mb-6">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isBestValue
              ? 'bg-dorado text-negro'
              : 'bg-rojo/10 dark:bg-rojo/20 text-rojo dark:text-crema'
          }`}>
            {badge}
          </span>
          <BagIcon className={isBestValue ? 'text-dorado' : 'text-rojo dark:text-dorado'} />
        </div>

        {/* Nombre y descripción */}
        <h3 className="font-playfair text-2xl font-bold text-negro dark:text-crema mb-2">
          {title}
        </h3>
        <p className="text-negro/55 dark:text-crema/55 text-sm leading-relaxed mb-6">
          {description}
        </p>

        {/* Opciones molido / en grano */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-negro/60 dark:text-crema/60 mb-3">
            Presentación
          </p>
          <div className="flex gap-3">
            {(['Molido', 'En Grano'] as Grind[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setGrind(opt)}
                className={`flex-1 py-2 px-3 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                  grind === opt
                    ? 'bg-rojo border-rojo text-white dark:bg-dorado dark:border-dorado dark:text-negro'
                    : 'border-negro/20 dark:border-crema/20 text-negro/60 dark:text-crema/60 hover:border-rojo dark:hover:border-dorado'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Botón WhatsApp */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative overflow-hidden w-full flex items-center justify-center gap-2
            py-4 rounded-full font-semibold transition-all duration-300 group
            ${isBestValue
              ? 'bg-dorado hover:bg-dorado/90 text-negro shadow-lg shadow-dorado/25'
              : 'bg-rojo hover:bg-rojo/90 text-white shadow-lg shadow-rojo/25'
            }`}
        >
          <WhatsAppIcon />
          <span className="relative z-10">Pedir por WhatsApp</span>
          {/* Shimmer hover */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full
            transition-transform duration-700
            bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </a>
      </div>
    </motion.article>
  )
}

export default function Products() {
  return (
    <section id="productos" className="py-20 lg:py-28 bg-[#f5e6d0] dark:bg-cafe/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionBadge>Productos</SectionBadge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-negro dark:text-crema mb-4"
          >
            Nuestros Productos
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-negro/60 dark:text-crema/60 text-lg max-w-xl mx-auto"
          >
            Café tostado medio, disponible molido o en grano
          </motion.p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ProductCard
            title="Rodys Coffee — 1 Libra"
            description="Café Especial Tostión Media · 500 g · Disponible molido o en grano"
            badge="Café de Colombia"
            delay={0.1}
          />
          <ProductCard
            title="Rodys Coffee — 5 Libras"
            description="Café Especial Tostión Media · 2.5 kg · Disponible molido o en grano"
            badge="⭐ Mejor Valor"
            isBestValue
            delay={0.2}
          />
        </div>
      </div>
    </section>
  )
}
