import { SKILLS } from '../data/skills'
import { useRevealOnView } from '../hooks/useRevealOnView'
import './SkillsPreview.css'

const PREVIEW = SKILLS.slice(0, 8)

export function SkillsPreview() {
  const { ref, isVisible } = useRevealOnView<HTMLElement>()

  return (
    <section
      ref={ref}
      id="metiers"
      className={`ws-skills-preview${isVisible ? ' ws-skills-preview--visible' : ''}`}
      aria-labelledby="ws-skills-preview-title"
    >
      <div className="ws-skills-preview__inner">
        <div className="ws-skills-preview__header">
          <div>
            <p className="ws-skills-preview__eyebrow">Disciplines</p>
            <h2 id="ws-skills-preview-title">28 métiers en compétition</h2>
          </div>
          <a href="/metiers" className="ws-skills-preview__link">
            Voir tous les métiers
          </a>
        </div>
        <ul className="ws-skills-preview__grid">
          {PREVIEW.map((skill) => (
            <li key={skill.id}>
              <span className="ws-skills-preview__icon" aria-hidden="true">
                {skill.icon}
              </span>
              <span className="ws-skills-preview__name">{skill.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
