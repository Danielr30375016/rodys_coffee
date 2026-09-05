# Rodys Coffee — Contexto del Proyecto

Sitio web de una sola página (landing) de Rodys Coffee: café especial de Anolaima,
Cundinamarca, Colombia. Todos los pedidos se cierran por WhatsApp — no hay carrito,
backend ni pasarela de pago.

## Comandos
```bash
npm run dev            # servidor de desarrollo
npm run build          # build de producción — úsalo para verificar, no hay tests
npx tsc --noEmit       # solo chequeo de tipos, más rápido que el build
npm run lint
```
El proyecto **no tiene tests**. La verificación es `tsc --noEmit` + `next build`, y para
todo lo de móvil hace falta probar en un dispositivo real (ver "Trampas de móvil").

## Stack
- Next.js 14 (App Router) + TypeScript + React 18
- Tailwind CSS (colores y animaciones custom, ver abajo)
- Framer Motion — todas las animaciones del sitio
- lucide-react — iconos del Navbar (Sun, Moon, Menu, X)
- next-themes — modo oscuro/claro (`defaultTheme: 'dark'`, `enableSystem`)
- **No hay Three.js.** La escena 3D del Hero (`CoffeeBag3D.tsx`) se eliminó; el Hero
  volvió a una imagen estática animada con Framer Motion. Si se reintroduce 3D, fijar
  `@react-three/fiber` a v8.x y `@react-three/drei` a v9.x — las versiones nuevas
  requieren React 19.

## Estructura
- `app/page.tsx` — compone todas las secciones en orden
- `app/layout.tsx` — fuentes (Playfair Display + Inter vía `next/font/google`),
  metadata SEO, favicon SVG inline, `ThemeProvider`
- `app/globals.css` — `scroll-behavior: smooth`, `scroll-padding-top: 4rem` (compensa el
  navbar fijo para que las anclas no queden tapadas), override de `prefers-reduced-motion`,
  estilos base del body, utilidad `.shimmer-btn`
- `components/` — un componente por sección
- `components/ui/` — piezas reutilizables (`WhatsAppButton`, `SectionBadge`, `WhatsAppIcon`)
- `components/ThemeProvider.tsx` — envoltorio de `next-themes`, usado en `layout.tsx`
- `components/FadeIn.tsx` — wrapper genérico de entrada al viewport (`direction`, `delay`, `duration`)
- `lib/config.ts` — `WHATSAPP_NUMBER`, `buildWhatsAppUrl()`, objeto `BRAND`
- `public/` — `empaque-cafe-1.jpeg`, `empaque-cafe-2.jpeg` (960x1280), `finca-cosecha.jpg`
  (foto real del cafetal, 960x1280), `moviendo-cafe-1.mp4`, `proceso-frames/frame_001..120.jpg` (1280x720)

### Orden de secciones (`app/page.tsx`)
`Navbar` → `Process` → `Hero` → `Attributes` → `Story` → `Finca` → `Products` → `CupScore` → `CTA` → `Footer`

Nota: `Process` va **antes** del Hero — el sitio abre con la secuencia de scroll del
proceso del café y el Hero aparece después. Es intencional; no reordenar sin pedirlo.

## Paleta y tema (tailwind.config.ts)
- `rojo` #8B1A1A · `dorado` #C9A84C · `crema` #FDF6EC · `negro` #0F0A06 · `cafe` #3D1C02
- Fuentes: `font-playfair` (títulos), `font-inter` (cuerpo)
- Keyframes/animaciones custom: `float`, `shimmer`
- `darkMode: 'class'`

