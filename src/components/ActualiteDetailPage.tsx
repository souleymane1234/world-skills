import { ACTUALITES } from '../data/actualites'
import { formatNewsDate } from '../lib/map-news'
import './ActualiteDetailPage.css'

function parseSlugFromPath(): string | null {
  const match = window.location.pathname.match(/^\/actualites\/([^/]+)\/?$/)
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export function ActualiteDetailPage() {
  const slug = parseSlugFromPath()
  const article = slug ? ACTUALITES.find((item) => item.slug === slug) : null

  if (!article) {
    return (
      <main className="actu-detail">
        <div className="actu-detail__inner">
          <a href="/actualites" className="actu-detail__back">
            ← Retour aux actualites
          </a>
          <h1>Actualite introuvable</h1>
          <p>Ce contenu n&apos;existe plus ou le lien est incorrect.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="actu-detail">
      <div className="actu-detail__inner">
        <a href="/actualites" className="actu-detail__back">
          ← Retour aux actualites
        </a>

        <article className="actu-detail__article">
          {article.image ? (
            <div className="actu-detail__hero">
              <img src={article.image} alt={article.title} />
            </div>
          ) : null}

          <div className="actu-detail__body">
            <p className="actu-detail__category">{article.category}</p>
            <h1>{article.title}</h1>

            <ul className="actu-detail__meta">
              <li>{formatNewsDate(article.publishedAt)}</li>
              <li>{article.source}</li>
            </ul>

            <div className="actu-detail__content">
              <p>{article.description}</p>
              <p>{article.content}</p>
              {article.link ? (
                <p>
                  Source :
                  {' '}
                  <a href={article.link} target="_blank" rel="noreferrer">
                    Voir le lien original
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
