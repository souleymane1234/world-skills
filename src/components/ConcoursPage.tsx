import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CURRENT_EDITION_YEAR,
  EDITION_NAV_YEARS,
  getEditionByYear,
} from '../data/editions'
import {
  getSkillImageCandidates,
  SKILLS,
} from '../data/skills'
import {
  useActiveEdition,
  useEmissionCategories,
} from '../hooks/use-emission-queries'
import { SectionBridge } from './SectionBridge'
import { PartnersTrustCarousel } from './PartnersTrustCarousel'
import './ConcoursPage.css'
import './MetiersPage.css'

const CATEGORY_STYLES = [
  { emoji: '📈', className: 'metiers-page__category-title--tertiaire' },
  { emoji: '🍽️', className: 'metiers-page__category-title--hotellerie' },
  { emoji: '⚙️', className: 'metiers-page__category-title--industrielle' },
  { emoji: '🎨', className: 'metiers-page__category-title--arts' },
  { emoji: '🏗️', className: 'metiers-page__category-title--batiment' },
] as const

function normalizeLabel(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function resolveLocalSkillId(tagName: string): string | null {
  const byName = SKILLS.find(
    (skill) => normalizeLabel(skill.name) === normalizeLabel(tagName),
  )
  return byName?.id ?? null
}

function extractEstablishment(candidate: {
  residenceCountry?: string | null
  description?: string | null
}): string {
  const fromResidence = candidate.residenceCountry?.trim()
  if (fromResidence) return fromResidence
  const match = candidate.description?.match(
    /Établissement d['']origine\s*:\s*(.+)/i,
  )
  const fromDescription = match?.[1]?.trim().split('\n')[0]?.trim()
  return fromDescription || '—'
}

function CompetitionSkillImage({
  name,
  imageUrl,
  alt,
}: {
  name: string
  imageUrl?: string | null
  alt: string
}) {
  const candidates = useMemo(() => {
    const remote = imageUrl?.trim() ? [imageUrl.trim()] : []
    const localId = resolveLocalSkillId(name)
    const local = localId ? getSkillImageCandidates(localId, name) : []
    return [...remote, ...local, '/logo-worldskills.svg']
  }, [name, imageUrl])
  const [index, setIndex] = useState(0)
  const src = candidates[index] ?? '/logo-worldskills.svg'

  return (
    <img
      className="metiers-page__card-image"
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        setIndex((current) =>
          current < candidates.length - 1 ? current + 1 : current,
        )
      }}
    />
  )
}

const PAST_EDITION_YEARS = EDITION_NAV_YEARS.filter(
  (year) => year !== CURRENT_EDITION_YEAR,
)

