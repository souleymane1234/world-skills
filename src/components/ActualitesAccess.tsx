import { ACTUALITES } from '../data/actualites'
import { useRevealOnView } from '../hooks/useRevealOnView'
import './ActualitesAccess.css'

const ACTUALITES_VOIR_PLUS_HREF = '/actualites'

export function ActualitesAccess() {
  const { ref, isVisible } = useRevealOnView<HTMLElement>()
  const items = [...ACTUALITES]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 4)

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
                <a
                  className="act-access__news-media"
                  href={`${ACTUALITES_VOIR_PLUS_HREF}/${item.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    className="act-access__news-img"
                    src={item.image}
                    alt=""
                    width={640}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="act-access__news-cat">{item.category}</span>
                </a>
                <div className="act-access__news-body">
                  <time dateTime={item.publishedAt}>
                    {new Date(item.publishedAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                  <h3 className="act-access__news-title">
                    <a href={`${ACTUALITES_VOIR_PLUS_HREF}/${item.slug}`}>
                      {item.title}
                    </a>
                  </h3>
                  <p className="act-access__news-excerpt">{item.description}</p>
                  <a className="act-access__news-link" href={`${ACTUALITES_VOIR_PLUS_HREF}/${item.slug}`}>
                    Lire la suite
                    <span aria-hidden="true">→</span>
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
