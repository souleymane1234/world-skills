import { useRevealOnView } from '../hooks/useRevealOnView'
import './AboutSection.css'

export function AboutSection() {
  const { ref, isVisible } = useRevealOnView<HTMLElement>()

  return (
    <section
      ref={ref}
      className={`ws-about${isVisible ? ' ws-about--visible' : ''}`}
      aria-labelledby="ws-about-title"
    >
      <div className="ws-about__inner">
        <div className="ws-about__headline">
          <div className="ws-about__headline-text">
            <p className="ws-about__eyebrow">À propos</p>
            <h2 id="ws-about-title" className="ws-about__title">
              WorldSkills Côte d&apos;Ivoire
            </h2>
          </div>
          <a className="ws-about__cta-link" href="/competition">
            Les Olympiades des métiers
          </a>
        </div>

        <div className="ws-about__copy">
          <p className="ws-about__summary">
            Les Olympiades des métiers — WorldSkills Côte d&apos;Ivoire — sont
            organisées par le ministère de l&apos;Enseignement technique, de la
            Formation professionnelle et de l&apos;Apprentissage (METFPA). L&apos;objectif
            général est de mobiliser les entreprises de production autour du
            développement des compétences techniques et professionnelles des jeunes.
          </p>
          <p className="ws-about__summary">
            Le ministère de l&apos;Enseignement technique, de la Formation
            professionnelle et de l&apos;Apprentissage (METFPA) a confié
            l&apos;organisation de la 6<sup>e</sup> édition à l&apos;ONG Révèle Ton Talent.
          </p>
        </div>

        <ul className="ws-about__highlights">
          <li>
            <span className="ws-about__highlight-label">Excellence</span>
            Standards professionnels exigeants, alignés sur WorldSkills
            International.
          </li>
          <li>
            <span className="ws-about__highlight-label">Formation–emploi</span>
            Adéquation compétences–employabilité, au cœur de l&apos;Académie des
            Talents (ACT).
          </li>
          <li>
            <span className="ws-about__highlight-label">Territoires</span>
            Présélections à Abidjan, Bouaké, Gagnoa et Korhogo.
          </li>
        </ul>
      </div>
    </section>
  )
}
