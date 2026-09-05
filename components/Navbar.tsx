'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Inicio',           href: '#inicio' },
  { label: 'Nuestra Historia', href: '#historia' },
  { label: 'Productos',        href: '#productos' },
  { label: 'Proceso',          href: '#proceso' },
  { label: 'Contacto',         href: '#contacto' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted,  setMounted]  = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  // El menú móvil se cierra al pasar a escritorio (si no, queda un panel colgado
  // al rotar el teléfono o agrandar la ventana) y con la tecla Escape.
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  /**
   * El navbar tiene UN SOLO estado visual: barra sólida del tema, desde el
   * primer fotograma. No cambia con el scroll a propósito.
   *
   * Antes era transparente arriba y sólido al bajar, pero la primera sección de
   * la página es `Process` (fotogramas oscuros a pantalla completa): el estado
   * transparente dejaba texto oscuro sobre imagen oscura y el header no se leía,
   * además del salto de color al empezar a bajar. Mantenerlo fijo elimina las
   * dos cosas. Si algún día se quiere volver al header transparente, hay que
   * resolver primero el contraste sobre los fotogramas de `Process`.
   */
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50
        bg-crema/90 dark:bg-negro/90 backdrop-blur-md
        border-b border-negro/10 dark:border-crema/10
        shadow-lg shadow-negro/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — lleva al tope de la página, que es el inicio de Process */}
          <a
            href="#proceso"
            className="flex items-center gap-2 group"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              width="26" height="26" viewBox="0 0 24 24" fill="none"
              className="text-rojo dark:text-dorado transition-transform group-hover:scale-110"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="1" x2="6" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="14" y1="1" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-playfair text-xl font-bold transition-colors
              text-negro dark:text-crema group-hover:text-rojo dark:group-hover:text-dorado">
              Rodys Coffee
            </span>
          </a>

          {/* Links escritorio */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors
                  text-negro/70 dark:text-crema/70
                  hover:text-rojo dark:hover:text-dorado"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Toggle tema + botón hamburguesa */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label="Cambiar tema"
                className="p-2 rounded-full transition-colors
                  text-negro dark:text-crema
                  hover:bg-rojo/10 dark:hover:bg-dorado/10"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0,   opacity: 1 }}
                      exit={{    rotate: 90,  opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      <Sun size={20} className="text-dorado" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ rotate: 90,  opacity: 0 }}
                      animate={{ rotate: 0,   opacity: 1 }}
                      exit={{    rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      <Moon size={20} className="text-rojo" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}

            {/* Hamburguesa */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors
                text-negro dark:text-crema
                hover:bg-rojo/10 dark:hover:bg-dorado/10"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil con slide-down */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="menu-movil"
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0,    opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-crema dark:bg-negro
              border-t border-rojo/20 shadow-xl shadow-negro/30"
          >
            <nav className="px-6 py-2 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-negro dark:text-crema
                    hover:text-rojo dark:hover:text-dorado transition-colors py-3
                    border-b border-negro/5 dark:border-crema/5 last:border-0"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
