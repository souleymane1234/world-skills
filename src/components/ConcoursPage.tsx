import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  CURRENT_EDITION_YEAR,
  EDITION_NAV_YEARS,
  getEditionByYear,
} from '../data/editions'
import { getAuthEventName, isCandidateLoggedIn } from '../lib/candidate-auth'
import { getAuthUser } from '../lib/auth-session'
import {
  getSkillImageCandidates,
  SKILL_CATEGORY_LABELS,
  SKILLS,
  type SkillCategory,
} from '../data/skills'
import {
  useActiveEdition,
  useEmissionCategories,
} from '../hooks/use-emission-queries'
import { ApiHttpError, type VotePaymentProvider } from '../lib/api'
import { emissionRequest } from '../lib/emission-request'
import { countriesApi, uploadsApi } from '../services/api-client'
import { PromoBanner } from './PromoBanner'
import { SectionBridge } from './SectionBridge'
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

const MOBILE_OPERATORS = [
  { id: 'mtn', label: 'MTN Money', logo: '/mtn.jpg', provider: 'MTN' as VotePaymentProvider },
  { id: 'moov', label: 'Moov Money', logo: '/moov.png', provider: 'MOOV' as VotePaymentProvider },
  { id: 'wave', label: 'Wave', logo: '/wave.png', provider: 'WAVE' as VotePaymentProvider },
  {
    id: 'orange',
    label: 'Orange Money',
    logo: '/orange.png',
    provider: 'ORANGE' as VotePaymentProvider,
  },
] as const

type OperatorId = (typeof MOBILE_OPERATORS)[number]['id']

const CRITERES = [
  'Être apprenant d\'un établissement de formation professionnelle agréé.',
  'Avoir entre 15 et 35 ans (règlement WorldSkills International).',
  'Être sélectionné via les présélections régionales officielles.',
  'Maîtriser la discipline inscrite et respecter le règlement technique.',
] as const

const PAST_EDITION_YEARS = EDITION_NAV_YEARS.filter(
  (year) => year !== CURRENT_EDITION_YEAR,
)

