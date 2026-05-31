'use client'

import FadeIn from './FadeIn'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { buildWhatsAppUrl, WHATSAPP_NUMBER, BRAND } from '@/lib/config'

const WHATSAPP_URL = buildWhatsAppUrl()

function CupIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-dorado">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="1" x2="6" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="14" y1="1" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-negro text-crema py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="flex flex-col items-center text-center gap-6">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <CupIcon />
              <span className="font-playfair text-2xl font-bold">{BRAND.name}</span>
            </div>

            {/* Tagline */}
            <p className="text-dorado font-semibold tracking-wide">
              {BRAND.tagline}
            </p>

            {/* Info */}
            <p className="text-crema/55 text-sm">
              {BRAND.origin} · {BRAND.altitude} · {BRAND.variety}
            </p>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-crema/65 hover:text-dorado transition-colors duration-200"
            >
              <WhatsAppIcon size={20} />
              <span>+{WHATSAPP_NUMBER}</span>
            </a>

            {/* Sello */}
            <div className="px-5 py-2 rounded-full border border-dorado/35 text-dorado text-sm font-medium">
              ☕ Café de Colombia ✓
            </div>

            {/* Divisor */}
            <div className="w-full max-w-xs h-px bg-crema/10" />

            {/* Copyright */}
            <p className="text-crema/35 text-sm">
              © 2025 Rodys Coffee. Todos los derechos reservados.
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}
