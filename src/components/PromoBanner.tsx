import { useRevealOnView } from '../hooks/useRevealOnView'
import './PromoBanner.css'

type PromoBannerProps = {
  title?: string
  subtitle?: string
  ctaHref?: string
  ctaLabel?: string
  ctaOnClick?: () => void
}

export function PromoBanner({
  title = 'FORMATION – INNOVATION – EMPLOYABILITE DES JEUNES',
  subtitle = 'Finale nationale · 02—04 octobre 2026 · Parc des Expositions d\'Abidjan',
  ctaHref = '/competition',
  ctaLabel = 'Découvrir le programme',
  ctaOnClick,
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
        {ctaOnClick ? (
          <button
            type="button"
            className="site-promo-banner__cta site-promo-banner__cta--button"
            onClick={ctaOnClick}
          >
            {ctaLabel}
          </button>
        ) : (
          <a className="site-promo-banner__cta" href={ctaHref}>
            {ctaLabel}
          </a>
        )}
      </div>
    </div>
  )
}
