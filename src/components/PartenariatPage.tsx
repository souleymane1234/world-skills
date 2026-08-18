import { useEffect } from 'react'
import { ContactSection } from './ContactSection'
import { SectionBridge } from './SectionBridge'
import { PartnersTrustCarousel } from './PartnersTrustCarousel'
import './ConcoursPage.css'
import './PartenariatPage.css'

const PARTNERSHIP_CATEGORIES = [
  {
    title: 'Partenaire strategique',
    subtitle: "Partenaire global de l'evenement et de son rayonnement.",
    tone: 'green',
    icon: 'badge',
  },
  {
    title: 'Partenaire challenge',
    subtitle: "Porteur d'un challenge metier et co-createur de solutions.",
    tone: 'orange',
    icon: 'star',
  },
  {
    title: 'Partenaire metier',
    subtitle: 'Soutien specifique a un ou plusieurs metiers en competition.',
    tone: 'blue',
    icon: 'tool',
  },
  {
    title: 'Partenaire innovation & technologie',
    subtitle: 'Fournisseur de technologies et de solutions innovantes.',
    tone: 'green',
    icon: 'laptop',
  },
  {
    title: 'Partenaire formation & expertise',
    subtitle: 'Renforcement des competences et accompagnement des talents.',
    tone: 'orange',
    icon: 'cap',
  },
  {
    title: 'Partenaire impact & institutionnel',
    subtitle: "Engagement pour l'impact jeunesse, l'inclusion et le developpement.",
    tone: 'blue',
    icon: 'users',
  },
] as const

const WHY_PARTNER_POINTS = [
  {
    title: 'Une visibilite a 360°',
    text: 'Medias, digital, reseaux sociaux, affichage, relations publiques, presence sur site et plus.',
    tone: 'green',
    icon: 'megaphone',
  },
  {
    title: 'Un impact durable',
    text: "Votre soutien contribue a la formation, a l'employabilite et a l'excellence des jeunes ivoiriens.",
    tone: 'orange',
    icon: 'target',
  },
  {
    title: "Un reseau d'influence",
    text: 'Rencontrez des decideurs, entrepreneurs, institutions et acteurs cles du secteur public et prive.',
    tone: 'blue',
    icon: 'network',
  },
] as const

function CategoryIcon({ kind }: { kind: (typeof PARTNERSHIP_CATEGORIES)[number]['icon'] }) {
  switch (kind) {
    case 'badge':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="3" />
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 4 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8Z" />
        </svg>
      )
    case 'tool':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m14.8 4.6 4.6 4.6-2 2-4.6-4.6M3.8 20.2l6-6 3.3 3.3-6 6H3.8Z" />
          <path d="m11.6 7.8-5 5" />
        </svg>
      )
    case 'laptop':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="6" width="14" height="9" rx="1.6" />
          <path d="M3.5 18h17" />
        </svg>
      )
    case 'cap':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m4 10 8-4 8 4-8 4-8-4Z" />
          <path d="M8 12.2v3.3c0 1.4 1.8 2.5 4 2.5s4-1.1 4-2.5v-3.3" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="9" cy="10" r="2.3" />
          <circle cx="15.5" cy="10" r="2.3" />
          <path d="M5.5 18a3.8 3.8 0 0 1 3.8-3.8h5.4a3.8 3.8 0 0 1 3.8 3.8" />
        </svg>
      )
  }
}

function ReasonIcon({ kind }: { kind: (typeof WHY_PARTNER_POINTS)[number]['icon'] }) {
  switch (kind) {
    case 'megaphone':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11.2V8.6A1.6 1.6 0 0 1 5.6 7h3l7.6-3.2a1 1 0 0 1 1.4.9v13.2a1 1 0 0 1-1.4.9l-7.6-3.2h-3A1.6 1.6 0 0 1 4 14v-2.8Z" />
        </svg>
      )
    case 'target':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="7.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="8.5" cy="9.5" r="2.2" />
          <circle cx="15.5" cy="9.5" r="2.2" />
          <path d="M4.8 18a3.7 3.7 0 0 1 3.7-3.7h7a3.7 3.7 0 0 1 3.7 3.7" />
        </svg>
      )
  }
}

export function PartenariatPage() {
  useEffect(() => {
    if (window.location.hash !== '#contact') return
    const el = document.getElementById('contact')
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  return (
    <main className="concours-page concours-page--nav-offset partenariat-page" aria-labelledby="partenariat-title">
      <section id="partenaires" className="concours-page__stack">
        <section className="concours-page__section concours-page__hero">
          <div className="concours-page__inner partenariat-page__hero-card">
            <p className="concours-page__eyebrow">Partenariat</p>
            <h1 id="partenariat-title">Associez-vous aux Olympiades des métiers</h1>
            <div className="concours-page__actions">
              <a href="#contact" className="partenariat-page__cta-link">
                Nous contacter
              </a>
              <a href="/competition" className="partenariat-page__cta-secondary">Voir la compétition</a>
            </div>
          </div>
        </section>

        <section className="concours-page__section">
          <div className="concours-page__inner partenariat-page__card partenariat-page__categories">
            <h2>Nos catégories de partenariat</h2>
            <div className="partenariat-page__categories-grid">
              {PARTNERSHIP_CATEGORIES.map((category) => (
                <article
                  key={category.title}
                  className={`partenariat-page__category-card partenariat-page__category-card--${category.tone}`}
                >
                  <span className="partenariat-page__category-icon" aria-hidden="true">
                    <CategoryIcon kind={category.icon} />
                  </span>
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge variant="wave" />

        <section className="concours-page__section">
          <div className="concours-page__inner partenariat-page__why-layout">
            <article className="partenariat-page__card partenariat-page__why-card">
              <h2>Pourquoi devenir partenaire de Côte d&apos;Ivoire Skills 2026 ?</h2>
              <div className="partenariat-page__reasons-grid">
                {WHY_PARTNER_POINTS.map((reason) => (
                  <div key={reason.title} className={`partenariat-page__reason partenariat-page__reason--${reason.tone}`}>
                    <span aria-hidden="true" className="partenariat-page__reason-icon">
                      <ReasonIcon kind={reason.icon} />
                    </span>
                    <h3>{reason.title}</h3>
                    <p>{reason.text}</p>
                  </div>
                ))}
              </div>
            </article>

            <aside className="partenariat-page__contact-cta">
              <h2>Intéressé par un partenariat ?</h2>
              <p>
                Contactez notre équipe pour discuter d&apos;un partenariat adapté à vos
                objectifs et à votre impact.
              </p>
              <a className="partenariat-page__cta-link" href="#contact">
                Nous contacter
              </a>
            </aside>
          </div>
        </section>

        <SectionBridge variant="wave" />
        <ContactSection embedded />
        <SectionBridge variant="wave" />
        <PartnersTrustCarousel />
      </section>
    </main>
  )
}
