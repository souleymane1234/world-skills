import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { emissionQueryKeys } from '../hooks/use-emission-queries'
import { emissionRequest } from '../lib/emission-request'
import { ApiHttpError } from '../lib/api'
import './CandidateShowroomPage.css'

function parseShowroomCandidateIdFromPath(): string | null {
  const match = window.location.pathname.match(/^\/showroom\/([^/]+)\/?$/)
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

function youtubeEmbedUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl?.trim()) return null
  try {
    const url = new URL(rawUrl.trim())
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host.includes('youtube.com')) {
      const id = url.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      const parts = url.pathname.split('/').filter(Boolean)
      if (parts[0] === 'embed' && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`
      }
      if (parts[0] === 'shorts' && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`
      }
    }
  } catch {
    return null
  }
  return null
}

function extractEstablishment(candidate: {
  residenceCountry?: string | null
  description?: string | null
}): string {
  const match = candidate.description?.match(
    /Établissement d['']origine\s*:\s*(.+)/i,
  )
  const fromDescription = match?.[1]?.trim().split('\n')[0]?.trim()
  if (fromDescription) return fromDescription
  return candidate.residenceCountry?.trim() || '—'
}

function cleanDescription(description: string | null | undefined): string {
  if (!description?.trim()) return ''
  return description
    .replace(/\n\nÉtablissement d['']origine\s*:\s*.+$/im, '')
    .trim()
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function CandidateShowroomPage() {
  const candidateId = parseShowroomCandidateIdFromPath()

  const candidateQuery = useQuery({
    queryKey: candidateId
      ? emissionQueryKeys.candidate(candidateId)
      : ['candidate', 'none'],
    queryFn: () => emissionRequest.getCandidateById(candidateId as string),
    enabled: Boolean(candidateId),
    staleTime: 30_000,
    retry: (failureCount, error) => {
      if (ApiHttpError.isInstance(error) && (error.status === 404 || error.status === 429)) {
        return false
      }
      return failureCount < 1
    },
    refetchOnWindowFocus: false,
  })

  const candidate = candidateQuery.data?.data

  const displayName = useMemo(() => {
    if (!candidate) return ''
    return (
      [candidate.candidatePreName, candidate.candidateName]
        .filter(Boolean)
        .join(' ')
        .trim() ||
      [candidate.user?.firstName, candidate.user?.lastName]
        .filter(Boolean)
        .join(' ')
        .trim() ||
      candidate.user?.pseudo ||
      'Candidat'
    )
  }, [candidate])

  const embedUrl = youtubeEmbedUrl(candidate?.video?.url)
  const bio = cleanDescription(candidate?.description)
  const school = candidate ? extractEstablishment(candidate) : '—'

  if (!candidateId) {
    return (
      <main className="showroom-page showroom-page--empty">
        <div className="showroom-page__inner">
          <h1>Showroom</h1>
          <p>Lien candidat invalide.</p>
          <a href="/competition" className="showroom-page__back">
            ← Retour à la compétition
          </a>
        </div>
      </main>
    )
  }

  if (candidateQuery.isLoading) {
    return (
      <main className="showroom-page showroom-page--empty">
        <div className="showroom-page__inner">
          <p>Chargement du profil…</p>
        </div>
      </main>
    )
  }

  if (candidateQuery.isError || !candidate) {
    return (
      <main className="showroom-page showroom-page--empty">
        <div className="showroom-page__inner">
          <h1>Candidat introuvable</h1>
          <p>Ce profil n&apos;existe pas ou n&apos;est plus disponible.</p>
          <a href="/competition" className="showroom-page__back">
            ← Retour à la compétition
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="showroom-page" aria-labelledby="showroom-title">
      <div className="showroom-page__inner">
        <a href="/competition" className="showroom-page__back">
          ← Retour à la compétition
        </a>

        <header className="showroom-page__hero">
          <img
            className="showroom-page__photo"
            src={candidate.candidatePicture}
            alt={displayName}
          />
          <div className="showroom-page__hero-copy">
            <p className="showroom-page__eyebrow">Showroom</p>
            <h1 id="showroom-title">{displayName}</h1>
            {candidate.user?.pseudo ? (
              <p className="showroom-page__pseudo">@{candidate.user.pseudo}</p>
            ) : null}
            <p className="showroom-page__edition">
              {candidate.edition?.title ?? 'Édition en cours'}
            </p>
            <div className="showroom-page__chips">
              {candidate.category?.name ? (
                <span className="showroom-page__chip">{candidate.category.name}</span>
              ) : null}
              {candidate.tag?.name ? (
                <span className="showroom-page__chip showroom-page__chip--accent">
                  {candidate.tag.name}
                </span>
              ) : null}
              {candidate.isFinalist ? (
                <span className="showroom-page__chip showroom-page__chip--finalist">
                  Finaliste
                </span>
              ) : null}
            </div>
          </div>
        </header>

        <section className="showroom-page__section" aria-labelledby="showroom-about">
          <h2 id="showroom-about">Présentation</h2>
          <p className="showroom-page__bio">
            {bio || 'Aucune présentation renseignée.'}
          </p>
          <dl className="showroom-page__meta">
            <div>
              <dt>Âge</dt>
              <dd>{candidate.age ?? '—'}</dd>
            </div>
            <div>
              <dt>Nationalité</dt>
              <dd>{candidate.countryName ?? '—'}</dd>
            </div>
            <div>
              <dt>Établissement d&apos;origine</dt>
              <dd>{school}</dd>
            </div>
            <div>
              <dt>Statut</dt>
              <dd>{candidate.status}</dd>
            </div>
          </dl>
        </section>

        <section className="showroom-page__section" aria-labelledby="showroom-video">
          <h2 id="showroom-video">Vidéo de présentation</h2>
          {embedUrl ? (
            <div className="showroom-page__video-frame">
              <iframe
                title={candidate.video?.title || `Vidéo de ${displayName}`}
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : candidate.video?.url ? (
            <p>
              <a
                href={candidate.video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="showroom-page__external"
              >
                Voir la vidéo
              </a>
            </p>
          ) : (
            <p className="showroom-page__empty-note">Aucune vidéo disponible.</p>
          )}
          {candidate.video ? (
            <dl className="showroom-page__meta showroom-page__meta--compact">
              <div>
                <dt>Titre</dt>
                <dd>{candidate.video.title}</dd>
              </div>
              <div>
                <dt>Durée</dt>
                <dd>{formatDuration(candidate.video.duration)}</dd>
              </div>
              <div>
                <dt>Vues</dt>
                <dd>{candidate.video.views?.toLocaleString('fr-FR') ?? '—'}</dd>
              </div>
            </dl>
          ) : null}
        </section>

        <section className="showroom-page__section" aria-labelledby="showroom-stats">
          <h2 id="showroom-stats">Résultats</h2>
          <ul className="showroom-page__stats">
            <li>
              <span>Votes</span>
              <strong>{candidate.totalVotes.toLocaleString('fr-FR')}</strong>
            </li>
            <li>
              <span>Votes finaliste</span>
              <strong>
                {(candidate.finalistVotes ?? 0).toLocaleString('fr-FR')}
              </strong>
            </li>
            <li>
              <span>Points quiz</span>
              <strong>
                {(candidate.quizPoints ?? 0).toLocaleString('fr-FR')}
              </strong>
            </li>
            <li>
              <span>Total points</span>
              <strong>
                {(candidate.totalPoints ?? 0).toLocaleString('fr-FR')}
              </strong>
            </li>
          </ul>
        </section>

        {candidate.edition?.sponsors && candidate.edition.sponsors.length > 0 ? (
          <section
            className="showroom-page__section"
            aria-labelledby="showroom-sponsors"
          >
            <h2 id="showroom-sponsors">Partenaires de l&apos;édition</h2>
            <ul className="showroom-page__sponsors">
              {candidate.edition.sponsors.map((sponsor) => (
                <li key={sponsor.name}>
                  {sponsor.websiteUrl ? (
                    <a
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="showroom-page__sponsor"
                      title={sponsor.name}
                    >
                      <img
                        src={sponsor.logoUrl || '/logo-worldskills.svg'}
                        alt={sponsor.name}
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <div className="showroom-page__sponsor" title={sponsor.name}>
                      <img
                        src={sponsor.logoUrl || '/logo-worldskills.svg'}
                        alt={sponsor.name}
                        loading="lazy"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="showroom-page__cta-row">
          <a
            className="showroom-page__cta showroom-page__cta--disabled"
            href={`/vote/${candidate.id}`}
            aria-disabled="true"
            tabIndex={-1}
            onClick={(event) => event.preventDefault()}
          >
            Noter
          </a>
          <a className="showroom-page__cta showroom-page__cta--secondary" href="/competition">
            Voir les métiers
          </a>
        </div>
      </div>
    </main>
  )
}
