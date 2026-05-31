'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { buildWhatsAppUrl } from '@/lib/config'
import { SectionBadge } from '@/components/ui/SectionBadge'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

const WHATSAPP_URL = buildWhatsAppUrl()

export default function Story() {
  const ref     = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="historia" ref={ref} className="py-20 lg:py-28 bg-crema dark:bg-negro">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Imagen con parallax sutil ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-80 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/empaque-campo-1.jpg"
                alt="Empaque Rodys Coffee en el campo"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-negro/30 to-transparent" />
            </div>
            {/* Mini tarjeta de imagen secundaria — solo desktop */}
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-xl overflow-hidden
                border-4 border-crema dark:border-negro shadow-xl hidden lg:block"
            >
              <Image
                src="/empaque-campo-2.jpg"
                alt="Empaque Rodys Coffee en montaña"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* ── Texto ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SectionBadge>Nuestra Historia</SectionBadge>

            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold
              text-negro dark:text-crema mb-6 leading-tight">
              Desde las montañas de Anolaima hasta tu taza
            </h2>

            <div className="space-y-4 text-negro/70 dark:text-crema/70 leading-relaxed text-base sm:text-lg">
              <p>
                Rodys Coffee nace en el corazón de Anolaima, Cundinamarca, municipio
                reconocido por sus condiciones únicas para el cultivo del café de origen.
              </p>
              <p>
                A 1.750 metros sobre el nivel del mar, nuestra variedad Castillo crece
                lentamente, desarrollando una taza suave con aromas acaramelizados y una
                dulzura natural que se siente desde el primer sorbo.
              </p>
              <p>
                Cada bolsa que llega a tus manos representa el trabajo, la tradición y el
                amor por el café especial colombiano.
              </p>
            </div>

            <div className="mt-8">
              <WhatsAppButton href={WHATSAPP_URL} variant="outline">
                Pedir ahora
              </WhatsAppButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
