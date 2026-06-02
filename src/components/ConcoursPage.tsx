import { HeroVideo } from './HeroVideo'
import { PromoBanner } from './PromoBanner'
import { SectionBridge } from './SectionBridge'
import { PartnersTrustCarousel } from './PartnersTrustCarousel'
import './ConcoursPage.css'

const ETAPES = [
  {
    titre: 'Présélections régionales',
    periode: 'Octobre — Novembre',
    details:
      'Abidjan, Bouaké, Gagnoa et Korhogo : les apprenants s\'affrontent par discipline.',
  },
  {
    titre: 'Sélection nationale',
    periode: 'Avant la finale',
    details:
      'Validation des dossiers par la Direction de la Vie scolaire (DVS) — METFPA.',
  },
  {
    titre: 'Finale nationale',
    periode: '26 — 29 novembre 2025',
    details:
      'Quatre jours de compétition au Lycée technique d\'Abidjan-Cocody (LTA).',
  },
  {
    titre: 'Suite internationale',
    periode: 'Selon calendrier WorldSkills',
    details:
      'Les lauréats peuvent représenter la Côte d\'Ivoire lors des compétitions mondiales.',
  },
] as const

const CRITERES = [
  'Être apprenant d\'un établissement de formation professionnelle agréé.',
  'Avoir entre 15 et 23 ans (règlement WorldSkills International).',
  'Être sélectionné via les présélections régionales officielles.',
  'Maîtriser la discipline inscrite et respecter le règlement technique.',
] as const

const FAQ = [
  {
    question: 'Comment un établissement inscrit-il ses compétiteurs ?',
    reponse:
      'Via la Direction de la Vie scolaire du METFPA, après les présélections régionales organisées dans chaque zone.',
  },
  {
    question: 'Où se déroule la finale nationale ?',
    reponse:
      'Au Lycée technique d\'Abidjan-Cocody (LTA), lieu habituel des phases finales WorldSkills Côte d\'Ivoire.',
  },
  {
    question: 'Comment devenir partenaire ou sponsor ?',
    reponse:
      'Consultez la page Partenariat ou contactez la DVS pour les packs de visibilité et d\'engagement.',
  },
] as const

export function ConcoursPage() {
  return (
    <main className="concours-page" aria-labelledby="competition-title">
      <HeroVideo
        subtitle="Olympiades des métiers 2026"
        title="FORMATION – INNOVATION – EMPLOYABILITE DES JEUNES"
      />
      <PromoBanner />
      <SectionBridge variant="ribbon" />

      <section id="competition" className="concours-page__stack">
        <section className="concours-page__section concours-page__hero">
          <div className="concours-page__inner">
            <p className="concours-page__eyebrow">Compétition</p>
            <h1 id="competition-title">WorldSkills Côte d&apos;Ivoire 2026</h1>
            <p className="concours-page__lead">
              6ᵉ édition des Olympiades des métiers : 25 disciplines, 1500+
              compétiteurs et 300 finalistes et exposants. Un rendez-vous national
              autour du thème « FORMATION – INNOVATION – EMPLOYABILITE DES JEUNES ».
            </p>
            <div className="concours-page__actions">
              <a href="/metiers" className="concours-page__btn-primary">
                Voir les disciplines
              </a>
              <a href="/edition">Édition 2026</a>
            </div>
          </div>
        </section>

        <SectionBridge variant="wave" />

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <h2>Calendrier de la compétition</h2>
            <div className="concours-page__timeline">
              {ETAPES.map((etape) => (
                <article key={etape.titre} className="concours-page__step">
                  <p className="concours-page__step-date">{etape.periode}</p>
                  <h3>{etape.titre}</h3>
                  <p>{etape.details}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge variant="ribbon" />

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <h2>Conditions de participation</h2>
            <ul className="concours-page__list">
              {CRITERES.map((critere) => (
                <li key={critere}>{critere}</li>
              ))}
            </ul>
          </div>
        </section>

        <SectionBridge variant="wave" />

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <h2>Partenaires de l&apos;édition</h2>
            <PartnersTrustCarousel />
            <p>
              Entreprises, institutions et opérateurs techniques accompagnent la
              montée en compétences des jeunes Ivoiriens.
            </p>
            <a className="concours-page__inline-link" href="/partenariat">
              Devenir partenaire
            </a>
          </div>
        </section>

        <SectionBridge variant="ribbon" />

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <h2>Questions fréquentes</h2>
            <div className="concours-page__faq">
              {FAQ.map((item) => (
                <article key={item.question} className="concours-page__faq-item">
                  <h3>{item.question}</h3>
                  <p>{item.reponse}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
