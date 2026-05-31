'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Inicio',          href: '#inicio' },
  { label: 'Nuestra Historia', href: '#historia' },
  { label: 'Productos',       href: '#productos' },
  { label: 'Proceso',         href: '#proceso' },
  { label: 'Contacto',        href: '#contacto' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [mounted,   setMounted]   = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-crema/80 dark:bg-negro/80 backdrop-blur-md shadow-lg shadow-negro/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 group">
            <svg
              width="26" height="26" viewBox="0 0 24 24" fill="none"
              className="text-rojo transition-transform group-hover:scale-110"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="1" x2="6" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="14" y1="1" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-playfair text-xl font-bold text-negro dark:text-crema group-hover:text-rojo dark:group-hover:text-dorado transition-colors">
              Rodys Coffee
            </span>
          </a>

          {/* Links escritorio */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-negro/70 dark:text-crema/70 hover:text-rojo dark:hover:text-dorado transition-colors"
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
                className="p-2 rounded-full hover:bg-rojo/10 dark:hover:bg-dorado/10 transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0,   opacity: 1 }}
                      exit={{    rotate: 90,  opacity: 0 }}
                      transition={{ duration: 0.2 }}
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
                    >
                      <Moon size={20} className="text-rojo" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}

            {/* Hamburguesa */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-rojo/10 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menú de navegación"
            >
              {menuOpen
                ? <X    size={22} className="text-negro dark:text-crema" />
                : <Menu size={22} className="text-negro dark:text-crema" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil con slide-down */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0,    opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-crema dark:bg-negro border-t border-rojo/20"
          >
            <nav className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-negro dark:text-crema hover:text-rojo dark:hover:text-dorado transition-colors py-1"
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
