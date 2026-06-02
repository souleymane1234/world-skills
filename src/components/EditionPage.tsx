import { useEffect, useMemo, useRef, useState } from 'react'
import { USE_MOCK_DATA } from '../config/app-config'
import {
  CURRENT_EDITION_YEAR,
  EDITIONS,
  type Candidate,
  type Edition,
} from '../data/editions'
import {
  useEditionFromApi,
  useEmissionEditionsCatalog,
  useResolvedEmission,
} from '../hooks/use-emission-queries'
import { useRevealOnView } from '../hooks/useRevealOnView'
import { HeroVideo } from './HeroVideo'
import { PromoBanner } from './PromoBanner'
import { SectionBridge } from './SectionBridge'
import './ConcoursPage.css'
import './EditionPage.css'

const SPONSOR_TIER_LABEL: Record<Edition['sponsors'][number]['tier'], string> = {
  principal: 'Partenaire principal',
  or: 'Or',
  argent: 'Argent',
  bronze: 'Bronze',
}

function parseEditionIdFromPath(
  catalog: { editionId: string; year: number; status?: string }[],
): string | null {
  const yearMatch = window.location.pathname.match(/^\/edition\/(\d{4})\/?$/)
  if (yearMatch) {
    const year = Number(yearMatch[1])
    return catalog.find((c) => c.year === year)?.editionId ?? null
  }
  if (window.location.pathname === '/edition' || window.location.pathname === '/edition/') {
    const current = catalog.find((c) => c.status === 'current') ?? catalog[0]
    return current?.editionId ?? null
  }
  return null
}

function CrownIcon() {
  return (
    <svg
      className="edition-page__candidate-rank-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M5 16L3 7l5.5 4L12 4l3.5 7L21 7l-2 9H5zm2.7 2h8.6l1 3H6.7l1-3z"
      />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M8 5v14l11-7z" />
    </svg>
  )
}

function CandidateCard({
  candidate,
  rank,
  isWinner,
  onPlayVideo,
}: {
  candidate: Candidate
  rank: number
  isWinner: boolean
  onPlayVideo: (candidate: Candidate) => void
}) {
  const mentorInitial = candidate.mentorName.charAt(0).toUpperCase()

  return (
    <article className="edition-page__candidate">
      <img
        className="edition-page__candidate-bg"
        src={candidate.photoSrc}
        alt=""
        loading="lazy"
      />
      <div className="edition-page__candidate-overlay" aria-hidden="true" />

      <span className="edition-page__candidate-rank">
        <CrownIcon />
        #{rank}
      </span>

      {isWinner && (
        <span className="edition-page__candidate-winner-tag">Médaille or</span>
      )}

      <button
        type="button"
        className="edition-page__candidate-play"
        aria-label={`Lire la video de ${candidate.name}`}
        onClick={() => onPlayVideo(candidate)}
      >
        <PlayIcon />
      </button>

      <div className="edition-page__candidate-footer">
        <h3 className="edition-page__candidate-username">{candidate.name}</h3>
        <p className="edition-page__candidate-stats">
          {candidate.tradition} · {candidate.points} pts
        </p>
        <p className="edition-page__candidate-quiz">
          {candidate.establishment ?? `${candidate.city}, ${candidate.region}`}
        </p>

        <div className="edition-page__candidate-mentor">
          <div className="edition-page__candidate-mentor-avatar-container">
            <span className="edition-page__candidate-mentor-avatar" aria-hidden="true">
              {mentorInitial}
            </span>
          </div>

          <div>
            <strong>{candidate.mentorName}</strong>
            <span>{candidate.mentorSubtitle}</span>
          </div>
        </div>

        <div className="edition-page__candidate-actions">
          <button
            type="button"
            className="edition-page__candidate-btn edition-page__candidate-btn--video"
            onClick={() => onPlayVideo(candidate)}
          >
            Voir video
          </button>
        </div>
      </div>
    </article>
  )
}


function CandidateVideoModal({
  candidate,
  onClose,
}: {
  candidate: Candidate
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoSrc = candidate.videoSrc ?? '/video.mp4'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const video = videoRef.current
    video?.play().catch(() => {})

    return () => {
      window.removeEventListener('keydown', onKey)
      video?.pause()
    }
  }, [onClose, candidate.id])

  return (
    <div className="edition-page__modal" role="presentation" onClick={onClose}>
      <dialog
        className="edition-page__modal-dialog edition-page__modal-dialog--video"
        open
        aria-labelledby="candidate-video-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="edition-page__modal-close"
          aria-label="Fermer"
          onClick={onClose}
        >
          ×
        </button>
        <div className="edition-page__modal-video-wrap">
          <video
            ref={videoRef}
            className="edition-page__modal-video"
            src={videoSrc}
            poster={candidate.photoSrc}
            controls
            playsInline
            preload="metadata"
          >
            Votre navigateur ne prend pas en charge la lecture video.
          </video>
        </div>
        <div className="edition-page__modal-video-info">
          <h2 id="candidate-video-title">{candidate.name}</h2>
          <p className="edition-page__modal-video-username">@{candidate.username}</p>
          <p className="edition-page__modal-video-meta">
            {candidate.tradition} · {candidate.city}, {candidate.region}
          </p>
        </div>
      </dialog>
    </div>
  )
}


