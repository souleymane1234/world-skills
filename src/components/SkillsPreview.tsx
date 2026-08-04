import type { IconType } from 'react-icons'
import {
  FaBuilding,
  FaChartLine,
  FaIndustry,
  FaScissors,
  FaUtensils,
} from 'react-icons/fa6'
import {
  useActiveEditionId,
  useEmissionCategories,
} from '../hooks/use-emission-queries'
import { useRevealOnView } from '../hooks/useRevealOnView'
import './SkillsPreview.css'

const CATEGORY_ICONS: IconType[] = [
  FaChartLine,
  FaUtensils,
  FaIndustry,
  FaScissors,
  FaBuilding,
]

const CATEGORY_BG_COLORS = [
  '#0ea5b6',
  '#65a30d',
  '#1d4ed8',
  '#db2777',
  '#f59e0b',
] as const

export function SkillsPreview() {
  const { ref, isVisible } = useRevealOnView<HTMLElement>()
  const activeEditionQuery = useActiveEditionId()
  const categoriesQuery = useEmissionCategories(activeEditionQuery.data ?? null)
  const categories = categoriesQuery.data ?? []
  const isLoading = activeEditionQuery.isLoading || categoriesQuery.isLoading

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
            <p className="ws-skills-preview__eyebrow">Catégories</p>
            <h2 id="ws-skills-preview-title">Domaines professionnels concernés</h2>
          </div>
          <a href="/competition" className="ws-skills-preview__link">
            Voir tous les métiers
          </a>
        </div>

        {isLoading && categories.length === 0 ? (
          <p className="ws-skills-preview__loading">Chargement des domaines…</p>
        ) : null}

        <ul className="ws-skills-preview__categories">
          {categories.map((category, index) => {
            const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length]
            return (
              <li key={category.id} className="ws-skills-preview__category-card">
                <span
                  className="ws-skills-preview__category-icon-wrap"
                  style={{
                    backgroundColor: CATEGORY_BG_COLORS[index % CATEGORY_BG_COLORS.length],
                  }}
                  aria-hidden="true"
                >
                  <Icon className="ws-skills-preview__category-icon" />
                </span>
                <span className="ws-skills-preview__category-name">{category.name}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