## Secciones y decisiones de diseño
- **Navbar** (`components/Navbar.tsx`): fijo, con **un solo estado visual** —
  `bg-crema/90 dark:bg-negro/90` + `backdrop-blur` + borde inferior, desde el primer
  fotograma. **No reacciona al scroll, y es a propósito**: antes era transparente arriba
  y sólido al bajar, pero como la primera sección es `Process` (fotogramas oscuros a
  pantalla completa) el estado transparente dejaba texto oscuro sobre imagen oscura —
  el header no se leía — y además saltaba de color al empezar a bajar. Por eso ya no
  hay estado `scrolled` ni listener de scroll en este componente.
  Si alguna vez se quiere volver al header transparente, hay que resolver primero el
  contraste sobre los fotogramas de `Process`.
  Menú móvil: se cierra al elegir un link, con `Escape` y al pasar a ≥768px.
  **No animar la altura de este panel.** Usaba `height: 0 -> auto` con `overflow-hidden`,
  que obliga a Framer Motion a medir la altura del contenido; dentro de este `<nav>`
  (`fixed` + `backdrop-blur`) la medición daba 0 y el menú abría colapsado, invisible.
  Ahora es un panel `fixed top-16` que anima solo `opacity` e `y`: no hay nada que medir.
  **Y va FUERA de `<motion.nav>`, como hermano.** Framer aplica un `transform` al nav
  para animar su entrada, y un ancestro con `transform` pasa a ser el bloque contenedor
  de sus descendientes `fixed`: el panel dejaba de anclarse al viewport y quedaba en la
  capa del nav, que en móvil no se recomponía hasta forzar un repintado (bajar al final
  de la página y volver a subir). No volver a anidarlo dentro del nav. El logo apunta a `#proceso` (el tope real de la página).
  Links: `#inicio`, `#historia`, `#productos`, `#proceso`, `#contacto`.
- **Process** (`components/Process.tsx`): sección de 400vh con panel `sticky` que dibuja
  una **secuencia de 120 imágenes en un `<canvas>`** según `useScroll`, no un `<video>`
  (un video "tartamudea" al saltar a un punto exacto por los fotogramas clave del códec).
  El panel sticky usa `h-screen supports-[height:100svh]:h-[100svh]`: con `100vh` a secas
  el panel es más alto que el área útil en móvil (100vh incluye la franja bajo la barra
  del navegador), la UI de abajo queda fuera de pantalla y al ocultarse/reaparecer esa
  barra se dispara un `resize` que limpia y redibuja el canvas — se ve como un salto.
  El dibujo del canvas se **agrupa con `requestAnimationFrame`** (máximo uno por
  fotograma de pantalla). Dibujar de forma síncrona en cada evento de scroll hacía que
  el compositor presentara la capa `sticky` a medio actualizar: mitad fotograma viejo,
  mitad nuevo, con una costura horizontal. El canvas además lleva `transform-gpu`
  para tener su propia capa. No volver a llamar `drawFrame` directo desde el scroll.
  Precarga todos los frames, muestra `Cargando N%`, escala tipo `object-fit: cover` con
  soporte retina (devicePixelRatio) y `FOCUS_X` para elegir el encuadre horizontal en
  móvil. Las etiquetas de etapa vienen de `LABELS` (umbral `at` sobre el progreso 0–1).
  **Las capas superpuestas están calibradas para no chocar** — al mover cualquiera hay
  que revisar el resto: encabezado `top-20 sm:top-24` (debe librar el navbar de 64px),
  etiqueta de etapa `bottom-28 sm:bottom-32`, pista "Sigue bajando" `bottom-14 sm:bottom-16`
  (mide ~34px de alto) y barra de progreso `bottom-8 sm:bottom-10`.
  Todo texto sobre los fotogramas lleva `drop-shadow` y el badge va con `inverted`.
- **Hero** (`components/Hero.tsx`): imagen estática del empaque con animación float +
  halo difuso, y `CoffeeParticles` — 22 partículas con posiciones **deterministas**
  (`(i * 37 + 13) % 97`, no `Math.random()`) para no romper la hidratación.
- **Attributes** (`components/Attributes.tsx`): banda roja con 4 stats. Contadores
  animados con `requestAnimationFrame` + ease-out cubic, disparados por `useInView`.
- **Story** (`components/Story.tsx`): video `moviendo-cafe-1.mp4` en loop
  (`autoPlay muted loop playsInline`) + texto de marca.
- **Finca** (`components/Finca.tsx`): la única sección con **fotografía real** del sitio.
  El resto del material visual (fotogramas de `Process`, empaques) es oscuro y
  cinematográfico; esta foto es clara, de luz de mediodía y tomada en la finca. Por eso
  vive en su propio bloque claro (`bg-white dark:bg-negro`) en vez de intercalarse con
  las secciones oscuras — mezclar los dos lenguajes visuales se ve inconsistente.
  Reglas para esta sección: **la foto es el sujeto, no una textura** — sin overlay,
  degradado ni filtro encima, y con `width`/`height` nativos + `h-auto` para que
  conserve su 3:4 y **no se recorte en ningún breakpoint**. El texto va a la izquierda
  a propósito, para no repetir la composición de `Story` (que ya lleva el medio visual
  a la izquierda). El texto se apoya en lo que la foto **prueba** (cerezas rojas, moradas
  y verdes en la misma rama → por eso la recolección es selectiva), así que si se cambia
  la foto hay que reescribir el texto. Tiene `id="finca"` pero **no** está en el navbar
  (pendiente: el menú no la enlaza).