export function ConcoursPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [pastEditionYear, setPastEditionYear] = useState<number | null>(null)
  const [applyOpen, setApplyOpen] = useState(false)
  const [applyVideo, setApplyVideo] = useState<File | null>(null)
  const [applyPicture, setApplyPicture] = useState<File | null>(null)
  const [applyDocs, setApplyDocs] = useState<File[]>([])
  const [applyCategoryId, setApplyCategoryId] = useState('')
  const [applyTagId, setApplyTagId] = useState('')
  const [applyOperator, setApplyOperator] = useState<OperatorId>('mtn')
  const [applySubmitting, setApplySubmitting] = useState(false)
  const [applyError, setApplyError] = useState<string | null>(null)
  const [applySuccessOpen, setApplySuccessOpen] = useState(false)
  const [applySuccessPayment, setApplySuccessPayment] = useState(false)
  const [selectedMetier, setSelectedMetier] = useState<{
    categoryId: string
    categoryName: string
    tagId: string
    tagName: string
    imageUrl?: string | null
  } | null>(null)
  const [candidateLoggedIn, setCandidateLoggedIn] = useState(() => isCandidateLoggedIn())
  const authUser = useMemo(() => (candidateLoggedIn ? getAuthUser() : null), [candidateLoggedIn])
  const pastEdition = pastEditionYear ? getEditionByYear(pastEditionYear) : null

  const activeEditionQuery = useActiveEdition()
  const editionId = activeEditionQuery.data?.id ?? null
  const categoriesQuery = useEmissionCategories(editionId)
  const apiCategories = categoriesQuery.data ?? []
  const useApiReferentiel = apiCategories.length > 0

  const countriesQuery = useQuery({
    queryKey: ['countries', 'list', { activeOnly: true }],
    queryFn: async () => {
      const res = await countriesApi.list({ activeOnly: true })
      return (res.data ?? []).filter((entry) => entry.active !== false)
    },
    enabled: applyOpen && candidateLoggedIn,
    staleTime: 10 * 60_000,
    refetchOnWindowFocus: false,
  })

  const nationalityOptions = useMemo(
    () =>
      (countriesQuery.data ?? [])
        .filter((entry) => entry.code != null && entry.code !== '')
        .sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    [countriesQuery.data],
  )

  const establishmentOptions = useMemo(
    () =>
      (countriesQuery.data ?? [])
        .filter((entry) => entry.code == null || entry.code === '')
        .sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    [countriesQuery.data],
  )

  const applyEdition = activeEditionQuery.data
  const candidaturePrice = applyEdition?.candidaturePrice ?? null
  const isPaidEdition = Boolean(
    applyEdition?.isPaidEdition ||
      (typeof candidaturePrice === 'number' && candidaturePrice > 0),
  )
  const requireDocuments = Boolean(applyEdition?.requireDocuments)
  const hasApplied = Boolean(
    applyEdition && 'hasApplied' in applyEdition
      ? applyEdition.hasApplied
      : false,
  )
  const applicationStatus =
    applyEdition && 'applicationStatus' in applyEdition
      ? applyEdition.applicationStatus
      : null

  const applicationStatusNotice = useMemo(() => {
    if (!hasApplied) return null
    if (applicationStatus === 'VALIDE') {
      return 'Votre candidature a déjà été acceptée pour cette édition.'
    }
    if (applicationStatus === 'REFUSEE') {
      return 'Votre candidature pour cette édition a été refusée.'
    }
    return 'Vous avez déjà candidaté. Votre candidature est en cours d’examen.'
  }, [hasApplied, applicationStatus])

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
  const apiEditionDescription =
    activeEditionQuery.data && 'description' in activeEditionQuery.data
      ? activeEditionQuery.data.description?.trim()
      : null
  const apiSponsors =
    activeEditionQuery.data && 'sponsors' in activeEditionQuery.data
      ? activeEditionQuery.data.sponsors ?? []
      : []

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const closeApply = useCallback(() => {
    setApplyOpen(false)
    setApplyVideo(null)
    setApplyPicture(null)
    setApplyDocs([])
    setApplyCategoryId('')
    setApplyTagId('')
    setApplyOperator('mtn')
    setApplyError(null)
    setApplySubmitting(false)
  }, [])
  const closeApplySuccess = useCallback(() => {
    setApplySuccessOpen(false)
    setApplySuccessPayment(false)
  }, [])

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

  const formatBytes = useCallback((bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 octet'
    const units = ['octets', 'Ko', 'Mo', 'Go'] as const
    const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
    const value = bytes / 1024 ** i
    return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
  }, [])

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

  const tagsForSelectedCategory = useMemo(() => {
    if (useApiReferentiel) {
      const category = apiCategories.find((item) => item.id === applyCategoryId)
      return category?.tags ?? []
    }
    if (!applyCategoryId) return []
    return SKILLS.filter((skill) => skill.category === applyCategoryId).map((skill) => ({
      id: skill.id,
      name: skill.name,
    }))
  }, [useApiReferentiel, apiCategories, applyCategoryId])

  const categoryOptions = useMemo(() => {
    if (useApiReferentiel) {
      return apiCategories.map((category) => ({
        id: category.id,
        name: category.name,
      }))
    }
    return (Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[]).map((cat) => ({
      id: cat,
      name: SKILL_CATEGORY_LABELS[cat],
    }))
  }, [useApiReferentiel, apiCategories])

  const referentielLoading =
    applyOpen &&
    (activeEditionQuery.isLoading || categoriesQuery.isLoading) &&
    !useApiReferentiel
  const referentielError =
    applyOpen &&
    !useApiReferentiel &&
    (activeEditionQuery.isError || categoriesQuery.isError)

  useEffect(() => {
    if (!applyOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeApply()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [applyOpen, closeApply])

  useEffect(() => {
    if (!applySuccessOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeApplySuccess()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [applySuccessOpen, closeApplySuccess])

  useEffect(() => {
    const onAuthChanged = () => {
      setCandidateLoggedIn(isCandidateLoggedIn())
      void activeEditionQuery.refetch()
    }
    window.addEventListener(getAuthEventName(), onAuthChanged)
    window.addEventListener('storage', onAuthChanged)
    return () => {
      window.removeEventListener(getAuthEventName(), onAuthChanged)
      window.removeEventListener('storage', onAuthChanged)
    }
  }, [activeEditionQuery.refetch])

  return (
    <main className="concours-page concours-page--nav-offset" aria-labelledby="competition-title">
      <PromoBanner
        showCta={!selectedMetier && !hasApplied}
        ctaLabel="Soumettre ma candidature"
        ctaOnClick={() => setApplyOpen(true)}
        criteria={selectedMetier ? undefined : CRITERES}
        statusNotice={
          !selectedMetier && applicationStatusNotice
            ? applicationStatusNotice
            : null
        }
      >
        {selectedMetier ? (
          <div className="site-promo-banner__metier-meta">
            <p className="site-promo-banner__metier-domain">
              {selectedMetier.categoryName}
            </p>
            <p className="site-promo-banner__metier-name">
              {selectedMetier.tagName}
            </p>
          </div>
        ) : null}
      </PromoBanner>
      <SectionBridge variant="ribbon" />

      <section id="competition" className="concours-page__stack">
        <section className="concours-page__section concours-page__hero">
          <div className="concours-page__inner">
            {!selectedMetier ? (
              <>
                <p className="concours-page__eyebrow">Compétition</p>
                <h1 id="competition-title">
                  {apiEditionTitle
                    ? apiEditionTitle
                    : 'WorldSkills Côte d\'Ivoire 2026'}
                </h1>
                <p className="concours-page__lead">
                  {apiEditionDescription
                    ? apiEditionDescription
                    : '6ᵉ édition des Olympiades des métiers : 25 disciplines, 1500+ compétiteurs avec candidature en ligne, puis formation et compétition menant à la sélection de 300 candidats retenus. Un rendez-vous national autour du thème « FORMATION – INNOVATION – EMPLOYABILITE DES JEUNES ».'}
                </p>

                <section
                  className="concours-page__partners-before-metiers"
                  aria-label="Partenaires de l'édition"
                >
                  <h2>Partenaires de l&apos;édition</h2>
                  {apiSponsors.length > 0 ? (
                    <ul className="concours-page__sponsors-strip">
                      {apiSponsors.map((sponsor) => (
                        <li key={sponsor.name}>
                          {sponsor.websiteUrl ? (
                            <a
                              href={sponsor.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="concours-page__sponsor-logo"
                              title={sponsor.name}
                            >
                              <img
                                src={sponsor.logoUrl || '/logo-worldskills.svg'}
                                alt={sponsor.name}
                                loading="lazy"
                              />
                            </a>
                          ) : (
                            <div
                              className="concours-page__sponsor-logo"
                              title={sponsor.name}
                            >
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
                  ) : (
                    <ul className="concours-page__sponsors-strip">
                      {Array.from({ length: 10 }, (_, i) => (
                        <li key={`port-${i + 1}`}>
                          <div className="concours-page__sponsor-logo">
                            <img
                              src={`/trustCaroussel/port-${i + 1}.png`}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            ) : (
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
                      <p>
                        {competitionCategories.reduce(
                          (sum, category) => sum + category.tags.length,
                          0,
                        )}{' '}
                        disciplines
                      </p>
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
                              {category.tags.map((tag) => {
                                const count = apiCandidates.filter(
                                  (candidate) => candidate.tag?.id === tag.id,
                                ).length
                                return (
                                  <button
                                    key={tag.id}
                                    type="button"
                                    className="metiers-page__card concours-page__metier-card"
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

        {applyOpen && (
          <div
            className="concours-page__modal"
            role="dialog"
            aria-modal="true"
            aria-label="Soumettre ma candidature"
            onClick={closeApply}
          >
            <div
              className="concours-page__modal-card"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="concours-page__modal-header">
                <h2>Soumettre ma candidature</h2>
                <button
                  type="button"
                  className="concours-page__modal-close"
                  onClick={closeApply}
                  aria-label="Fermer"
                >
                  ×
                </button>
              </div>
              {candidateLoggedIn ? (
                hasApplied ? (
                  <div className="concours-page__auth-gate">
                    <p>
                      Vous avez déjà candidaté. Votre candidature est en cours
                      d&apos;examen.
                    </p>
                    <div className="concours-page__modal-actions">
                      <button type="button" className="concours-page__modal-btn" onClick={closeApply}>
                        Fermer
                      </button>
                    </div>
                  </div>
                ) : (
                <form
                  className="concours-page__modal-form"
                  onSubmit={async (event) => {
                    event.preventDefault()
                    if (!editionId) {
                      setApplyError("Édition active introuvable. Réessayez dans un instant.")
                      return
                    }
                    if (!useApiReferentiel) {
                      setApplyError(
                        'Le référentiel des métiers est indisponible. Impossible de candidater pour le moment.',
                      )
                      return
                    }
                    if (!applyVideo) {
                      setApplyError('Une vidéo de candidature est obligatoire.')
                      return
                    }
                    if (!applyPicture) {
                      setApplyError('Une photo de candidat est obligatoire.')
                      return
                    }

                    const fd = new FormData(event.currentTarget)
                    const candidateName = String(fd.get('candidateName') ?? '').trim()
                    const candidatePreName = String(fd.get('candidatePreName') ?? '').trim()
                    const age = String(fd.get('age') ?? '').trim()
                    const schoolId = String(fd.get('school') ?? '').trim()
                    const description = String(fd.get('description') ?? '').trim()
                    const countryId = String(fd.get('countryId') ?? '').trim()
                    const categoryId = String(fd.get('categoryId') ?? applyCategoryId).trim()
                    const tagId = String(fd.get('tagId') ?? applyTagId).trim()
                    const phoneRaw = String(fd.get('phoneNumber') ?? '')
                    const phoneNumber = phoneRaw.replace(/\D/g, '')
                    const otp = String(fd.get('otp') ?? '').trim()
                    const schoolName =
                      establishmentOptions.find((item) => item.id === schoolId)?.name ?? ''
                    const pseudo =
                      `${candidatePreName}.${candidateName}`
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase()
                        .replace(/[^a-z0-9.]+/g, '')
                        .replace(/^\.+|\.+$/g, '') || `candidat${Date.now().toString(36)}`
                    const fullDescription = schoolName
                      ? `${description}\n\nÉtablissement d'origine : ${schoolName}`
                      : description

                    if (
                      !candidateName ||
                      !candidatePreName ||
                      !age ||
                      !description ||
                      !schoolId
                    ) {
                      setApplyError('Veuillez remplir tous les champs obligatoires.')
                      return
                    }
                    if (!countryId || !categoryId || !tagId) {
                      setApplyError('Nationalité, catégorie et métier sont obligatoires.')
                      return
                    }
                    if (isPaidEdition) {
                      if (!phoneNumber) {
                        setApplyError('Numéro de téléphone requis pour le paiement.')
                        return
                      }
                      if (applyOperator === 'orange' && !otp) {
                        setApplyError('Le code OTP Orange Money est requis.')
                        return
                      }
                    }

                    setApplySubmitting(true)
                    setApplyError(null)
                    try {
                      const [videoRes, pictureRes] = await Promise.all([
                        uploadsApi.uploadVideo(applyVideo),
                        uploadsApi.uploadImage(applyPicture),
                      ])
                      const videoId = videoRes.data?.id
                      const pictureUrl = pictureRes.data?.url
                      if (!videoId) throw new Error('Échec de l’upload vidéo.')
                      if (!pictureUrl) throw new Error('Échec de l’upload photo.')

                      let documentUrls: string[] | undefined
                      if (requireDocuments && applyDocs.length > 0) {
                        const uploaded = await Promise.all(
                          applyDocs.map((file) => uploadsApi.uploadFile(file)),
                        )
                        documentUrls = uploaded
                          .map((item) => item.data?.url)
                          .filter((url): url is string => Boolean(url))
                      }

                      const provider = MOBILE_OPERATORS.find((op) => op.id === applyOperator)
                        ?.provider

                      const res = await emissionRequest.applyToEdition(editionId, {
                        pseudo,
                        candidateName,
                        candidatePreName,
                        age,
                        candidatePicture: pictureUrl,
                        description: fullDescription,
                        videoId,
                        countryId,
                        residenceCountryId: schoolId,
                        categoryId,
                        tagId,
                        ...(documentUrls?.length ? { documentUrls } : {}),
                        ...(isPaidEdition && provider
                          ? {
                              provider,
                              phoneNumber,
                              ...(applyOperator === 'orange' && otp ? { otp } : {}),
                            }
                          : {}),
                      })

                      const payUrl = res.payment?.paymentUrl?.trim()
                      if (payUrl) {
                        window.open(payUrl, '_blank', 'noopener,noreferrer')
                      }

                      closeApply()
                      setApplySuccessPayment(Boolean(res.payment))
                      setApplySuccessOpen(true)
                      void activeEditionQuery.refetch()
                    } catch (error) {
                      setApplyError(
                        ApiHttpError.isInstance(error)
                          ? error.message
                          : error instanceof Error
                            ? error.message
                            : 'Impossible de soumettre la candidature.',
                      )
                    } finally {
                      setApplySubmitting(false)
                    }
                  }}
                >
                  <div className="concours-page__modal-body">
                    <section className="concours-page__modal-section">
                      <h3 className="concours-page__modal-section-title">Identité</h3>
                      <div className="concours-page__modal-grid">
                        <label>
                          Nom
                          <input
                            name="candidateName"
                            required
                            autoComplete="family-name"
                            defaultValue={authUser?.lastName ?? ''}
                            placeholder="Ex : Koné"
                          />
                        </label>
                        <label>
                          Prénom
                          <input
                            name="candidatePreName"
                            required
                            autoComplete="given-name"
                            defaultValue={authUser?.firstName ?? ''}
                            placeholder="Ex : Aminata"
                          />
                        </label>
                        <label>
                          Date de naissance
                          <input name="age" type="date" required />
                        </label>
                        <label>
                          Établissement d&apos;origine
                          <select
                            name="school"
                            required
                            defaultValue=""
                            disabled={countriesQuery.isLoading}
                          >
                            <option value="" disabled>
                              {countriesQuery.isLoading
                                ? 'Chargement…'
                                : establishmentOptions.length === 0
                                  ? 'Aucun établissement disponible'
                                  : 'Choisir un établissement'}
                            </option>
                            {establishmentOptions.map((school) => (
                              <option key={school.id} value={school.id}>
                                {school.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Nationalité
                          <select
                            name="countryId"
                            required
                            defaultValue=""
                            disabled={countriesQuery.isLoading}
                          >
                            <option value="" disabled>
                              {countriesQuery.isLoading ? 'Chargement…' : 'Choisir une nationalité'}
                            </option>
                            {nationalityOptions.map((country) => (
                              <option key={country.id} value={country.id}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Catégorie
                          <select
                            name="categoryId"
                            required
                            value={applyCategoryId}
                            disabled={referentielLoading}
                            onChange={(event) => {
                              setApplyCategoryId(event.currentTarget.value)
                              setApplyTagId('')
                            }}
                          >
                            <option value="" disabled>
                              {referentielLoading
                                ? 'Chargement des catégories…'
                                : 'Choisir une catégorie'}
                            </option>
                            {categoryOptions.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="concours-page__modal-span-2">
                          Métier
                          <select
                            name="tagId"
                            required
                            value={applyTagId}
                            onChange={(event) => setApplyTagId(event.currentTarget.value)}
                            disabled={!applyCategoryId || referentielLoading}
                          >
                            <option value="" disabled>
                              {applyCategoryId
                                ? 'Choisir un métier'
                                : 'Choisir une catégorie d’abord'}
                            </option>
                            {tagsForSelectedCategory.map((tag) => (
                              <option key={tag.id} value={tag.id}>
                                {tag.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      {referentielError ? (
                        <p className="concours-page__modal-error">
                          Référentiel API indisponible — la candidature nécessite les IDs
                          officiels.
                        </p>
                      ) : null}
                    </section>

                    <section className="concours-page__modal-section">
                      <h3 className="concours-page__modal-section-title">Présentation</h3>
                      <label>
                        Message
                        <textarea
                          name="description"
                          rows={3}
                          required
                          placeholder="Présentez brièvement votre profil et votre motivation."
                        />
                      </label>
                      <div className="concours-page__modal-media-grid">
                        <label
                          className={`concours-page__modal-upload-drop${
                            applyPicture ? ' concours-page__modal-upload-drop--filled' : ''
                          }`}
                        >
                          <input
                            type="file"
                            name="candidatePicture"
                            accept="image/*"
                            required
                            onChange={(event) => {
                              setApplyPicture(event.currentTarget.files?.[0] ?? null)
                            }}
                          />
                          <span className="concours-page__modal-upload-title">
                            {applyPicture ? applyPicture.name : 'Photo'}
                          </span>
                          <span className="concours-page__modal-upload-hint">
                            {applyPicture ? formatBytes(applyPicture.size) : 'JPG / PNG'}
                          </span>
                        </label>

                        <label
                          className={`concours-page__modal-upload-drop${
                            applyVideo ? ' concours-page__modal-upload-drop--filled' : ''
                          }`}
                        >
                          <input
                            type="file"
                            name="candidateVideo"
                            accept="video/*"
                            required
                            onChange={(event) => {
                              setApplyVideo(event.currentTarget.files?.[0] ?? null)
                            }}
                          />
                          <span className="concours-page__modal-upload-title">
                            {applyVideo ? applyVideo.name : 'Vidéo'}
                          </span>
                          <span className="concours-page__modal-upload-hint">
                            {applyVideo ? formatBytes(applyVideo.size) : 'MP4 / MOV'}
                          </span>
                        </label>
                      </div>

                      {requireDocuments ? (
                        <div className="concours-page__modal-docs">
                          <p className="concours-page__modal-docs-label">
                            Documents justificatifs
                          </p>
                          <label className="concours-page__modal-upload-drop">
                            <input
                              type="file"
                              name="documents"
                              multiple
                              accept="image/*,application/pdf"
                              onChange={(event) => {
                                setApplyDocs(Array.from(event.currentTarget.files ?? []))
                              }}
                            />
                            <span className="concours-page__modal-upload-title">
                              Joindre des documents
                            </span>
                            <span className="concours-page__modal-upload-hint">
                              PDF ou images
                            </span>
                          </label>
                          {applyDocs.length > 0 && (
                            <ul className="concours-page__modal-filelist" aria-label="Documents">
                              {applyDocs.map((file) => (
                                <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                                  <span className="concours-page__modal-filename">
                                    {file.name}
                                  </span>
                                  <span className="concours-page__modal-filesize">
                                    {formatBytes(file.size)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : null}
                    </section>

                    {isPaidEdition ? (
                      <section className="concours-page__modal-section concours-page__modal-section--payment">
                        <h3 className="concours-page__modal-section-title">
                          Paiement — {(candidaturePrice ?? 0).toLocaleString('fr-FR')} F CFA
                        </h3>
                        <fieldset className="concours-page__modal-operators">
                          <legend className="visually-hidden">Opérateur</legend>
                          <div className="concours-page__modal-operators-grid">
                            {MOBILE_OPERATORS.map((op) => (
                              <label
                                key={op.id}
                                className={`concours-page__modal-operator${
                                  applyOperator === op.id
                                    ? ' concours-page__modal-operator--active'
                                    : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="providerUi"
                                  value={op.id}
                                  checked={applyOperator === op.id}
                                  onChange={() => setApplyOperator(op.id)}
                                />
                                <img src={op.logo} alt="" width={22} height={22} />
                                <span>{op.label}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <div className="concours-page__modal-grid">
                          <label>
                            Téléphone Mobile Money
                            <input
                              name="phoneNumber"
                              required
                              inputMode="tel"
                              autoComplete="tel"
                              placeholder="Ex : 0700000000"
                            />
                          </label>
                          {applyOperator === 'orange' ? (
                            <label>
                              OTP Orange Money
                              <input name="otp" required placeholder="Code reçu par SMS" />
                            </label>
                          ) : null}
                        </div>
                        {applyOperator === 'orange' ? (
                          <p className="concours-page__modal-hint">
                            Orange Money peut demander un OTP. Pour un paiement plus fluide,
                            privilégiez Moov, MTN ou Wave.
                          </p>
                        ) : null}
                      </section>
                    ) : null}
                  </div>

                  <div className="concours-page__modal-footer">
                    {applyError ? (
                      <p className="concours-page__modal-error" role="alert">
                        {applyError}
                      </p>
                    ) : null}
                    <div className="concours-page__modal-actions">
                      <button
                        type="button"
                        className="concours-page__modal-btn"
                        onClick={closeApply}
                        disabled={applySubmitting}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="concours-page__modal-btn concours-page__modal-btn--primary"
                        disabled={applySubmitting || referentielLoading || !editionId}
                      >
                        {applySubmitting
                          ? 'Envoi en cours…'
                          : isPaidEdition
                            ? 'Payer et candidater'
                            : 'Envoyer ma candidature'}
                      </button>
                    </div>
                  </div>
                </form>
                )
              ) : (
                <div className="concours-page__auth-gate">
                  <p>
                    Vous devez créer un compte candidat et vous connecter avant de candidater.
                  </p>
                  <div className="concours-page__modal-actions">
                    <a href="/connexion" className="concours-page__modal-btn concours-page__modal-btn--primary">
                      Créer un compte / Se connecter
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {applySuccessOpen && (
          <div
            className="concours-page__modal"
            role="dialog"
            aria-modal="true"
            aria-label="Candidature envoyée"
            onClick={closeApplySuccess}
          >
            <div
              className="concours-page__success-card"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="concours-page__success-icon" aria-hidden="true">
                🎉
              </div>
              <h2 className="concours-page__success-title">Candidature envoyée !</h2>
              <p className="concours-page__success-text">
                {applySuccessPayment
                  ? 'Votre candidature a été enregistrée et le paiement a été initié. Finalisez le règlement dans la fenêtre Mobile Money si elle s’est ouverte.'
                  : 'Merci, nous avons bien reçu votre demande. Votre vidéo reste en attente jusqu’à validation par l’organisation.'}
              </p>
              <div className="concours-page__success-actions">
                <button
                  type="button"
                  className="concours-page__modal-btn concours-page__modal-btn--primary"
                  onClick={closeApplySuccess}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

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
    </main>
  )
}
