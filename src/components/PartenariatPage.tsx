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

const ENGAGEMENT_OPTIONS = [
  {
    title: 'SPONSORISEZ L\u2019EVENEMENT',
    description: 'Associez votre marque a un evenement d\u2019envergure nationale et beneficiez d\u2019une visibilite exceptionnelle.',
    points: [
      'Visibilite institutionnelle maximale',
      'Presence sur tous les supports de communication',
      'Acces privilegie aux decideurs et talents',
    ],
    tone: 'green' as const,
    icon: 'sponsor' as const,
  },
  {
    title: 'PORTEZ UN CHALLENGE',
    description: 'Soumettez une problematique reelle a resoudre par les jeunes talents et accelerez l\u2019innovation.',
    points: [
      'Naming de votre challenge',
      'Jury et mentors dedies',
      'Solutions innovantes pour vos enjeux',
      'Acces aux meilleurs talents',
    ],
    tone: 'orange' as const,
    icon: 'challenge' as const,
  },
  {
    title: 'ADOPTEZ UN METIER',
    description: 'Soutenez un ou plusieurs metiers en equipant et accompagnant les conditions de competition.',
    points: [
      'Association directe a un metier',
      'Visibilite sur l\u2019espace de competition',
      'Mise en avant de votre expertise',
    ],
    tone: 'blue' as const,
    icon: 'metier' as const,
  },
  {
    title: 'INVESTISSEZ DANS LES TALENTS',
    description: 'Contribuez a la formation, a la preparation et a l\u2019insertion des jeunes competiteurs.',
    points: [
      'Soutien a la preparation et a la formation',
      'Prix et recompenses',
      'Accompagnement post-competition',
      'Impact social et employabilite',
    ],
    tone: 'accent' as const,
    icon: 'talent' as const,
  },
] as const

function EngagementIcon({ kind }: { kind: (typeof ENGAGEMENT_OPTIONS)[number]['icon'] }) {
  switch (kind) {
    case 'sponsor':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l2.4 7.2H22l-6 4.5 2.3 7.3L12 16.5 5.7 21l2.3-7.3-6-4.5h7.6Z" />
        </svg>
      )
    case 'challenge':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13 3v7h6l-8 11v-7H5l8-11Z" />
        </svg>
      )
    case 'metier':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
  }
}

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
          <div className="concours-page__inner partenariat-page__engagement">
            <header className="partenariat-page__sponsoring-intro">
              <p className="partenariat-page__sponsoring-eyebrow">Sponsoring</p>
              <h2 className="partenariat-page__sponsoring-title">
                Devenez acteur de Côte d&apos;Ivoire Skills 2026
              </h2>
              <p className="partenariat-page__sponsoring-lead">
                Associez votre marque à la plus grande compétition des métiers en Côte
                d&apos;Ivoire et contribuez à former, valoriser et propulser les talents
                de demain.
              </p>
            </header>
            <h3 className="partenariat-page__engagement-title">
              Choisissez votre manière de vous engager
            </h3>
            <div className="partenariat-page__engagement-grid">
              {ENGAGEMENT_OPTIONS.map((option) => (
                <article
                  key={option.title}
                  className={`partenariat-page__engagement-card partenariat-page__engagement-card--${option.tone}`}
                >
                  <span className="partenariat-page__engagement-icon" aria-hidden="true">
                    <EngagementIcon kind={option.icon} />
                  </span>
                  <h3>{option.title}</h3>
                  <p className="partenariat-page__engagement-desc">{option.description}</p>
                  <ul className="partenariat-page__engagement-points">
                    {option.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <a href="#contact" className="partenariat-page__engagement-link">
                    En savoir plus →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge variant="wave" />

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