export function ConcoursPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [pastEditionYear, setPastEditionYear] = useState<number | null>(null)
  const [selectedMetier, setSelectedMetier] = useState<{
    categoryId: string
    categoryName: string
    tagId: string
    tagName: string
    imageUrl?: string | null
  } | null>(null)

  const pastEdition = pastEditionYear ? getEditionByYear(pastEditionYear) : null

  const activeEditionQuery = useActiveEdition()
  const editionId = activeEditionQuery.data?.id ?? null
  const categoriesQuery = useEmissionCategories(editionId)
  const apiCategories = categoriesQuery.data ?? []

  const apiCandidates = useMemo(() => {
    const detail = activeEditionQuery.data
    if (!detail || !('candidates' in detail) || !detail.candidates) return []
    return [...detail.candidates].sort((a, b) => b.totalVotes - a.totalVotes)
  }, [activeEditionQuery.data])

  const competitionCategories = useMemo(() => {
    const detail = activeEditionQuery.data
    if (
      detail &&
      'candidateCategories' in detail &&
      detail.candidateCategories &&
      detail.candidateCategories.length > 0
    ) {
      return detail.candidateCategories
        .map((entry) => ({
          id: entry.category.id,
          name: entry.category.name,
          imageUrl: entry.category.imageUrl,
          tags: [...entry.tags]
            .filter((tag) => tag.active !== false)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        }))
        .filter((category) => category.tags.length > 0)
    }
    return apiCategories
      .map((category) => ({
        id: category.id,
        name: category.name,
        imageUrl: category.imageUrl,
        tags: category.tags,
      }))
      .filter((category) => category.tags.length > 0)
  }, [activeEditionQuery.data, apiCategories])

  const selectedMetierCandidates = useMemo(() => {
    if (!selectedMetier) return []
    return apiCandidates.filter((candidate) => candidate.tag?.id === selectedMetier.tagId)
  }, [apiCandidates, selectedMetier])

  const apiEditionTitle =
    activeEditionQuery.data && 'title' in activeEditionQuery.data
      ? activeEditionQuery.data.title
      : null
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const revealMetierPanel = useCallback(
    (next: typeof selectedMetier) => {
      const apply = () => setSelectedMetier(next)
      const doc = document as Document & {
        startViewTransition?: (callback: () => void) => void
      }
      if (typeof doc.startViewTransition === 'function') {
        doc.startViewTransition(apply)
      } else {
        apply()
      }
      window.requestAnimationFrame(() => {
        document
          .getElementById('concours-edition-candidates')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [],
  )

  const showPrev = useCallback(() => {
    if (!pastEdition || lightboxIndex === null) return
    setLightboxIndex(
      (lightboxIndex - 1 + pastEdition.galleryPhotos.length) %
        pastEdition.galleryPhotos.length,
    )
  }, [pastEdition, lightboxIndex])

  const showNext = useCallback(() => {
    if (!pastEdition || lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % pastEdition.galleryPhotos.length)
  }, [pastEdition, lightboxIndex])

  useEffect(() => {
    setLightboxIndex(null)
  }, [pastEditionYear])

  useEffect(() => {
    if (lightboxIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxIndex, closeLightbox, showPrev, showNext])

  const activePhoto =
    pastEdition && lightboxIndex !== null
      ? pastEdition.galleryPhotos[lightboxIndex]
      : null

  const totalDisciplines = competitionCategories.reduce(
    (sum, category) => sum + category.tags.length,
    0,
  )

  return (
    <main className="concours-page concours-page--nav-offset" aria-labelledby="competition-title">
      <SectionBridge variant="ribbon" />

      <section id="competition" className="concours-page__stack">
        {!selectedMetier && (
          <h1 id="competition-title" className="visually-hidden">
            {apiEditionTitle ?? 'Côte d\u2019Ivoire Skills 2026'}
          </h1>
        )}

        {/* ── Métiers & Candidats ── */}
        <section className="concours-page__section concours-page__hero">
          <div className="concours-page__inner">
            {selectedMetier && (
              <h1 id="competition-title" className="visually-hidden">
                {selectedMetier.tagName}
              </h1>
            )}

            <div
              id="concours-edition-candidates"
              className="concours-page__candidates"
              role="tabpanel"
              aria-label="Métiers et candidats de l'édition en cours"
            >
              {selectedMetier ? (
                <div className="concours-page__metier-detail">
                  <button
                    type="button"
                    className="concours-page__metier-back"
                    onClick={() => revealMetierPanel(null)}
                  >
                    ← Retour aux métiers
                  </button>

                  {selectedMetierCandidates.length === 0 ? (
                    <p className="concours-page__candidates-empty">
                      Aucun candidat validé pour ce métier pour le moment.
                    </p>
                  ) : (
                    <ul className="concours-page__candidates-grid">
                      {selectedMetierCandidates.map((candidate, index) => {
                        const name =
                          [candidate.candidatePreName, candidate.candidateName]
                            .filter(Boolean)
                            .join(' ')
                            .trim() ||
                          candidate.user?.pseudo ||
                          'Candidat'
                        const establishment = extractEstablishment(candidate)
                        return (
                          <li
                            key={candidate.id}
                            style={{ ['--candidate-i' as string]: index }}
                          >
                            <article className="concours-page__candidate-card">
                              <img
                                className="concours-page__candidate-photo"
                                src={candidate.candidatePicture}
                                alt={name}
                                loading="lazy"
                              />
                              <div className="concours-page__candidate-body">
                                <h3>{name}</h3>
                                <p className="concours-page__candidate-school">
                                  {establishment}
                                </p>
                                <div className="concours-page__candidate-actions">
                                  <a
                                    className="concours-page__candidate-vote concours-page__candidate-vote--disabled"
                                    href={`/vote/${candidate.id}`}
                                    aria-disabled="true"
                                    tabIndex={-1}
                                    onClick={(event) => event.preventDefault()}
                                  >
                                    Noter
                                  </a>
                                  <a
                                    className="concours-page__candidate-showroom"
                                    href={`/showroom/${candidate.id}`}
                                  >
                                    Showroom
                                  </a>
                                </div>
                              </div>
                            </article>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="concours-page__metiers-list">
                  <div className="concours-page__candidates-head">
                    <h2>Métiers &amp; candidats</h2>
                    <p>{totalDisciplines} disciplines</p>
                  </div>

                  {(activeEditionQuery.isLoading || categoriesQuery.isLoading) &&
                  competitionCategories.length === 0 ? (
                    <p className="concours-page__candidates-empty">
                      Chargement des métiers…
                    </p>
                  ) : competitionCategories.length === 0 ? (
                    <p className="concours-page__candidates-empty">
                      Les métiers de cette édition apparaîtront ici.
                    </p>
                  ) : (
                    competitionCategories.map((category, categoryIndex) => {
                      const meta =
                        CATEGORY_STYLES[categoryIndex % CATEGORY_STYLES.length]
                      return (
                        <section
                          key={category.id}
                          className="concours-page__metier-category"
                        >
                          <h3
                            className={`metiers-page__category-title ${meta.className}`}
                          >
                            <span
                              className="metiers-page__category-emoji"
                              aria-hidden="true"
                            >
                              {meta.emoji}
                            </span>{' '}
                            {category.name}
                          </h3>
                          <div className="metiers-page__cards-grid">
                            {category.tags.map((tag, tagIdx) => {
                              const count = apiCandidates.filter(
                                (candidate) => candidate.tag?.id === tag.id,
                              ).length
                              return (
                                <button
                                  key={tag.id}
                                  type="button"
                                  className="metiers-page__card concours-page__metier-card"
                                  style={{ '--card-i': tagIdx } as React.CSSProperties}
                                  onClick={() =>
                                    revealMetierPanel({
                                      categoryId: category.id,
                                      categoryName: category.name,
                                      tagId: tag.id,
                                      tagName: tag.name,
                                      imageUrl: tag.imageUrl,
                                    })
                                  }
                                >
                                  <div className="concours-page__metier-media">
                                    <CompetitionSkillImage
                                      name={tag.name}
                                      imageUrl={tag.imageUrl}
                                      alt={tag.name}
                                    />
                                    <span className="concours-page__metier-badge">
                                      {count}{' '}
                                      {count > 1 ? 'candidats' : 'candidat'}
                                    </span>
                                    <h4 className="concours-page__metier-title">
                                      {tag.name}
                                    </h4>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </section>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Lightbox galerie ── */}
        {activePhoto && pastEdition && lightboxIndex !== null && (
          <div
            className="concours-page__lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.alt}
            onClick={closeLightbox}
          >
            <button
              type="button"
              className="concours-page__lightbox-close"
              onClick={closeLightbox}
              aria-label="Fermer"
            >
              ×
            </button>
            <button
              type="button"
              className="concours-page__lightbox-nav concours-page__lightbox-nav--prev"
              onClick={(event) => {
                event.stopPropagation()
                showPrev()
              }}
              aria-label="Photo précédente"
            >
              ‹
            </button>
            <figure
              className="concours-page__lightbox-figure"
              onClick={(event) => event.stopPropagation()}
            >
              <img src={activePhoto.src} alt={activePhoto.alt} />
              {activePhoto.caption && <figcaption>{activePhoto.caption}</figcaption>}
              <p className="concours-page__lightbox-counter">
                {lightboxIndex + 1} / {pastEdition.galleryPhotos.length}
              </p>
            </figure>
            <button
              type="button"
              className="concours-page__lightbox-nav concours-page__lightbox-nav--next"
              onClick={(event) => {
                event.stopPropagation()
                showNext()
              }}
              aria-label="Photo suivante"
            >
              ›
            </button>
          </div>
        )}

        {/* ── Éditions passées ── */}
        {!selectedMetier && (
          <>
            <SectionBridge variant="ribbon" />

            <section className="concours-page__section concours-page__section--editions">
              <div className="concours-page__inner">
                <p className="concours-page__eyebrow">Archives</p>
                <h2 className="concours-page__editions-title">Éditions passées</h2>
                <div
                  className="concours-page__past-editions"
                  role="tablist"
                  aria-label="Éditions passées"
                >
                  {PAST_EDITION_YEARS.map((navYear, index) => {
                    const editionData = getEditionByYear(navYear)
                    const isSelected = navYear === pastEditionYear
                    const coverSrc =
                      editionData?.galleryPhotos[index]?.src ||
                      editionData?.coverImageSrc ||
                      `/edition/${index + 1}.jpg`
                    return (
                      <button
                        key={navYear}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        aria-controls="concours-edition-gallery"
                        className={`concours-page__past-edition-card${
                          isSelected ? ' concours-page__past-edition-card--active' : ''
                        }`}
                        onClick={() => setPastEditionYear(navYear)}
                      >
                        <img
                          src={coverSrc}
                          alt=""
                          loading="lazy"
                          className="concours-page__past-edition-image"
                        />
                        <span className="concours-page__past-edition-label">
                          Édition {navYear}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {pastEdition && (
                  <div
                    id="concours-edition-gallery"
                    className="concours-page__gallery"
                    role="tabpanel"
                    aria-label={`Galerie photo ${pastEdition.year}`}
                  >
                    <div className="concours-page__gallery-grid">
                      {pastEdition.galleryPhotos.map((photo, index) => (
                        <button
                          key={photo.id}
                          type="button"
                          className="concours-page__gallery-item"
                          onClick={() => setLightboxIndex(index)}
                          aria-label={`Agrandir : ${photo.alt}`}
                        >
                          <img src={photo.src} alt={photo.alt} loading="lazy" />
                          {photo.caption && (
                            <span className="concours-page__gallery-caption">
                              {photo.caption}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </section>

      <SectionBridge variant="wave" />
      <PartnersTrustCarousel includeAnchorId={false} />
    </main>
  )
}
