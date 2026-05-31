'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface StatItem {
  display:      string   // lo que se muestra cuando no hay animación numérica
  numericValue?: number
  suffix?:      string
  label:        string
}

const STATS: StatItem[] = [
  { display: '1.750', numericValue: 1750, suffix: ' m',   label: 'Altura sobre el nivel del mar' },
  { display: '85',    numericValue: 85,   suffix: ' pts', label: 'Prueba de taza SCA' },
  { display: '100',   numericValue: 100,  suffix: '%',    label: 'Café de Colombia' },
  { display: 'Castillo',                               label: 'Variedad especial' },
]

/** Contador que se anima desde 0 hasta `target` usando requestAnimationFrame */
function AnimatedCounter({
  target,
  suffix,
  active,
}: {
  target: number
  suffix: string
  active: boolean
}) {
  const [count, setCount] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!active || startedRef.current) return
    startedRef.current = true

    const DURATION = 1800
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / DURATION, 1)
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [active, target])

  const formatted = target >= 1000 ? count.toLocaleString('es-CO') : String(count)
  return <>{formatted}{suffix}</>
}

export default function Attributes() {
  const ref     = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-rojo py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.55, delay: i * 0.14 }}
              className="text-center"
            >
              <div className="font-playfair text-3xl sm:text-4xl font-bold text-dorado mb-2 tabular-nums">
                {stat.numericValue !== undefined ? (
                  <AnimatedCounter
                    target={stat.numericValue}
                    suffix={stat.suffix ?? ''}
                    active={isInView}
                  />
                ) : (
                  stat.display
                )}
              </div>
              <p className="text-white/80 text-sm sm:text-base leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
