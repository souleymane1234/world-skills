import { ACTUALITES } from '../data/actualites'
import { useRevealOnView } from '../hooks/useRevealOnView'
import './ActualitesAccess.css'

const ACTUALITES_VOIR_PLUS_HREF = '/actualites'

export function ActualitesAccess() {
  const { ref, isVisible } = useRevealOnView<HTMLElement>()
  const items = [...ACTUALITES]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 3)

  return (
    <section
      ref={ref}
      id="actualites"
      className={`act-access${isVisible ? ' act-access--visible' : ''}`}
      aria-labelledby="act-access-title"
    >
      <div className="act-access__inner">
        <header className="act-access__header">
          <div className="act-access__headline">
            <p className="act-access__eyebrow">Restez informés</p>
            <h2 id="act-access-title" className="act-access__title">
              Actualités WorldSkills CI
            </h2>
          </div>
          <p className="act-access__intro">
            Annonces du METFPA, résultats des présélections et coulisses des
            Olympiades des métiers.
          </p>
        </header>

        <ul className="act-access__grid" id="actualites-apercu">
          {items.map((item) => (
            <li key={item.id} className="act-access__card-item">
              <article className="act-access__news-card">
                <div className="act-access__news-visual">
                  <img
                    className="act-access__news-img"
                    src={item.image}
                    alt={item.title}
                    width={640}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="act-access__news-body">
                  <div className="act-access__news-meta">
                    <span className="act-access__news-cat">{item.category}</span>
                    <time dateTime={item.publishedAt}>
                      {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
                    </time>
                  </div>
                  <h3 className="act-access__news-title">{item.title}</h3>
                  <p className="act-access__news-excerpt">{item.description}</p>
                  <a className="act-access__news-link" href={`${ACTUALITES_VOIR_PLUS_HREF}/${item.slug}`}>
                    Lire la suite
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="act-access__actions">
          <a
            className="act-access__cta"
            href={ACTUALITES_VOIR_PLUS_HREF}
            id="actualites-voir-plus"
          >
            Voir plus d&apos;actualités
          </a>
        </div>
      </div>
    </section>
  )
}
