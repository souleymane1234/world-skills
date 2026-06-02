import { SKILL_CATEGORY_LABELS, SKILLS, type SkillCategory } from '../data/skills'
import { HeroVideo } from './HeroVideo'
import { SectionBridge } from './SectionBridge'
import './MetiersPage.css'
import './ConcoursPage.css'

const CATEGORIES = Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[]

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
            <h1 id="metiers-title">Olympiades des métiers 2025</h1>
            <p className="concours-page__lead">
              De la coiffure à la CAO/DAO, les compétiteurs démontrent leurs
              savoir-faire selon les standards WorldSkills. Liste indicative des
              disciplines mobilisées lors de la finale nationale.
            </p>
          </div>
        </section>

        {CATEGORIES.map((category) => {
          const items = SKILLS.filter((s) => s.category === category)
          if (items.length === 0) return null

          return (
            <section key={category} className="concours-page__section metiers-page__block">
              <div className="concours-page__inner">
                <h2>{SKILL_CATEGORY_LABELS[category]}</h2>
                <ul className="metiers-page__list">
                  {items.map((skill) => (
                    <li key={skill.id}>
                      <span aria-hidden="true">{skill.icon}</span>
                      {skill.name}
                    </li>
                  ))}
                </ul>
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
