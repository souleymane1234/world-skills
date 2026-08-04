import { useEffect } from 'react'
import { ContactSection } from './ContactSection'
import { PromoBanner } from './PromoBanner'
import { SectionBridge } from './SectionBridge'
import { PartnersTrustCarousel } from './PartnersTrustCarousel'
import './ConcoursPage.css'
import './PartenariatPage.css'

const PACKS = [
  {
    titre: 'Partenaire Bronze',
    resume: 'Visibilité institutionnelle et premier niveau d’engagement.',
    points: [
      'Visibilité institutionnelle et médiatique',
      'Présence dans les supports officiels de communication',
      'Valorisation de l’image citoyenne de l’entreprise',
      'Appui matériel et logistique (consommables / supports de démonstration)',
    ],
  },
  {
    titre: 'Partenaire Argent',
    resume: 'Accompagnement technique + impact direct sur la formation.',
    points: [
      'Pack Bronze +',
      'Mise à disposition d’experts',
      'Encadrement technique des candidats',
      'Participation aux jurys et évaluations',
      'Espace d’exposition (stand + branding) au Parc des Expositions',
    ],
  },
  {
    titre: 'Partenaire Or',
    resume: 'Partenaire stratégique de l’excellence et de l’insertion.',
    points: [
      'Pack Argent +',
      'Appui financier ou sponsoring des activités et compétitions',
      'Soutien à la remise des prix',
      'Opportunités de stages et recrutement de jeunes talents',
      'Positionnement comme acteur du développement des compétences en Côte d’Ivoire',
    ],
  },
] as const

const OBJECTIF_GENERAL =
  'Mobiliser les entreprises de production autour du développement des compétences techniques et professionnelles des jeunes afin de renforcer l’employabilité, l’innovation et la compétitivité de la Côte d’Ivoire.'

const OBJECTIFS_SPECIFIQUES = [
  'Renforcer les liens entre les entreprises et les établissements de formation.',
  'Promouvoir les standards internationaux de compétences professionnelles.',
  'Offrir aux jeunes une formation pratique adaptée aux réalités industrielles.',
  'Valoriser les métiers techniques et industriels.',
  'Identifier et accompagner les jeunes talents.',
  'Encourager l’innovation et l’excellence professionnelle.',
  'Permettre aux entreprises de contribuer à la formation de futurs techniciens qualifiés.',
] as const

const CONTEXTE_JUSTIFICATION =
  'Dans le cadre de la promotion de l’excellence professionnelle, de l’employabilité des jeunes et du rapprochement entre l’école et l’industrie, le Comité d’Organisation des Olympiades des Métiers 2026 organise la 6ème édition des Olympiades des Métiers de Côte d’Ivoire, inspirée des standards internationaux de WorldSkills International.'

const CONTEXTE_POINTS = [
  'Renforcer les compétences techniques des jeunes apprenants.',
  'Valoriser les métiers professionnels.',
  'Favoriser l’implication des entreprises de production dans la formation pratique et l’insertion professionnelle.',
] as const

const ACTEURS_PLATEFORME = [
  'Les entreprises de production.',
  'Les établissements de formation technique et professionnelle.',
  'Les institutions publiques.',
  'Les professionnels des métiers.',
  'Les experts nationaux et internationaux.',
] as const

const IMPORTANCE_PARTENARIAT = [
  'Le développement des compétences',
  'L’amélioration de la qualité des formations',
  'L’adaptation des programmes aux besoins du marché',
  'L’insertion professionnelle des jeunes',
  'Le rapprochement de l’école et du monde professionnel',
  'La promotion des innovations technologiques',
  'La détection de futurs collaborateurs qualifiés',
  'L’amélioration de la compétitivité industrielle nationale',
] as const

const CONTRIBUTIONS = {
  technique: [
    'Mise à disposition d’experts',
    'Encadrement technique des candidats',
    'Participation aux jurys et évaluations',
  ],
  materiel: [
    'Équipements techniques',
    'Consommables',
    'Matériels industriels',
    'Supports de démonstration',
  ],
  financier: [
    'Financement d’activités',
    'Accompagnement des compétitions',
    'Soutien à la remise des prix',
  ],
  insertion: [
    'Opportunités de stages',
    'Recrutement de jeunes talents',
    'Visites d’entreprises',
  ],
} as const

