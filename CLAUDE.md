# Rodys Coffee — Contexto del Proyecto

Sitio web de Rodys Coffee (café especial de Anolaima, Cundinamarca, Colombia).

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (colores custom, ver abajo)
- Framer Motion — animaciones 2D en toda la página
- Three.js + @react-three/fiber (v8) + @react-three/drei (v9) — escena 3D del Hero
  - **Importante**: fijado a v8.x de fiber / v9.x de drei porque el proyecto usa React 18.
    No actualizar a fiber v9 (requiere React 19) sin migrar React primero.
- next-themes — modo oscuro/claro

## Estructura
- `components/` — un componente por sección (Hero, Products, Story, etc.)
- `components/ui/` — piezas reutilizables (WhatsAppButton, SectionBadge, WhatsAppIcon)
- `lib/config.ts` — número de WhatsApp, textos de marca, `buildWhatsAppUrl()`
- `app/layout.tsx` — fuentes (Playfair Display + Inter), ThemeProvider

## Paleta de colores (tailwind.config.ts)
- `rojo` #8B1A1A · `dorado` #C9A84C · `crema` #FDF6EC · `negro` #0F0A06 · `cafe` #3D1C02

## Decisiones de diseño recientes
- **Hero**: la imagen estática del empaque se reemplazó por `components/CoffeeBag3D.tsx`,
  una bolsa de café renderizada con primitivas de Three.js (RoundedBox + planos con la
  foto real como textura), arrastrable con mouse/touch, con auto-rotación y flote.
  Se carga con `next/dynamic` y `ssr: false` porque WebGL no existe en servidor.
- **Products**: una sola tarjeta interactiva (no tarjetas separadas por producto) con
  selector de Tamaño (1 Libra / 5 Libras) y Presentación (Molido / En Grano). Cambiar
  el tamaño anima la imagen del empaque con una transición 3D (`rotateY` con
  `AnimatePresence`). El mensaje de WhatsApp incluye ambas selecciones.
- **WhatsApp**: todos los CTAs usan `buildWhatsAppUrl()` de `lib/config.ts`. El número
  real ya está configurado ahí — no es un placeholder.

## Convenciones
- Componentes de cliente (`'use client'`) para todo lo que use hooks, animación o Three.js
- Comentarios en español, coherente con el resto del código existente
- Mobile-first: usar breakpoints `sm:` / `md:` / `lg:` de Tailwind, no media queries manuales

## Pendientes / ideas para seguir
- Aplicar el mismo tilt 3D (o una versión más ligera con CSS) a las tarjetas de otras
  secciones si se pide más interacción
- Considerar reemplazar la bolsa procedural por un modelo `.glb` real si se consigue
  un escaneo 3D del empaque, para mayor realismo
