'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { SectionBadge } from '@/components/ui/SectionBadge'

/**
 * Sección "Del Campo a tu Taza" — el proceso completo del café animado
 * y controlado 100% por el scroll.
 *
 * En vez de un <video> (que "tartamudea" al saltar a un punto exacto,
 * porque los códecs de video solo guardan fotogramas clave y calculan
 * el resto), usamos una SECUENCIA DE IMÁGENES pre-generada a partir del
 * video (una foto por cada fotograma) y las dibujamos en un <canvas>
 * según el progreso del scroll. Cada fotograma se muestra al instante,
 * sin ningún salto ni recálculo — es la misma técnica que usan las
 * páginas de producto de Apple.
 */

const TOTAL_FRAMES = 120
const FRAME_PATH = (i: number) => `/proceso-frames/frame_${String(i).padStart(3, '0')}.jpg`

// En pantallas angostas (celular), el video horizontal se recorta por los
// lados para llenar la pantalla. FOCUS_X decide qué parte horizontal del
// fotograma queda centrada: 0.5 = centro exacto, menor que 0.5 = más hacia
// la izquierda, mayor que 0.5 = más hacia la derecha. Ajusta y prueba en
// tu celular hasta que el sujeto principal de cada escena quede bien encuadrado.
const FOCUS_X = 0.5

const LABELS = [
  { at: 0.0,  text: 'Cultivado en las montañas de Anolaima' },
  { at: 0.22, text: 'Cosecha selectiva, grano por grano' },
  { at: 0.42, text: 'Lavado y secado natural al sol' },
  { at: 0.68, text: 'Tostión artesanal en pequeños lotes' },
  { at: 0.88, text: 'Molido fresco, listo para tu taza' },
]

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const imagesRef      = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(1)

  const rafRef          = useRef<number | null>(null)
  const pendingFrameRef = useRef(1)

  const [loadedCount, setLoadedCount] = useState(0)
  const [labelIndex, setLabelIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const progressWidth     = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  // Dibuja un fotograma específico en el canvas, ajustado tipo "object-fit: cover"
  // (llena toda la pantalla, recortando los bordes) con suavizado de alta calidad
  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current
    const img = imagesRef.current[frameNumber - 1]
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const cssWidth = canvas.width / dpr
    const cssHeight = canvas.height / dpr
    const canvasRatio = cssWidth / cssHeight
    const imgRatio = img.naturalWidth / img.naturalHeight

    let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number
    if (imgRatio > canvasRatio) {
      // La imagen es más ancha que la pantalla: ajusta por alto y recorta los lados,
      // usando FOCUS_X para decidir qué franja horizontal queda visible
      drawHeight = cssHeight
      drawWidth = drawHeight * imgRatio
      offsetX = (cssWidth - drawWidth) * FOCUS_X
      offsetY = 0
    } else {
      // La imagen es más angosta que la pantalla: ajusta por ancho y recorta arriba/abajo
      drawWidth = cssWidth
      drawHeight = drawWidth / imgRatio
      offsetX = 0
      offsetY = (cssHeight - drawHeight) / 2
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.clearRect(0, 0, cssWidth, cssHeight)
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  }, [])

  // Precarga todas las imágenes. La primera se dibuja apenas está lista.
  useEffect(() => {
    let cancelled = false
    let loaded = 0

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = FRAME_PATH(i)
      img.onload = () => {
        if (cancelled) return
        loaded += 1
        setLoadedCount(loaded)
        if (i === 1) drawFrame(1)
      }
      imagesRef.current[i - 1] = img
    }

    return () => { cancelled = true }
  }, [drawFrame])

  // Ajusta el tamaño del canvas al panel (no a pantalla completa), con soporte retina
  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = canvas?.parentElement
    if (!canvas || !wrapper) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const cssWidth = wrapper.clientWidth
      const cssHeight = wrapper.clientHeight
      canvas.width = cssWidth * dpr
      canvas.height = cssHeight * dpr
      const ctx = canvas.getContext('2d')
      ctx?.setTransform(1, 0, 0, 1, 0, 0)
      ctx?.scale(dpr, dpr)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      drawFrame(currentFrameRef.current)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame])

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const clamped = Math.min(Math.max(progress, 0), 1)
    const frame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(clamped * (TOTAL_FRAMES - 1)) + 1))
    currentFrameRef.current = frame
    pendingFrameRef.current = frame
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        drawFrame(pendingFrameRef.current)
      })
    }

    let idx = 0
    for (let i = 0; i < LABELS.length; i++) {
      if (clamped >= LABELS[i].at) idx = i
    }
    setLabelIndex((prev) => (prev === idx ? prev : idx))
  })

  // Agrupa los dibujos: los eventos de scroll llegan varias veces por fotograma de
  // pantalla y dibujar en cada uno hacía que el compositor presentara el canvas a
  // medio actualizar (mitad fotograma viejo, mitad nuevo = la pantalla "partida").
  // Con rAF se dibuja como mucho una vez por fotograma, justo antes de pintar.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const isFullyLoaded = loadedCount >= TOTAL_FRAMES

  return (
    // 400vh de alto define cuánto scroll "dura" la secuencia completa.
    <section id="proceso" ref={containerRef} className="relative h-[400vh] bg-negro">
      {/* `svh` = altura del viewport con la barra del navegador VISIBLE. En móvil,
          `h-screen` (100vh) es más alto que el área útil: la barra de progreso y la
          pista de scroll quedaban fuera de pantalla, y al ocultarse/reaparecer la
          barra del navegador se disparaba un `resize` que limpiaba y redibujaba el
          canvas — el salto que se ve al desplazarse. Con `svh` la altura no cambia.
          `supports-[]` deja `h-screen` de respaldo en navegadores sin `svh`. */}
      <div className="sticky top-0 h-screen supports-[height:100svh]:h-[100svh]
        w-full overflow-hidden flex items-center justify-center bg-negro">

        {/* Canvas a pantalla completa */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full transform-gpu will-change-transform"
        />

        {/* Indicador de carga sutil mientras se precargan los fotogramas restantes */}
        {!isFullyLoaded && (
          <div className="absolute top-4 right-4 z-20 text-crema/50 text-xs font-medium">
            Cargando {Math.round((loadedCount / TOTAL_FRAMES) * 100)}%
          </div>
        )}

        {/* Degradados para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

        {/* Encabezado fijo arriba */}
        <div className="absolute top-20 sm:top-24 left-0 right-0 text-center px-4 z-10">
          {/* 'inverted' fijo: Process es siempre oscura, sin importar el tema */}
          <SectionBadge inverted>Nuestro Proceso</SectionBadge>
          <h2 className="mt-4 font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-crema
            drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Del Campo a tu Taza
          </h2>
        </div>

        {/* Texto de la etapa actual */}
        <div className="absolute bottom-28 sm:bottom-32 left-0 right-0 text-center px-6 z-10">
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
          className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-10
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