const AVANTAGES_PARTENAIRE = [
  'Visibilité institutionnelle et médiatique',
  'Espace d’exposition (stand + branding) au Parc des Expositions',
  'Valorisation de l’image citoyenne',
  'Accès privilégié aux meilleurs talents',
  'Présence dans les supports officiels de communication',
  'Positionnement comme acteur du développement des compétences en Côte d’Ivoire',
] as const

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
      <PromoBanner
        title="Investissez dans les métiers de demain"
        subtitle="Secteur privé, ONG : rejoignez WorldSkills Côte d'Ivoire"
        ctaHref="#contact"
        ctaLabel="Nous contacter"
      />
      <SectionBridge variant="ribbon" />

      <section id="partenaires" className="concours-page__stack">
        <section className="concours-page__section concours-page__hero">
          <div className="concours-page__inner partenariat-page__hero-card">
            <p className="concours-page__eyebrow">Partenariat</p>
            <h1 id="partenariat-title">Associez-vous aux Olympiades des métiers</h1>
            <p className="concours-page__lead">
              Visibilité nationale, impact sur la formation professionnelle et
              accès aux talents techniques : WorldSkills Côte d&apos;Ivoire offre
              un cadre structuré pour les entreprises et institutions engagées.
            </p>
            <div className="concours-page__actions">
              <a href="#contact" className="partenariat-page__cta-link">
                Nous contacter
              </a>
              <a href="/competition" className="partenariat-page__cta-secondary">Voir la compétition</a>
            </div>
          </div>
        </section>

        <section className="concours-page__section">
          <div className="concours-page__inner partenariat-page__grid">
            <article className="partenariat-page__card">
              <h2>Contexte et justification</h2>
              <p>{CONTEXTE_JUSTIFICATION}</p>
              <ul className="partenariat-page__list">
                {CONTEXTE_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>

            <article className="partenariat-page__card">
              <h2>Acteurs de la plateforme</h2>
              <p>
                Les Olympiades des Métiers 2026 constituent une plateforme stratégique
                de collaboration entre :
              </p>
              <ul className="partenariat-page__list">
                {ACTEURS_PLATEFORME.map((acteur) => (
                  <li key={acteur}>{acteur}</li>
                ))}
              </ul>
              <p className="partenariat-page__muted">
                Le Comité d’Organisation souhaite associer les entreprises en qualité de
                partenaires techniques et institutionnels.
              </p>
            </article>
          </div>
        </section>

        <SectionBridge variant="wave" />

        <section className="concours-page__section">
          <div className="concours-page__inner partenariat-page__objective-card">
            <h2>Objectif général du partenariat</h2>
            <p>{OBJECTIF_GENERAL}</p>
          </div>
        </section>

        <SectionBridge variant="wave" />

        <section className="concours-page__section">
          <div className="concours-page__inner partenariat-page__card">
            <h2>Objectifs spécifiques</h2>
            <ul className="partenariat-page__list partenariat-page__list--two-cols">
              {OBJECTIFS_SPECIFIQUES.map((objectif) => (
                <li key={objectif}>{objectif}</li>
              ))}
            </ul>
          </div>
        </section>

        <SectionBridge variant="wave" />

        <section className="concours-page__section">
          <div className="concours-page__inner partenariat-page__grid">
            <article className="partenariat-page__card">
              <h2>Importance du partenariat avec les entreprises de production</h2>
              <ul className="partenariat-page__list">
                {IMPORTANCE_PARTENARIAT.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="partenariat-page__card">
              <h2>Avantages pour l’entreprise partenaire</h2>
              <ul className="partenariat-page__list">
                {AVANTAGES_PARTENAIRE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <SectionBridge variant="wave" />

        <section className="concours-page__section">
          <div className="concours-page__inner partenariat-page__card">
            <h2>Contributions attendues de l’entreprise partenaire</h2>
            <div className="partenariat-page__packs">
              <article className="partenariat-page__pack">
                <h3>Appui technique</h3>
                <ul className="partenariat-page__list">
                  {CONTRIBUTIONS.technique.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="partenariat-page__pack">
                <h3>Appui matériel et logistique</h3>
                <ul className="partenariat-page__list">
                  {CONTRIBUTIONS.materiel.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="partenariat-page__pack">
                <h3>Appui financier / sponsoring</h3>
                <ul className="partenariat-page__list">
                  {CONTRIBUTIONS.financier.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
            <ul className="partenariat-page__list partenariat-page__list--spaced">
              {CONTRIBUTIONS.insertion.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <h2>Packs partenaires</h2>
            <div className="partenariat-page__packs">
              {PACKS.map((pack) => (
                <article key={pack.titre} className="partenariat-page__pack">
                  <h3>{pack.titre}</h3>
                  <p className="partenariat-page__muted">{pack.resume}</p>
                  <ul className="partenariat-page__list">
                    {pack.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="partenariat-page__footer-cta">
              <a className="partenariat-page__cta-link" href="#contact">
                Demander une proposition sur mesure
              </a>
            </div>
          </div>
        </section>

        <SectionBridge variant="wave" />
        <PartnersTrustCarousel />
        <SectionBridge variant="ribbon" />
        <ContactSection embedded />
      </section>
    </main>
  )
}
