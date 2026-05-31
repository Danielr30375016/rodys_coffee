'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  /** Dirección desde la que entra el elemento */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Retraso en segundos antes de iniciar la animación */
  delay?: number
  /** Duración en segundos de la animación */
  duration?: number
  className?: string
}

const directionMap: Record<NonNullable<FadeInProps['direction']>, { x: number; y: number }> = {
  up:    { y: 40,  x: 0   },
  down:  { y: -40, x: 0   },
  left:  { x: 60,  y: 0   },
  right: { x: -60, y: 0   },
}

export default function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className,
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const initial = { opacity: 0, ...directionMap[direction] }
  const animate = isInView ? { opacity: 1, x: 0, y: 0 } : initial

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
