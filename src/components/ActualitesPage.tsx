import { useEffect, useMemo, useRef, useState } from 'react'
import { ACTUALITES } from '../data/actualites'
import './ActualitesPage.css'

const MOCK_PAGE_SIZE = 5

export function ActualitesPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [mockVisible, setMockVisible] = useState(MOCK_PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 600)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    const sorted = [...ACTUALITES].sort(
      (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    )
    if (!query) return sorted
    return sorted.filter((item) =>
      `${item.title} ${item.description} ${item.content} ${item.source} ${item.category}`
        .toLowerCase()
        .includes(query),
    )
  }, [search])

  const items = useMemo(() => filtered.slice(0, mockVisible), [filtered, mockVisible])
  const hasMore = mockVisible < filtered.length

  useEffect(() => {
    const target = sentinelRef.current
    if (!target || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setMockVisible((n) => Math.min(n + MOCK_PAGE_SIZE, filtered.length))
      },
      { rootMargin: '120px 0px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [hasMore, filtered.length])

  return (
    <main id="actualites" className="actu-page" aria-labelledby="actu-page-title">
      <div className="actu-page__layout">
        <aside className="actu-page__aside" aria-label="Publicites gauche">
          <article className="actu-side-ad">
            <p>Publicite</p>
            <img
              src="/affuche%20pub%20miss%20tradi.jpg"
              alt="Publicite WorldSkills Côte d\u2019Ivoire"
              loading="lazy"
              decoding="async"
            />
            <a href="/partenariat">Reserver cet espace</a>
          </article>
        </aside>

        <div className="actu-page__inner">
          <header className="actu-page__header">
            <p className="actu-page__eyebrow">Actualites</p>
            <h1 id="actu-page-title">Fil officiel WorldSkills Côte d\u2019Ivoire</h1>
            <p>
              Retrouvez toutes les publications, annonces et espaces publicitaires dans un fil
              continu.
            </p>

            <div className="actu-page__toolbar">
              <label className="actu-page__search">
                <span className="visually-hidden">Rechercher une actualite</span>
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Rechercher une actualite…"
                  autoComplete="off"
                />
              </label>
            </div>
          </header>

          {items.length === 0 ? (
            <p className="actu-page__status">Aucune actualite pour le moment.</p>
          ) : null}

          <ul className="actu-page__feed">
            {items.map((item) => (
              <li key={item.id}>
                <article className="actu-card">
                  <div className="actu-card__top">
                    <div className="actu-card__avatar" aria-hidden="true">
                      {item.source.slice(0, 1)}
                    </div>
                    <div>
                      <p className="actu-card__author">{item.source}</p>
                      <p className="actu-card__meta">
                        {item.category} · {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <h2 className="actu-card__headline">{item.title}</h2>
                  <p className="actu-card__text">{item.description}</p>

                  {item.image ? (
                    <img
                      className="actu-card__image"
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}

                  <footer className="actu-card__footer">
                    <a className="actu-card__read" href={`/actualites/${item.slug}`}>
                      Lire la publication
                    </a>
                  </footer>
                </article>
              </li>
            ))}
          </ul>

          <div className="actu-page__loading" aria-live="polite">
            {hasMore ? (
              <>
                <p>Faites defiler pour charger plus de publications…</p>
                <div ref={sentinelRef} className="actu-page__sentinel" aria-hidden="true" />
              </>
            ) : items.length > 0 ? (
              <p>Vous etes a jour.</p>
            ) : null}
          </div>
        </div>

        <aside className="actu-page__aside" aria-label="Publicites droite">
          <article className="actu-side-ad">
            <p>Annonce</p>
            <img
              src="/affiche%20miss%20tradi_Plan%20de%20travail%201.jpg"
              alt="Affiche promotionnelle WorldSkills Côte d\u2019Ivoire"
              loading="lazy"
              decoding="async"
            />
            <a href="/#contact">Nous contacter</a>
          </article>
        </aside>
      </div>
    </main>
  )
}
