import { useCallback, useEffect, useState } from 'react'
import {
  CURRENT_EDITION_YEAR,
  EDITION_NAV_YEARS,
  getEditionByYear,
} from '../data/editions'
import { getAuthEventName, isCandidateLoggedIn } from '../lib/candidate-auth'
import { SKILL_CATEGORY_LABELS, SKILLS, type SkillCategory } from '../data/skills'
import { HeroVideo } from './HeroVideo'
import { PromoBanner } from './PromoBanner'
import { SectionBridge } from './SectionBridge'
import { PartnersTrustCarousel } from './PartnersTrustCarousel'
import './ConcoursPage.css'

const ETAPES = [
  {
    titre: 'Candidatures en ligne',
    periode: 'Phase 1',
    details:
      '1500 candidats sont sélectionnés et soumettent leur candidature via le formulaire en ligne officiel.',
  },
  {
    titre: 'Formation préparatoire',
    periode: 'Phase 2',
    details:
      'Les candidats retenus suivent une formation technique et professionnelle encadrée par les équipes pédagogiques.',
  },
  {
    titre: 'Compétition et évaluation',
    periode: 'Phase 3',
    details:
      'Une compétition nationale est organisée par domaine pour évaluer les performances selon les standards WorldSkills.',
  },
  {
    titre: 'Sélection finale',
    periode: 'Phase finale',
    details:
      'Au terme du processus, 300 candidats sont retenus pour la suite du parcours et les phases finales.',
  },
] as const

const CRITERES = [
  'Être apprenant d\'un établissement de formation professionnelle agréé.',
  'Avoir entre 15 et 35 ans (règlement WorldSkills International).',
  'Être sélectionné via les présélections régionales officielles.',
  'Maîtriser la discipline inscrite et respecter le règlement technique.',
] as const

const FAQ = [
  {
    question: 'Comment un compétiteurs s\'inscrit-il ?',
    reponse:
      'Les candidats remplissent d’abord le formulaire officiel en ligne, puis leur dossier est validé par l’organisation.',
  },
  {
    question: 'Que se passe-t-il après la candidature en ligne ?',
    reponse:
      'Une phase de formation est organisée, suivie de la compétition nationale par domaine professionnel.',
  },
  {
    question: 'Combien de candidats sont retenus à la fin ?',
    reponse:
      'Au total, 300 candidats sont retenus à l’issue du processus de formation et de compétition.',
  },
] as const

const DEROULEMENT_FINALE = [
  {
    titre: 'Team Building',
    date: 'Samedi précédant les activités',
    horaire: '08h30 à 11h30',
    points: ['Cohésion d’équipe', 'Brief technique', 'Mise en condition des candidats'],
  },
  {
    titre: 'Activités principales',
    date: 'Du 02 au 04 octobre 2026',
    points: [
      'Compétitions techniques',
      'Expositions',
      'Démonstrations',
      'Ventes',
      'Échanges professionnels',
    ],
  },
  {
    titre: 'Gala et remise des prix',
    date: '04 octobre 2026',
    points: ['Distinctions', 'Récompenses', 'Clôture officielle'],
  },
] as const

