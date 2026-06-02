import { WORLD_SKILLS_STATS } from '../data/skills'
import { useRevealOnView } from '../hooks/useRevealOnView'
import './StatsBanner.css'

const STATS = [
  { value: String(WORLD_SKILLS_STATS.disciplines), label: 'Disciplines' },
  { value: `${WORLD_SKILLS_STATS.competitors2025}+`, label: 'Compétiteurs (2025)' },
  { value: String(WORLD_SKILLS_STATS.establishments2025), label: 'Établissements finalistes' },
  { value: String(WORLD_SKILLS_STATS.regions), label: 'Villes de présélection' },
] as const

export function StatsBanner() {
  const { ref, isVisible } = useRevealOnView<HTMLElement>()

  return (
    <section
      ref={ref}
      id="chiffres"
      className={`ws-stats${isVisible ? ' ws-stats--visible' : ''}`}
      aria-label="Chiffres clés"
    >
      <ul className="ws-stats__grid">
        {STATS.map(({ value, label }) => (
          <li key={label} className="ws-stats__item">
            <span className="ws-stats__value">{value}</span>
            <span className="ws-stats__label">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
