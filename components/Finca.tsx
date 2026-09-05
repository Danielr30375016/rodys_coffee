'use client'

import Image from 'next/image'
import FadeIn from './FadeIn'
import { SectionBadge } from '@/components/ui/SectionBadge'
import { BRAND } from '@/lib/config'

/**
 * Sección "Nuestra Finca" — fotografía REAL del cafetal, a diferencia del resto
 * de la imaginería del sitio (los fotogramas de `Process` y los empaques son
 * material oscuro y cinematográfico).
 *
 * Por eso vive en su propio bloque claro en vez de intercalarse con las
 * secciones oscuras: son dos lenguajes visuales distintos y mezclarlos se ve
 * inconsistente. Aquí la foto es el sujeto, no una textura de fondo — no lleva
 * overlay, degradado ni filtro encima, y se muestra en su relación de aspecto
 * nativa (3:4) sin recortes.
 *
 * El texto se apoya en lo que la foto realmente prueba: en la misma rama hay
 * cerezas rojas, moradas y verdes, que es exactamente por lo que la recolección
 * tiene que ser selectiva. Si se cambia la foto, hay que revisar este texto.
 */

const DATOS = [
  { valor: BRAND.altitude,  etiqueta: 'Sobre el nivel del mar' },
  { valor: 'Grano a grano', etiqueta: 'Recolección selectiva' },
  { valor: BRAND.variety.replace('Variedad ', ''), etiqueta: 'Variedad' },
]

export default function Finca() {
  return (
    <section id="finca" className="py-20 lg:py-28 bg-white dark:bg-negro">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Texto ──
              Va a la izquierda para no repetir la composición de Story,
              que ya tiene el medio visual a la izquierda. */}
          <FadeIn direction="right">
            <SectionBadge>Nuestra Finca</SectionBadge>

            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold
              text-negro dark:text-crema mb-6 leading-tight">
              Solo bajamos el grano en su punto
            </h2>

            <div className="space-y-4 text-negro/70 dark:text-crema/70 leading-relaxed text-base sm:text-lg">
              <p>
                Esta es nuestra finca en {BRAND.origin}, sin filtros ni montajes.
                Mira la rama: en la misma planta conviven cerezas rojas en su punto,
                moradas ya pasadas y verdes que todavía les falta.
              </p>
              <p>
                Por eso la recolección es selectiva, grano por grano, y hay que volver
                sobre la misma planta varias veces en la cosecha. Es más lento que
                recoger la rama entera, y es lo que sostiene los {BRAND.cupscore} puntos
                de taza.
              </p>
            </div>

            {/* Datos de origen */}
            <dl className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-negro/10 dark:border-crema/10">
              {DATOS.map((dato) => (
                <div key={dato.etiqueta}>
                  <dt className="font-playfair text-xl sm:text-2xl font-bold text-rojo dark:text-dorado">
                    {dato.valor}
                  </dt>
                  <dd className="text-negro/50 dark:text-crema/50 text-xs sm:text-sm leading-snug mt-1">
                    {dato.etiqueta}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          {/* ── Foto ──
              width/height reales (960x1280) + `h-auto`: la imagen conserva su
              proporción nativa y NUNCA se recorta, en ningún breakpoint. */}
          <FadeIn direction="left" delay={0.15}>
            <figure className="relative">
              <Image
                src="/finca-cosecha.jpg"
                alt="Ramas de café en la finca de Anolaima con cerezas rojas maduras, moradas sobremaduras y verdes sin madurar"
                width={960}
                height={1280}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto rounded-2xl shadow-2xl shadow-negro/20
                  ring-1 ring-negro/10 dark:ring-crema/10"
              />
              <figcaption className="mt-4 text-center text-negro/45 dark:text-crema/45 text-xs sm:text-sm">
                Cafetal en cosecha · {BRAND.origin}
              </figcaption>
            </figure>
          </FadeIn>

        </div>
      </div>
    </section>
  )
}
