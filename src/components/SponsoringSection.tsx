import './SponsoringSection.css'

const SPONSORING_OPTIONS = [
  {
    id: 'sponsorisez-evenement',
    icon: 'megaphone',
    title: "Sponsorisez l'evenement",
    description:
      "Associez votre marque a un evenement d'envergure nationale et beneficiez d'une visibilite exceptionnelle.",
    points: [
      'Visibilite institutionnelle maximale',
      'Presence sur tous les supports de communication',
      'Acces privilegie aux decideurs et talents',
    ],
    tone: 'green',
  },
  {
    id: 'portez-challenge',
    icon: 'idea',
    title: 'Portez un challenge',
    description:
      "Soumettez une problematique reelle a resoudre par les jeunes talents et accelerez l'innovation.",
    points: [
      'Naming de votre challenge',
      'Jury et mentors dedies',
      'Solutions innovantes pour vos enjeux',
      'Acces aux meilleurs talents',
    ],
    tone: 'orange',
  },
  {
    id: 'adoptez-metier',
    icon: 'gear',
    title: 'Adoptez un metier',
    description:
      "Soutenez un ou plusieurs metiers en equipant et accompagnant les conditions de competition.",
    points: [
      'Association directe a un metier',
      "Visibilite sur l'espace de competition",
      'Mise en avant de votre expertise',
    ],
    tone: 'blue',
  },
  {
    id: 'investissez-talents',
    icon: 'users',
    title: 'Investissez dans les talents',
    description:
      "Contribuez a la formation, a la preparation et a l'insertion des jeunes competiteurs.",
    points: [
      'Soutien a la preparation et a la formation',
      'Prix et recompenses',
      'Accompagnement post-competition',
      'Impact social et employabilite',
    ],
    tone: 'gold',
  },
] as const

function SponsoringIcon({ kind }: { kind: (typeof SPONSORING_OPTIONS)[number]['icon'] }) {
  if (kind === 'megaphone') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 11.5V8.8a1.8 1.8 0 0 1 1.8-1.8h3.4l8-3.4a1 1 0 0 1 1.4.9v14a1 1 0 0 1-1.4.9l-8-3.4H4.8A1.8 1.8 0 0 1 3 14.2v-2.7Z" />
        <path d="m8.8 15.8 1.1 3.1a1.7 1.7 0 0 0 1.6 1.1h.8" />
      </svg>
    )
  }

  if (kind === 'idea') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.2a5.8 5.8 0 0 0-3.8 10.1c.9.8 1.5 1.9 1.5 3h4.6c0-1.1.5-2.2 1.4-3A5.8 5.8 0 0 0 12 4.2Z" />
        <path d="M9.6 19.2h4.8M10.4 21h3.2" />
      </svg>
    )
  }

  if (kind === 'gear') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3.5 1 .4.5 1.8 1.7.7 1.5-1 .9.7-.4 1.8 1.3 1.3 1.8-.4.7.9-1 1.5.7 1.7 1.8.5.4 1-1.7 1-.7 1.7 1 1.5-.7.9-1.8-.4-1.3 1.3.4 1.8-.9.7-1.5-1-1.7.7-.5 1.8-1 .4-1-.4-.5-1.8-1.7-.7-1.5 1-.9-.7.4-1.8-1.3-1.3-1.8.4-.7-.9 1-1.5-.7-1.7-1.8-.5-.4-1 1.8-.5.7-1.7-1-1.5.7-.9 1.8.4 1.3-1.3-.4-1.8.9-.7 1.5 1 1.7-.7.5-1.8 1-.4Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="10" r="2.4" />
      <circle cx="16" cy="10" r="2.4" />
      <path d="M4.8 18.2a4.2 4.2 0 0 1 4.2-4.2h6a4.2 4.2 0 0 1 4.2 4.2" />
    </svg>
  )
}

export function SponsoringSection() {
  return (
    <section className="sponsoring-section" aria-labelledby="sponsoring-section-title">
      <div className="sponsoring-section__inner">
        <header className="sponsoring-section__header">
          <p className="sponsoring-section__eyebrow">Sponsoring</p>
          <h2 id="sponsoring-section-title" className="sponsoring-section__title">
            Devenez acteur de Cote d&apos;Ivoire Skills 2026
          </h2>
          <p className="sponsoring-section__lead">
            Associez votre marque a la plus grande competition des metiers en Cote d&apos;Ivoire et
            contribuez a former, valoriser et propulser les talents de demain.
          </p>
          <h3 className="sponsoring-section__subtitle">Choisissez votre maniere de vous engager</h3>
        </header>

        <div className="sponsoring-section__grid">
          {SPONSORING_OPTIONS.map((item) => (
            <article key={item.id} className={`sponsoring-card sponsoring-card--${item.tone}`}>
              <div className="sponsoring-card__head">
                <span className="sponsoring-card__icon" aria-hidden="true">
                  <SponsoringIcon kind={item.icon} />
                </span>
                <h4>{item.title}</h4>
              </div>

              <p className="sponsoring-card__description">{item.description}</p>

              <ul className="sponsoring-card__list">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <a href="/partenariat" className="sponsoring-card__link">
                En savoir plus <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
