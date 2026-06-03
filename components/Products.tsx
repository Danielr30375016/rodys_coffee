'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { buildWhatsAppUrl } from '@/lib/config'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { SectionBadge } from '@/components/ui/SectionBadge'

type Grind = 'Molido' | 'En Grano'

interface CardProps {
  title:        string
  description:  string
  badge:        string
  image:        string
  isBestValue?: boolean
  delay:        number
}

function ProductCard({ title, description, badge, image, isBestValue = false, delay }: CardProps) {
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
      className={`relative rounded-2xl overflow-hidden transition-shadow duration-300
        hover:shadow-2xl hover:shadow-rojo/20
        ${isBestValue
          ? 'bg-white dark:bg-cafe border-2 border-dorado'
          : 'bg-white dark:bg-cafe/40 border border-negro/10 dark:border-crema/10'
        }`}
    >
      {/* Shimmer animado en la tarjeta de mejor valor */}
      {isBestValue && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
          <motion.div
            animate={{ x: ['-110%', '210%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-dorado/15 to-transparent skew-x-12"
          />
        </div>
      )}

      {/* Imagen del empaque */}
      <div className="relative w-full h-64 bg-[#1a0a00]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-4 drop-shadow-2xl"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Gradiente suave en la parte inferior para transición al contenido */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-cafe to-transparent" />
      </div>

      <div className="relative z-10 p-8 pt-4">
        {/* Cabecera: badge */}
        <div className="flex items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isBestValue
              ? 'bg-dorado text-negro'
              : 'bg-rojo/10 dark:bg-rojo/20 text-rojo dark:text-crema'
          }`}>
            {badge}
          </span>
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
            image="/empaque-cafe-1.jpeg"
            delay={0.1}
          />
          <ProductCard
            title="Rodys Coffee — 5 Libras"
            description="Café Especial Tostión Media · 2.5 kg · Disponible molido o en grano"
            badge="⭐ Mejor Valor"
            image="/empaque-cafe-2.jpeg"
            isBestValue
            delay={0.2}
          />
        </div>
      </div>
    </section>
  )
}