- **Products** (`components/Products.tsx`): **dos** tarjetas — 1 Libra (500 g) y
  5 Libras (2.5 kg, marcada `isBestValue` con shimmer dorado). Cada tarjeta tiene su
  propio estado `grind` (Molido / En Grano) con `aria-pressed`, check en la opción
  activa, una línea de resumen ("Tu pedido: 1 Libra · Molido") y el texto del botón
  que refleja la elección. El mensaje de WhatsApp se arma con `size`, `weight` y
  `grind`, con asteriscos que WhatsApp renderiza como negrita:
  `Hola! Quiero pedir *1 Libra* de Rodys Coffee (500 g) en presentación *Molido*. ☕`
  No hay precios en el sitio.
- **CupScore** (`components/CupScore.tsx`): perfil sensorial con barras animadas
  (Dulzura, Acidez, Cuerpo, Aroma Caramelizado) y notas de taza. Usa `BRAND.cupscore`.
- **CTA** (`components/CTA.tsx`): fondo degradado con patrón de granos SVG (también
  determinista) y botón con pulse continuo.
- **WhatsApp**: todos los CTAs usan `buildWhatsAppUrl()` de `lib/config.ts`. El número
  real ya está configurado ahí — no es un placeholder.

## Convenciones
- `'use client'` en todo lo que use hooks o animación (casi todos los componentes;
  `layout.tsx`, `page.tsx` y `ui/SectionBadge.tsx` son server components)
- Comentarios en español, coherente con el resto del código existente
- Mobile-first: breakpoints `sm:` / `md:` / `lg:` de Tailwind, no media queries manuales
- Nada de `Math.random()` ni `Date.now()` en render — usar valores derivados del índice
  para que servidor y cliente coincidan
- Cada sección con ancla de navegación lleva su `id` (`#inicio`, `#historia`, etc.).
  El desfase bajo el navbar se resuelve una sola vez con `scroll-padding-top` en `html`,
  no con `scroll-mt` repetido en cada sección
- Cualquier elemento que se superponga a `Process` debe asumir **fondo oscuro**:
  texto `crema`/`dorado` con `drop-shadow`, y `SectionBadge` con `inverted` — la variante
  por defecto resuelve a `text-rojo` en tema claro y desaparece sobre la foto

## Trampas de móvil (ya resueltas — no reintroducir)
Tres bugs que **no se reproducen en el navegador de escritorio** y costaron varios
intentos. Cada uno está explicado en detalle en su sección; el resumen:

1. **Panel `fixed` dentro de un elemento animado por Framer** → deja de anclarse al
   viewport (un ancestro con `transform` pasa a ser su bloque contenedor) y su capa no
   se recompone hasta forzar un repintado. Síntoma: el menú solo aparecía tras bajar al
   final de la página y volver a subir.
2. **Animar `height: 0 -> auto`** en un contenedor con `overflow-hidden` dentro de un
   nav con `backdrop-blur` → la medición da 0 y el panel abre invisible.
3. **Dibujar en `<canvas>` de forma síncrona en cada evento de scroll**, dentro de un
   `sticky` → el compositor presenta la capa a medio actualizar y aparece una costura
   horizontal ("la pantalla partida en dos"). Se agrupa con `requestAnimationFrame`.

Regla general: al tocar `Navbar` o `Process`, **verificar en un móvil real**. El build
y `tsc` pasan igual con los tres bugs presentes.

## Pendientes / ideas para seguir
- Los frames de `public/proceso-frames/` pesan 7,5 MB; si la carga se vuelve un
  problema, considerar reducir a ~60 frames o servirlos en WebP
- Si se suman más fotos reales de finca, `Finca` pasa de foto única a galería: el
  layout de dos columnas habría que cambiarlo por un grid
- `Finca` tiene `id="finca"` pero el navbar no la enlaza: la sección es inalcanzable
  desde el menú. Agregar el link implica 6 entradas y hay que reducir el `gap` en escritorio
- `Process` rotula una etapa como "Cosecha selectiva, grano por grano" y `Finca` desarrolla
  la misma idea. Refuerzan, pero si molesta la repetición, cambiar el rótulo de `Process`
- Aplicar un tilt 3D ligero con CSS a las tarjetas de Products si se pide más interacción
- `next.config.js` está vacío — si se agregan imágenes remotas, configurar `images.remotePatterns`
