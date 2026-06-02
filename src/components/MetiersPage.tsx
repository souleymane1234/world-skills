import { useMemo, useState } from 'react'
import { getSkillImageCandidates, SKILL_CATEGORY_LABELS, SKILLS } from '../data/skills'
import { HeroVideo } from './HeroVideo'
import { SectionBridge } from './SectionBridge'
import './MetiersPage.css'
import './ConcoursPage.css'

const CATEGORIES = Object.keys(SKILL_CATEGORY_LABELS) as Array<keyof typeof SKILL_CATEGORY_LABELS>
const CATEGORY_META: Record<
  (typeof CATEGORIES)[number],
  { emoji: string; className: string }
> = {
  'technologie-tertiaire': { emoji: '📈', className: 'metiers-page__category-title--tertiaire' },
  'hotellerie-agroalimentaire': { emoji: '🍽️', className: 'metiers-page__category-title--hotellerie' },
  'technologie-industrielle': { emoji: '⚙️', className: 'metiers-page__category-title--industrielle' },
  'arts-mode-esthetique': { emoji: '🎨', className: 'metiers-page__category-title--arts' },
  batiment: { emoji: '🏗️', className: 'metiers-page__category-title--batiment' },
}

function SkillCardImage({ id, name, alt }: { id: string; name: string; alt: string }) {
  const candidates = useMemo(() => getSkillImageCandidates(id, name), [id, name])
  const [index, setIndex] = useState(0)
  const src = candidates[index] ?? '/logo-worldskills.svg'

  return (
    <img
      className="metiers-page__card-image"
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        setIndex((current) =>
          current < candidates.length - 1 ? current + 1 : current,
        )
      }}
    />
  )
}

export function MetiersPage() {
  return (
    <main className="concours-page metiers-page" aria-labelledby="metiers-title">
      <HeroVideo
        subtitle="Disciplines officielles"
        title="Les métiers en compétition"
      />
      <SectionBridge variant="ribbon" />

      <section className="concours-page__stack">
        <section className="concours-page__section">
          <div className="concours-page__inner metiers-page__intro">
            <p className="concours-page__eyebrow">25 disciplines</p>
            <h1 id="metiers-title">Olympiades des métiers 2026</h1>
            <p className="concours-page__lead">
              Chaque métier est présenté sous forme de fiche avec son visuel,
              son titre et sa catégorie professionnelle.
            </p>
          </div>
        </section>

        {CATEGORIES.map((category) => {
          const items = SKILLS.filter((skill) => skill.category === category)
          if (items.length === 0) return null
          const meta = CATEGORY_META[category]

          return (
            <section key={category} className="concours-page__section metiers-page__cards-section">
              <div className="concours-page__inner">
                <h2 className={`metiers-page__category-title ${meta.className}`}>
                  <span className="metiers-page__category-emoji" aria-hidden="true">
                    {meta.emoji}
                  </span>{' '}
                  {SKILL_CATEGORY_LABELS[category]}
                </h2>
                <div className="metiers-page__cards-grid">
                  {items.map((skill) => (
                    <article key={skill.id} className="metiers-page__card">
                      <SkillCardImage id={skill.id} name={skill.name} alt={skill.name} />
                      <div className="metiers-page__card-body">
                        <h3 className="metiers-page__card-title">{skill.name}</h3>
                        <p className="metiers-page__card-category">
                          <span aria-hidden="true">{meta.emoji}</span>{' '}
                          {SKILL_CATEGORY_LABELS[skill.category]}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <p className="metiers-page__note">
              D&apos;autres disciplines peuvent être ajoutées selon les éditions.
              Consultez le règlement officiel METFPA pour la liste exhaustive.
            </p>
            <a className="concours-page__inline-link" href="/competition">
              Voir le calendrier de compétition
            </a>
          </div>
        </section>
      </section>
    </main>
  )
}