export function ConcoursPage() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_EDITION_YEAR)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [applyOpen, setApplyOpen] = useState(false)
  const [applyFiles, setApplyFiles] = useState<File[]>([])
  const [applyCategory, setApplyCategory] = useState<SkillCategory | ''>('')
  const [applySkillId, setApplySkillId] = useState('')
  const [applySuccessOpen, setApplySuccessOpen] = useState(false)
  const [candidateLoggedIn, setCandidateLoggedIn] = useState(() => isCandidateLoggedIn())
  const edition = getEditionByYear(selectedYear)
  const isCurrentEditionSelected = selectedYear === CURRENT_EDITION_YEAR

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const closeApply = useCallback(() => {
    setApplyOpen(false)
    setApplyFiles([])
    setApplyCategory('')
    setApplySkillId('')
  }, [])
  const closeApplySuccess = useCallback(() => setApplySuccessOpen(false), [])

  const formatBytes = useCallback((bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 octet'
    const units = ['octets', 'Ko', 'Mo', 'Go'] as const
    const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
    const value = bytes / 1024 ** i
    return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
  }, [])

  const showPrev = useCallback(() => {
    if (!edition || lightboxIndex === null) return
    setLightboxIndex(
      (lightboxIndex - 1 + edition.galleryPhotos.length) % edition.galleryPhotos.length,
    )
  }, [edition, lightboxIndex])

  const showNext = useCallback(() => {
    if (!edition || lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % edition.galleryPhotos.length)
  }, [edition, lightboxIndex])

  useEffect(() => {
    setLightboxIndex(null)
  }, [selectedYear])

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
    edition && lightboxIndex !== null ? edition.galleryPhotos[lightboxIndex] : null

  const skillsForSelectedCategory = applyCategory
    ? SKILLS.filter((skill) => skill.category === applyCategory)
    : []

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
    const onAuthChanged = () => setCandidateLoggedIn(isCandidateLoggedIn())
    window.addEventListener(getAuthEventName(), onAuthChanged)
    window.addEventListener('storage', onAuthChanged)
    return () => {
      window.removeEventListener(getAuthEventName(), onAuthChanged)
      window.removeEventListener('storage', onAuthChanged)
    }
  }, [])

  return (
    <main className="concours-page" aria-labelledby="competition-title">
      <HeroVideo
        subtitle="Olympiades des métiers 2026"
        title="FORMATION – INNOVATION – EMPLOYABILITE DES JEUNES"
      />
      <PromoBanner
        ctaLabel="Soumettre ma candidature"
        ctaOnClick={() => setApplyOpen(true)}
      />
      <SectionBridge variant="ribbon" />

      <section id="competition" className="concours-page__stack">
        <section className="concours-page__section concours-page__hero">
          <div className="concours-page__inner">
            <p className="concours-page__eyebrow">Compétition</p>
            <h1 id="competition-title">WorldSkills Côte d&apos;Ivoire 2026</h1>
            <p className="concours-page__lead">
              6ᵉ édition des Olympiades des métiers : 25 disciplines, 1500+
              compétiteurs avec candidature en ligne, puis formation et
              compétition menant à la sélection de 300 candidats retenus. Un
              rendez-vous national autour du thème
              « FORMATION – INNOVATION – EMPLOYABILITE DES JEUNES ».
            </p>
            <div
              className="concours-page__actions concours-page__actions--editions"
              role="tablist"
              aria-label="Éditions"
            >
              {EDITION_NAV_YEARS.map((navYear) => {
                const isActive = navYear === selectedYear
                return (
                  <button
                    key={navYear}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="concours-edition-gallery"
                    className={`concours-page__edition-btn${
                      isActive ? ' concours-page__edition-btn--active' : ''
                    }`}
                    onClick={() => setSelectedYear(navYear)}
                  >
                    Édition {navYear}
                  </button>
                )
              })}
            </div>

            {edition && !isCurrentEditionSelected && (
              <div
                id="concours-edition-gallery"
                className="concours-page__gallery"
                role="tabpanel"
                aria-label={`Galerie photo ${edition.year}`}
              >
                <div className="concours-page__gallery-grid">
                  {edition.galleryPhotos.map((photo, index) => (
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
                <form
                  className="concours-page__modal-form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    closeApply()
                    setApplySuccessOpen(true)
                  }}
                >
                  <div className="concours-page__modal-intro">
                    <p className="concours-page__modal-subtitle">
                      Remplissez le formulaire ci-dessous et joignez vos pièces (CV, portfolio, vidéo, etc.).
                    </p>
                    <ul className="concours-page__modal-badges" aria-label="Informations">
                      <li>Édition 2026</li>
                      <li>15–35 ans</li>
                      <li>25 disciplines</li>
                    </ul>
                  </div>

                  <div className="concours-page__modal-grid">
                    <label>
                      Nom & prénoms
                      <input name="fullName" required autoComplete="name" placeholder="Ex : Koné Awa" />
                    </label>
                    <label>
                      Téléphone
                      <input name="phone" required inputMode="tel" autoComplete="tel" placeholder="Ex : 07 00 00 00 00" />
                    </label>
                    <label>
                      Email
                      <input name="email" type="email" required autoComplete="email" placeholder="Ex : awa.kone@email.com" />
                    </label>
                    <label>
                      Établissement
                      <input name="school" required placeholder="Ex : Parc des Expositions d’Abidjan" />
                    </label>
                    <label>
                      Catégorie
                      <select
                        name="category"
                        required
                        value={applyCategory}
                        onChange={(event) => {
                          const next = event.currentTarget.value as SkillCategory | ''
                          setApplyCategory(next)
                          setApplySkillId('')
                        }}
                      >
                        <option value="" disabled>
                          Choisir une catégorie
                        </option>
                        {(Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[]).map((cat) => (
                          <option key={cat} value={cat}>
                            {SKILL_CATEGORY_LABELS[cat]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Métier
                      <select
                        name="skillId"
                        required
                        value={applySkillId}
                        onChange={(event) => setApplySkillId(event.currentTarget.value)}
                        disabled={!applyCategory}
                      >
                        <option value="" disabled>
                          {applyCategory ? 'Choisir un métier' : 'Choisir une catégorie d’abord'}
                        </option>
                        {skillsForSelectedCategory.map((skill) => (
                          <option key={skill.id} value={skill.id}>
                            {skill.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="concours-page__modal-span-2">
                      Message (optionnel)
                      <textarea name="message" rows={4} placeholder="Présentez brièvement votre profil et votre motivation." />
                    </label>
                  </div>

                  <div className="concours-page__modal-upload">
                    <div className="concours-page__modal-upload-head">
                      <h3>Pièces jointes</h3>
                      <p>Formats acceptés : images, vidéos, PDF, PPTX.</p>
                    </div>

                    <label className="concours-page__modal-upload-drop">
                      <input
                        type="file"
                        name="attachments"
                        multiple
                        accept="image/*,video/*,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                        onChange={(event) => {
                          const files = Array.from(event.currentTarget.files ?? [])
                          setApplyFiles(files)
                        }}
                      />
                      <span className="concours-page__modal-upload-title">Glissez-déposez vos fichiers ici</span>
                      <span className="concours-page__modal-upload-hint">ou cliquez pour sélectionner</span>
                    </label>

                    {applyFiles.length > 0 && (
                      <ul className="concours-page__modal-filelist" aria-label="Fichiers sélectionnés">
                        {applyFiles.map((file) => (
                          <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                            <span className="concours-page__modal-filename">{file.name}</span>
                            <span className="concours-page__modal-filesize">{formatBytes(file.size)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="concours-page__modal-actions">
                    <button type="button" className="concours-page__modal-btn" onClick={closeApply}>
                      Annuler
                    </button>
                    <button type="submit" className="concours-page__modal-btn concours-page__modal-btn--primary">
                      Envoyer
                    </button>
                  </div>
                </form>
              ) : (
                <div className="concours-page__auth-gate">
                  <p>
                    Vous devez créer un compte candidat et compléter votre profil avant de candidater.
                  </p>
                  <div className="concours-page__modal-actions">
                    <a href="/connexion" className="concours-page__modal-btn concours-page__modal-btn--primary">
                      Créer un compte / Se connecter
                    </a>
                    <a href="/profil" className="concours-page__modal-btn">
                      Mon profil
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
                Merci, nous avons bien reçu votre demande. Notre équipe vous contactera
                dès que possible pour la suite du processus.
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

        {activePhoto && edition && lightboxIndex !== null && (
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
                {lightboxIndex + 1} / {edition.galleryPhotos.length}
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

        {isCurrentEditionSelected && (
          <>
            <SectionBridge variant="wave" />

            <section className="concours-page__section">
              <div className="concours-page__inner concours-page__inner--wide">
                <h2>Calendrier de la compétition</h2>
                <div className="concours-page__timeline concours-page__timeline--finale-cards">
                  {ETAPES.map((etape) => (
                    <article
                      key={etape.titre}
                      className="concours-page__step concours-page__step--finale-card"
                    >
                      <h3>{etape.titre}</h3>
                      <p className="concours-page__step-date">{etape.periode}</p>
                      <p className="concours-page__step-label">Étape</p>
                      <p>{etape.details}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <SectionBridge variant="ribbon" />

            <section className="concours-page__section">
              <div className="concours-page__inner concours-page__inner--wide">
                <h2>Déroulement de la phase finale</h2>
                <div className="concours-page__timeline concours-page__timeline--finale-cards">
                  {DEROULEMENT_FINALE.map((item) => (
                    <article
                      key={item.titre}
                      className="concours-page__step concours-page__step--finale-card"
                    >
                      <h3>{item.titre}</h3>
                      <p className="concours-page__step-date">
                        {item.date}
                        {'horaire' in item && item.horaire ? ` · ${item.horaire}` : ''}
                      </p>
                      <p className="concours-page__step-label">Étapes</p>
                      <ul className="concours-page__list">
                        {item.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <SectionBridge variant="wave" />

            <section className="concours-page__section">
              <div className="concours-page__inner concours-page__inner--conditions">
                <h2>Conditions de participation</h2>
                <ul className="concours-page__list">
                  {CRITERES.map((critere) => (
                    <li key={critere}>{critere}</li>
                  ))}
                </ul>
              </div>
            </section>

            <SectionBridge variant="wave" />

            <section className="concours-page__section">
              <div className="concours-page__inner">
                <h2>Partenaires de l&apos;édition</h2>
                <PartnersTrustCarousel />
                <p>
                  Entreprises, institutions et opérateurs techniques accompagnent la
                  montée en compétences des jeunes Ivoiriens.
                </p>
                <a className="concours-page__inline-link" href="/partenariat">
                  Devenir partenaire
                </a>
              </div>
            </section>

            <SectionBridge variant="ribbon" />

            <section className="concours-page__section">
              <div className="concours-page__inner">
                <h2>Questions fréquentes</h2>
                <div className="concours-page__faq">
                  {FAQ.map((item) => (
                    <article key={item.question} className="concours-page__faq-item">
                      <h3>{item.question}</h3>
                      <p>{item.reponse}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  )
}
