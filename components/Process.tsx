'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { SectionBadge } from '@/components/ui/SectionBadge'

/**
 * Sección "Del Campo a tu Taza" — un video real del proceso completo
 * (cosecha → despulpado → lavado → secado → tostión → molienda → taza)
 * que se "ancla" en pantalla mientras el usuario hace scroll: la posición
 * del scroll controla directamente el currentTime del video, igual que
 * las páginas de producto tipo Apple.
 */

const LABELS = [
  { at: 0.0,  text: 'Cultivado en las montañas de Anolaima' },
  { at: 0.22, text: 'Cosecha selectiva, grano por grano' },
  { at: 0.42, text: 'Lavado y secado natural al sol' },
  { at: 0.68, text: 'Tostión artesanal en pequeños lotes' },
  { at: 0.88, text: 'Molido fresco, listo para tu taza' },
]

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef      = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [labelIndex, setLabelIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Barra de progreso visual
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const video = videoRef.current
    if (!video || !videoReady || !video.duration) return

    const clamped = Math.min(Math.max(progress, 0), 1)
    video.currentTime = clamped * video.duration

    // Determina qué etiqueta de texto mostrar según el progreso
    let idx = 0
    for (let i = 0; i < LABELS.length; i++) {
      if (clamped >= LABELS[i].at) idx = i
    }
    setLabelIndex(idx)
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onLoaded = () => setVideoReady(true)
    video.addEventListener('loadedmetadata', onLoaded)
    // Por si ya cargó antes de montar el listener
    if (video.readyState >= 1) setVideoReady(true)
    return () => video.removeEventListener('loadedmetadata', onLoaded)
  }, [])

  return (
    // Contenedor alto: define cuánto scroll "dura" la secuencia completa.
    // 400vh ≈ recorre el video completo sin sentirse ni muy rápido ni muy lento.
    <section id="proceso" ref={containerRef} className="relative h-[400vh] bg-negro">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Video de fondo */}
        <video
          ref={videoRef}
          src="/proceso-cafe.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Degradados para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

        {/* Encabezado fijo arriba */}
        <div className="absolute top-8 sm:top-12 left-0 right-0 text-center px-4 z-10">
          <SectionBadge>Nuestro Proceso</SectionBadge>
          <h2 className="mt-4 font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-crema">
            Del Campo a tu Taza
          </h2>
        </div>

        {/* Texto de la etapa actual */}
        <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 text-center px-6 z-10">
          <motion.p
            key={labelIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-playfair text-xl sm:text-2xl lg:text-3xl font-semibold text-crema
              drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
          >
            {LABELS[labelIndex].text}
          </motion.p>
        </div>

        {/* Barra de progreso */}
        <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 w-48 sm:w-64 z-10">
          <div className="h-1 rounded-full bg-crema/20 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rojo to-dorado rounded-full"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Pista de scroll, solo visible al inicio */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-10
            flex flex-col items-center gap-1 text-crema/70 text-xs font-medium pointer-events-none"
        >
          <span>Sigue bajando</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </section>
  )
}