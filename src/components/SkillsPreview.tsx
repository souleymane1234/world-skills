import type { IconType } from 'react-icons'
import {
  FaBuilding,
  FaChartLine,
  FaIndustry,
  FaScissors,
  FaUtensils,
} from 'react-icons/fa6'
import { useRevealOnView } from '../hooks/useRevealOnView'
import './SkillsPreview.css'

const CATEGORIES: Array<{ id: string; label: string; icon: IconType }> = [
  {
    id: 'tech-tertiaire',
    label: 'TECHNOLOGIE TERTIAIRE',
    icon: FaChartLine,
  },
  {
    id: 'hotellerie-agro',
    label: 'HOTELLERIE ET AGROALIMENTAIRE',
    icon: FaUtensils,
  },
  {
    id: 'tech-industrielle',
    label: 'TECHNOLOGIE INDUSTRIELLE',
    icon: FaIndustry,
  },
  {
    id: 'arts-mode-esthetique',
    label: 'ARTS – MODE ET ESTHETIQUE',
    icon: FaScissors,
  },
  {
    id: 'batiment',
    label: 'BATIMENT',
    icon: FaBuilding,
  },
]

const CATEGORY_BG_COLORS = [
  '#0ea5b6', // Technologie tertiaire
  '#65a30d', // Hôtellerie et agroalimentaire
  '#1d4ed8', // Technologie industrielle
  '#db2777', // Arts · mode et esthétique
  '#f59e0b', // Bâtiment
] as const

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
            <p className="ws-skills-preview__eyebrow">Catégories</p>
            <h2 id="ws-skills-preview-title">Domaines professionnels concernés</h2>
          </div>
          <a href="/metiers" className="ws-skills-preview__link">
            Voir tous les métiers
          </a>
        </div>
        <ul className="ws-skills-preview__categories">
          {CATEGORIES.map((category, index) => (
            <li key={category.id} className="ws-skills-preview__category-card">
              <span
                className="ws-skills-preview__category-icon-wrap"
                style={{ backgroundColor: CATEGORY_BG_COLORS[index] ?? '#1d4ed8' }}
                aria-hidden="true"
              >
                <category.icon className="ws-skills-preview__category-icon" />
              </span>
              <span className="ws-skills-preview__category-name">{category.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
