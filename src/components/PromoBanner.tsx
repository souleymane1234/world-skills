import { useRevealOnView } from '../hooks/useRevealOnView'
import './PromoBanner.css'

type PromoBannerProps = {
  title?: string
  subtitle?: string
  ctaHref?: string
  ctaLabel?: string
}

export function PromoBanner({
  title = 'FORMATION – INNOVATION – EMPLOYABILITE DES JEUNES',
  subtitle = 'Finale nationale · 26—29 novembre 2025 · Lycée technique d\'Abidjan-Cocody',
  ctaHref = '/competition',
  ctaLabel = 'Découvrir le programme',
}: PromoBannerProps) {
  const { ref, isVisible } = useRevealOnView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`site-promo-banner site-promo-banner--ws${isVisible ? ' site-promo-banner--reveal' : ''}`}
      role="region"
      aria-label="Événement à venir"
    >
      <div className="site-promo-banner__content">
        <p className="site-promo-banner__subtitle">{subtitle}</p>
        <h2 className="site-promo-banner__title">{title}</h2>
        <a className="site-promo-banner__cta" href={ctaHref}>
          {ctaLabel}
        </a>
      </div>
    </div>
  )
}
