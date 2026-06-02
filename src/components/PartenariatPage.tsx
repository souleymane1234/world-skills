import { HeroVideo } from './HeroVideo'
import { PromoBanner } from './PromoBanner'
import { SectionBridge } from './SectionBridge'
import { PartnersTrustCarousel } from './PartnersTrustCarousel'
import './ConcoursPage.css'
import './PartenariatPage.css'

const PACKS = [
  {
    titre: 'Partenaire Bronze',
    points: ['Logo sur le site', 'Mention réseaux sociaux', 'Accès espace presse'],
  },
  {
    titre: 'Partenaire Argent',
    points: [
      'Pack Bronze +',
      'Stand village partenaires (LTA)',
      'Visibilité pendant les épreuves',
    ],
  },
  {
    titre: 'Partenaire Or',
    points: [
      'Pack Argent +',
      'Naming discipline ou segment',
      'Accompagnement des lauréats',
    ],
  },
] as const

export function PartenariatPage() {
  return (
    <main className="concours-page" aria-labelledby="partenariat-title">
      <HeroVideo
        subtitle="Engagement entreprises & institutions"
        title="Soutenez l'excellence technique"
      />
      <PromoBanner
        title="Investissez dans les métiers de demain"
        subtitle="CIE, secteur privé, ONG : rejoignez WorldSkills Côte d'Ivoire"
        ctaHref="#contact"
        ctaLabel="Nous contacter"
      />
      <SectionBridge variant="ribbon" />

      <section id="partenaires" className="concours-page__stack">
        <section className="concours-page__section concours-page__hero">
          <div className="concours-page__inner">
            <p className="concours-page__eyebrow">Partenariat</p>
            <h1 id="partenariat-title">Associez-vous aux Olympiades des métiers</h1>
            <p className="concours-page__lead">
              Visibilité nationale, impact sur la formation professionnelle et
              accès aux talents techniques : WorldSkills Côte d&apos;Ivoire offre
              un cadre structuré pour les entreprises et institutions engagées.
            </p>
            <div className="concours-page__actions">
              <a href="/#contact" className="partenariat-page__cta-link">
                Nous contacter
              </a>
              <a href="/competition">Découvrir la compétition</a>
            </div>
          </div>
        </section>

        <SectionBridge variant="wave" />
        <PartnersTrustCarousel />
        <SectionBridge variant="ribbon" />

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <h2>Packs partenaires</h2>
            <div className="partenariat-page__packs">
              {PACKS.map((pack) => (
                <article key={pack.titre} className="partenariat-page__pack">
                  <h3>{pack.titre}</h3>
                  <ul>
                    {pack.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <a className="concours-page__inline-link" href="/#contact">
              Demander une proposition sur mesure
            </a>
          </div>
        </section>
      </section>
    </main>
  )
}