export function EditionPage() {
  const resolvedEmission = useResolvedEmission()
  const catalogQuery = useEmissionEditionsCatalog(
    USE_MOCK_DATA ? null : (resolvedEmission.emission?.id ?? null),
  )
  const pointsPerVote = resolvedEmission.pointsPerVote

  const catalog = USE_MOCK_DATA
    ? EDITIONS.map((e) => ({
        year: e.year,
        editionId: String(e.year),
        status: e.status,
        title: e.title,
        imageUrl: e.coverImageSrc,
      }))
    : (catalogQuery.data ?? [])

  const defaultTab = catalog.find((c) => c.status === 'current') ?? catalog[0]
  const initialEditionId = parseEditionIdFromPath(catalog) ?? defaultTab?.editionId ?? null

  const [selectedEditionId, setSelectedEditionId] = useState<string | null>(initialEditionId)
  const [videoCandidate, setVideoCandidate] = useState<Candidate | null>(null)
  const [regionFilter, setRegionFilter] = useState<string>('all')

  const selectedTab =
    catalog.find((c) => c.editionId === selectedEditionId) ?? defaultTab ?? catalog[0]
  const selectedYear = selectedTab?.year ?? CURRENT_EDITION_YEAR

  const apiEditionId = USE_MOCK_DATA ? null : (selectedTab?.editionId ?? null)

  const {
    edition: apiEdition,
    isLoading: editionLoading,
    isError: editionError,
  } = useEditionFromApi(apiEditionId, pointsPerVote)

  const edition = useMemo(() => {
    if (USE_MOCK_DATA) {
      return EDITIONS.find((e) => e.year === selectedYear) ?? EDITIONS[0]
    }
    return apiEdition
  }, [selectedYear, apiEdition])

  useEffect(() => {
    if (USE_MOCK_DATA || catalog.length === 0) return
    const fromPath = parseEditionIdFromPath(catalog)
    if (fromPath && fromPath !== selectedEditionId) {
      setSelectedEditionId(fromPath)
      return
    }
    if (!catalog.some((c) => c.editionId === selectedEditionId) && defaultTab) {
      setSelectedEditionId(defaultTab.editionId)
    }
  }, [catalog, defaultTab, selectedEditionId])

  const regions = useMemo(
    () => [...new Set((edition?.candidates ?? []).map((c) => c.region))].sort(),
    [edition],
  )

  const filteredCandidates = useMemo(() => {
    const list = edition?.candidates ?? []
    if (regionFilter === 'all') return list
    return list.filter((c) => c.region === regionFilter)
  }, [edition, regionFilter])

  const rankedCandidates = useMemo(
    () => [...filteredCandidates].sort((a, b) => b.points - a.points),
    [filteredCandidates],
  )

  const selectEdition = (editionId: string, year: number) => {
    setSelectedEditionId(editionId)
    setRegionFilter('all')
    setVideoCandidate(null)
    const canonical = catalog.find((c) => c.status === 'current') ?? catalog[0]
    const path =
      canonical && editionId === canonical.editionId ? '/edition' : `/edition/${year}`
    window.history.replaceState(null, '', path)
  }

  const isPast = edition?.status === 'past'
  const { ref: presentationRef, isVisible: presentationVisible } =
    useRevealOnView<HTMLElement>()

  /** imageUrl de l'édition sélectionnée uniquement */
  const editionImageUrl = useMemo(() => {
    if (!selectedTab?.editionId) return ''
    const fromDetail = edition?.coverImageSrc?.trim()
    const fromCatalog = selectedTab.imageUrl?.trim()
    const fromEmissionList = resolvedEmission.emission?.editions
      .find((e) => e.id === selectedTab.editionId)
      ?.imageUrl?.trim()
    return fromDetail || fromCatalog || fromEmissionList || ''
  }, [
    edition?.coverImageSrc,
    resolvedEmission.emission?.editions,
    selectedTab?.editionId,
    selectedTab?.imageUrl,
  ])

  /** Description de la dernière émission résolue */
  const emissionDescription =
    resolvedEmission.emissionDescription ||
    (USE_MOCK_DATA
      ? 'Le grand rendez-vous des ambassadrices de la culture et du style ivoirien.'
      : '')

  if (!USE_MOCK_DATA && (resolvedEmission.isLoading || catalogQuery.isLoading)) {
    return (
      <main className="concours-page edition-page edition-page--loading">
        <div className="edition-page__shell">
          <p>Chargement des editions…</p>
        </div>
      </main>
    )
  }

  if (!USE_MOCK_DATA && (resolvedEmission.isError || !resolvedEmission.emission)) {
    return (
      <main className="concours-page edition-page edition-page--error">
        <div className="edition-page__shell">
          <h1>Emission indisponible</h1>
          <p>Impossible de charger l&apos;emission. Reessayez plus tard.</p>
          <a href="/">Retour a l&apos;accueil</a>
        </div>
      </main>
    )
  }

  if (!edition) {
    return (
      <main className="concours-page edition-page edition-page--error">
        <div className="edition-page__shell">
          <h1>Edition indisponible</h1>
          <p>
            {editionError || catalogQuery.isError
              ? 'Impossible de charger les donnees. Reessayez plus tard.'
              : editionLoading
                ? 'Chargement…'
                : catalog.length === 0
                  ? 'Aucune edition publiee pour cette emission.'
                  : 'Aucune edition trouvee.'}
          </p>
          <a href="/">Retour a l&apos;accueil</a>
        </div>
      </main>
    )
  }

  const yearTabs = catalog

  return (
    <main className="concours-page edition-page" aria-labelledby="edition-title">
      {videoCandidate && (
        <CandidateVideoModal
          candidate={videoCandidate}
          onClose={() => setVideoCandidate(null)}
        />
      )}

      <HeroVideo
        key={edition.year}
        src={edition.videoSrc}
        poster={edition.videoPosterSrc}
        subtitle={`Edition ${edition.year}`}
        title={edition.theme}
      />
      <PromoBanner />
      <SectionBridge variant="ribbon" />

      <section id="edition" className="concours-page__stack">
        <section className="concours-page__section concours-page__hero">
          <div className="concours-page__inner">
            <p className="concours-page__eyebrow">
              {resolvedEmission.emission?.title ?? 'Edition'}
            </p>
            <h1 id="edition-title">{edition.title}</h1>
            <p className="concours-page__lead">{edition.tagline}</p>

            <div className="edition-page__year-tabs" role="tablist" aria-label="Choisir une edition">
              {yearTabs.map((e) => (
                <button
                  key={e.editionId}
                  type="button"
                  role="tab"
                  aria-selected={e.editionId === selectedTab?.editionId}
                  className={`edition-page__year-tab${e.editionId === selectedTab?.editionId ? ' edition-page__year-tab--active' : ''}${e.status === 'current' ? ' edition-page__year-tab--current' : ''}`}
                  onClick={() => selectEdition(e.editionId, e.year)}
                >
                  {e.year}
                  {e.status === 'current' && (
                    <span className="edition-page__year-tab-label">En cours</span>
                  )}
                </button>
              ))}
            </div>

            <ul className="edition-page__highlights">
              {edition.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <SectionBridge variant="wave" />

        <section
          key={`presentation-${selectedYear}`}
          ref={presentationRef}
          className={`concours-page__section edition-page__presentation-section${presentationVisible ? ' edition-page__presentation-section--visible' : ''}`}
        >
          <div className="edition-page__presentation">
            <h2>Presentation de l&apos;emission</h2>
            <div className="edition-page__presentation-grid">
              <div className="edition-page__presentation-content">
                <p className="concours-page__eyebrow edition-page__theme">
                  {resolvedEmission.emission?.title ?? 'WorldSkills Côte d\'Ivoire'}
                </p>
                <p className="edition-page__description edition-page__description--lead">
                  {emissionDescription}
                </p>
                <dl className="edition-page__meta edition-page__meta--presentation">
                  <div className="edition-page__meta-card">
                    <dt>Dates</dt>
                    <dd>{edition.dates}</dd>
                  </div>
                  <div className="edition-page__meta-card">
                    <dt>Lieu</dt>
                    <dd>{edition.location}</dd>
                  </div>
                  <div className="edition-page__meta-card">
                    <dt>Candidates</dt>
                    <dd>{edition.candidateCount} compétiteurs</dd>
                  </div>
                  <div className="edition-page__meta-card">
                    <dt>Statut</dt>
                    <dd>{isPast ? 'Edition terminee' : 'Edition en cours'}</dd>
                  </div>
                </dl>
              </div>
              <div className="edition-page__presentation-visual">
                {editionImageUrl ? (
                  <img
                    src={editionImageUrl}
                    alt={`Visuel edition ${edition.title}`}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="edition-page__presentation-visual-placeholder"
                    role="img"
                    aria-label={`Visuel edition ${edition.title}`}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <SectionBridge variant="ribbon" />

        <section className="concours-page__section edition-page__candidates-section" id="candidates">
          <div className="edition-page__candidates-wrap">
            <h2>
              {isPast ? 'Les compétiteurs de l\'édition' : 'Compétiteurs en lice'}
            </h2>
            <p className="edition-page__section-intro">
              {isPast
                ? 'Retrouvez les lauréats et finalistes de cette édition.'
                : 'Découvrez les compétiteurs sélectionnés pour cette édition.'}
            </p>

            {regions.length > 1 && (
              <div className="edition-page__filters">
                <label htmlFor="edition-region-filter" className="edition-page__filter-label">
                  Filtrer par region
                </label>
                <select
                  id="edition-region-filter"
                  className="edition-page__filter-select"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="all">Toutes les regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="edition-page__candidates-grid">
              {rankedCandidates.map((candidate, index) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  rank={index + 1}
                  isWinner={edition.winnerId === candidate.id}
                  onPlayVideo={setVideoCandidate}
                />
              ))}
            </div>
            {filteredCandidates.length === 0 && (
              <p className="edition-page__empty">Aucun compétiteur pour ce filtre.</p>
            )}
          </div>
        </section>

        <SectionBridge variant="wave" />

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <h2>Lots et recompenses</h2>
            <div className="edition-page__prizes">
              {edition.prizes.map((prize) => (
                <article key={prize.title} className="edition-page__prize">
                  <h3>{prize.title}</h3>
                  <p>{prize.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge variant="ribbon" />

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <h2>Reglement</h2>
            <ul className="concours-page__list edition-page__rules">
              {edition.rulesSummary.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <a className="concours-page__inline-link" href={edition.rulesDocumentHref}>
              Telecharger le reglement complet (PDF)
            </a>
          </div>
        </section>

        <SectionBridge variant="wave" />

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <h2>Sponsors de l&apos;edition {edition.year}</h2>
            <p className="edition-page__section-intro">
              Merci a nos partenaires qui accompagnent chaque edition du concours.
            </p>
            <div className="edition-page__sponsors">
              {edition.sponsors.map((sponsor) => (
                <article key={`${sponsor.name}-${sponsor.logoSrc}`} className="edition-page__sponsor">
                  <img src={sponsor.logoSrc} alt={sponsor.name} loading="lazy" />
                  <p>{sponsor.name}</p>
                  <span className="edition-page__sponsor-tier">
                    {SPONSOR_TIER_LABEL[sponsor.tier]}
                  </span>
                </article>
              ))}
            </div>
            <a className="concours-page__inline-link edition-page__partner-link" href="/partenariat">
              Devenir sponsor
            </a>
          </div>
        </section>

        <SectionBridge variant="ribbon" />

        <section className="concours-page__section">
          <div className="concours-page__inner">
            <h2>Autres editions</h2>
            <p className="edition-page__section-intro">
              Parcourez les éditions précédentes des Olympiades des métiers.
            </p>
            <div className="edition-page__history">
              {catalog
                .filter((tab) => tab.editionId !== selectedTab?.editionId)
                .map((tab) => {
                  const mockEdition = USE_MOCK_DATA
                    ? EDITIONS.find((e) => e.year === tab.year)
                    : null
                  const nestedCover = resolvedEmission.emission?.editions.find(
                    (e) => e.id === tab.editionId,
                  )?.imageUrl
                  return (
                    <article key={tab.editionId} className="edition-page__history-card">
                      <img
                        src={mockEdition?.coverImageSrc ?? nestedCover ?? '/miss.jpg'}
                        alt=""
                        loading="lazy"
                      />
                      <div>
                        <h3>{mockEdition?.title ?? tab.title}</h3>
                        <p>{mockEdition?.theme ?? tab.title}</p>
                        {mockEdition && (
                          <ul>
                            {mockEdition.highlights.map((h) => (
                              <li key={h}>{h}</li>
                            ))}
                          </ul>
                        )}
                        <button
                          type="button"
                          className="edition-page__history-btn"
                          onClick={() => selectEdition(tab.editionId, tab.year)}
                        >
                          Voir l&apos;edition {tab.year}
                        </button>
                      </div>
                    </article>
                  )
                })}
            </div>
          </div>
        </section>

        {!isPast && (
          <>
            <SectionBridge variant="wave" />
            <section className="concours-page__section">
              <div className="concours-page__inner">
                <h2>Vous aussi, participez</h2>
                <p className="edition-page__section-intro">
                  Les pre-inscriptions pour l&apos;edition {CURRENT_EDITION_YEAR} sont ouvertes.
                </p>
                <div className="concours-page__actions">
                  <a href="/concours" className="concours-page__btn-primary edition-page__cta">
                    Deposer ma candidature
                  </a>
                  <a href="/actualites">Suivre les actualites</a>
                </div>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  )
}
