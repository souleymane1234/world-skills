import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { SKILLS } from '../data/skills'
import './CandidaturePage.css'

const STEPS = [
  'Informations personnelles',
  'Établissement & métier',
  'Parcours & expérience',
  'Documents',
  'Confirmation',
] as const

const CITIES = [
  'Abidjan',
  'Bouaké',
  'Yamoussoukro',
  'San-Pédro',
  'Daloa',
  'Korhogo',
  'Man',
  'Gagnoa',
  'Divo',
  'Abengourou',
  'Autre',
] as const

const ESTABLISHMENT_TYPES = [
  'Lycée technique',
  'Centre de formation professionnelle',
  'Université / grande école',
  'Entreprise / apprentissage',
  'Autre',
] as const

const LEVELS = ['CAP', 'BEP', 'Bac professionnel', 'BTS', 'Licence', 'Autre'] as const

type FormState = {
  prenom: string
  nom: string
  naissance: string
  sexe: 'masculin' | 'feminin' | ''
  nationalite: string
  cni: string
  residence: string
  email: string
  telephone: string
  etablissementType: string
  etablissementNom: string
  etablissementVille: string
  niveau: string
  metierPrincipal: string
  specialisation: string
  metiersSecondaires: string[]
  urgenceNom: string
  urgenceTel: string
  urgenceLien: string
  formation: string
  experience: string
  motivation: string
  identite: File | null
  photo: File | null
  cv: File | null
  diplome: File | null
  video: File | null
  consent: boolean
}

const INITIAL_FORM: FormState = {
  prenom: '',
  nom: '',
  naissance: '',
  sexe: '',
  nationalite: '',
  cni: '',
  residence: '',
  email: '',
  telephone: '',
  etablissementType: '',
  etablissementNom: '',
  etablissementVille: '',
  niveau: '',
  metierPrincipal: '',
  specialisation: '',
  metiersSecondaires: [],
  urgenceNom: '',
  urgenceTel: '',
  urgenceLien: '',
  formation: '',
  experience: '',
  motivation: '',
  identite: null,
  photo: null,
  cv: null,
  diplome: null,
  video: null,
  consent: false,
}

function FileField({
  label,
  hint,
  accept,
  required,
  file,
  preview,
  onChange,
}: {
  label: string
  hint?: string
  accept: string
  required?: boolean
  file: File | null
  preview?: 'image' | 'video'
  onChange: (file: File | null) => void
}) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  return (
    <label className="candidature-form__file">
      <span>
        {label}
        {required ? <em> *</em> : null}
      </span>
      {hint ? <small>{hint}</small> : null}
      <input
        type="file"
        accept={accept}
        required={required}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {file ? <p className="candidature-form__file-name">{file.name}</p> : null}
      {url && preview === 'image' ? (
        <img className="candidature-form__preview" src={url} alt="" />
      ) : null}
      {url && preview === 'video' ? (
        <video className="candidature-form__preview candidature-form__preview--video" src={url} controls />
      ) : null}
    </label>
  )
}

export function CandidaturePage() {
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step, sent])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const toggleSecondarySkill = (id: string) => {
    setForm((current) => {
      const selected = current.metiersSecondaires.includes(id)
        ? current.metiersSecondaires.filter((item) => item !== id)
        : current.metiersSecondaires.length < 2
          ? [...current.metiersSecondaires, id]
          : current.metiersSecondaires
      return { ...current, metiersSecondaires: selected }
    })
  }

  const canGoNext = () => {
    if (step === 0) {
      return Boolean(
        form.prenom &&
          form.nom &&
          form.naissance &&
          form.sexe &&
          form.nationalite &&
          form.cni &&
          form.residence &&
          form.email &&
          form.telephone,
      )
    }
    if (step === 1) {
      return Boolean(
        form.etablissementType &&
          form.etablissementNom &&
          form.etablissementVille &&
          form.niveau &&
          form.metierPrincipal &&
          form.urgenceNom &&
          form.urgenceTel &&
          form.urgenceLien,
      )
    }
    if (step === 2) {
      return Boolean(form.formation && form.experience && form.motivation)
    }
    if (step === 3) {
      return Boolean(form.identite && form.photo && form.video)
    }
    return form.consent
  }

  const goNext = () => {
    if (!canGoNext()) return
    setStep((current) => Math.min(current + 1, STEPS.length - 1))
  }

  const goPrev = () => setStep((current) => Math.max(current - 1, 0))

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canGoNext()) return
    setSent(true)
  }

  const ageFromBirth = (value: string) => {
    if (!value) return null
    const birth = new Date(value)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1
    return Number.isFinite(age) ? age : null
  }

  return (
    <main className="candidature-page" aria-labelledby="candidature-page-title">
      <header className="candidature-page__hero">
        <span className="candidature-page__hero-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5.5 19c1.4-3.4 3.6-5 6.5-5s5.1 1.6 6.5 5" />
          </svg>
        </span>
        <div>
          <h1 id="candidature-page-title">Inscription candidat</h1>
          <p>Côte d&apos;Ivoire Skills 2026</p>
        </div>
      </header>

      <ol className="candidature-page__steps" aria-label="Étapes d'inscription">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={`candidature-page__step${index === step ? ' is-current' : ''}${
              index < step ? ' is-done' : ''
            }`}
          >
            <span>{index < step ? '✓' : index + 1}</span>
            <strong>{label}</strong>
          </li>
        ))}
      </ol>

      <div className="candidature-page__layout">
        <section className="candidature-page__panel">
          {sent ? (
            <div className="candidature-page__success" role="status">
              <p className="candidature-page__success-icon" aria-hidden="true">
                ✓
              </p>
              <h2>Candidature envoyée</h2>
              <p>
                Merci {form.prenom}. Votre dossier sera examiné par l&apos;équipe Côte d&apos;Ivoire
                Skills. Après validation, vous recevrez votre badge virtuel par e-mail ou WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              {step === 0 ? (
                <fieldset className="candidature-form">
                  <legend>1. Informations personnelles</legend>
                  <div className="candidature-form__grid">
                    <label>
                      Prénom(s) <em>*</em>
                      <input
                        value={form.prenom}
                        onChange={(e) => update('prenom', e.target.value)}
                        placeholder="Entrez votre prénom"
                        autoComplete="given-name"
                        required
                      />
                    </label>
                    <label>
                      Nom <em>*</em>
                      <input
                        value={form.nom}
                        onChange={(e) => update('nom', e.target.value)}
                        placeholder="Entrez votre nom"
                        autoComplete="family-name"
                        required
                      />
                    </label>
                    <label>
                      Date de naissance <em>*</em>
                      <input
                        type="date"
                        value={form.naissance}
                        onChange={(e) => update('naissance', e.target.value)}
                        required
                      />
                    </label>
                    <fieldset className="candidature-form__radio">
                      <legend>
                        Sexe <em>*</em>
                      </legend>
                      <label>
                        <input
                          type="radio"
                          name="sexe"
                          checked={form.sexe === 'masculin'}
                          onChange={() => update('sexe', 'masculin')}
                          required
                        />
                        Masculin
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="sexe"
                          checked={form.sexe === 'feminin'}
                          onChange={() => update('sexe', 'feminin')}
                        />
                        Féminin
                      </label>
                    </fieldset>
                    <label>
                      Nationalité <em>*</em>
                      <select
                        value={form.nationalite}
                        onChange={(e) => update('nationalite', e.target.value)}
                        required
                      >
                        <option value="">Sélectionnez votre nationalité</option>
                        <option value="ivoirienne">Ivoirienne</option>
                        <option value="residente">Résident(e) en Côte d&apos;Ivoire</option>
                        <option value="autre">Autre</option>
                      </select>
                    </label>
                    <label>
                      Numéro de CNI ou passeport <em>*</em>
                      <input
                        value={form.cni}
                        onChange={(e) => update('cni', e.target.value)}
                        placeholder="Entrez votre numéro"
                        required
                      />
                    </label>
                    <label>
                      Lieu de résidence <em>*</em>
                      <select
                        value={form.residence}
                        onChange={(e) => update('residence', e.target.value)}
                        required
                      >
                        <option value="">Sélectionnez votre ville</option>
                        {CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Email <em>*</em>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="exemple@email.com"
                        autoComplete="email"
                        required
                      />
                    </label>
                    <label>
                      Téléphone <em>*</em>
                      <input
                        type="tel"
                        value={form.telephone}
                        onChange={(e) => update('telephone', e.target.value)}
                        placeholder="+225 07 00 00 00 00"
                        autoComplete="tel"
                        required
                      />
                    </label>
                  </div>
                </fieldset>
              ) : null}

              {step === 1 ? (
                <div className="candidature-form">
                  <fieldset>
                    <legend>2. Établissement</legend>
                    <div className="candidature-form__grid">
                      <label>
                        Type d&apos;établissement <em>*</em>
                        <select
                          value={form.etablissementType}
                          onChange={(e) => update('etablissementType', e.target.value)}
                          required
                        >
                          <option value="">Sélectionnez</option>
                          {ESTABLISHMENT_TYPES.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Nom de l&apos;établissement <em>*</em>
                        <input
                          value={form.etablissementNom}
                          onChange={(e) => update('etablissementNom', e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        Ville de l&apos;établissement <em>*</em>
                        <select
                          value={form.etablissementVille}
                          onChange={(e) => update('etablissementVille', e.target.value)}
                          required
                        >
                          <option value="">Sélectionnez</option>
                          {CITIES.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Niveau / classe <em>*</em>
                        <select value={form.niveau} onChange={(e) => update('niveau', e.target.value)} required>
                          <option value="">Sélectionnez</option>
                          {LEVELS.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>3. Métier(s) choisi(s)</legend>
                    <div className="candidature-form__grid">
                      <label>
                        Métier principal <em>*</em>
                        <select
                          value={form.metierPrincipal}
                          onChange={(e) => update('metierPrincipal', e.target.value)}
                          required
                        >
                          <option value="">Choisissez le métier dans lequel vous souhaitez concourir</option>
                          {SKILLS.map((skill) => (
                            <option key={skill.id} value={skill.id}>
                              {skill.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Spécialisation (si applicable)
                        <input
                          value={form.specialisation}
                          onChange={(e) => update('specialisation', e.target.value)}
                        />
                      </label>
                    </div>
                    <p className="candidature-form__hint">
                      Métiers secondaires (optionnel) — jusqu&apos;à 2. {form.metiersSecondaires.length} / 2
                      sélectionné(s).
                    </p>
                    <div className="candidature-form__chips">
                      {SKILLS.filter((skill) => skill.id !== form.metierPrincipal).map((skill) => (
                        <label key={skill.id}>
                          <input
                            type="checkbox"
                            checked={form.metiersSecondaires.includes(skill.id)}
                            onChange={() => toggleSecondarySkill(skill.id)}
                          />
                          {skill.name}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>4. Contact en cas d&apos;urgence</legend>
                    <div className="candidature-form__grid">
                      <label>
                        Nom et prénom <em>*</em>
                        <input
                          value={form.urgenceNom}
                          onChange={(e) => update('urgenceNom', e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        Téléphone <em>*</em>
                        <input
                          type="tel"
                          value={form.urgenceTel}
                          onChange={(e) => update('urgenceTel', e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        Lien de parenté <em>*</em>
                        <select
                          value={form.urgenceLien}
                          onChange={(e) => update('urgenceLien', e.target.value)}
                          required
                        >
                          <option value="">Sélectionnez</option>
                          <option value="parent">Parent</option>
                          <option value="tuteur">Tuteur</option>
                          <option value="conjoint">Conjoint(e)</option>
                          <option value="autre">Autre</option>
                        </select>
                      </label>
                    </div>
                  </fieldset>
                </div>
              ) : null}

              {step === 2 ? (
                <fieldset className="candidature-form">
                  <legend>3. Parcours &amp; expérience</legend>
                  <label>
                    Formation / parcours scolaire <em>*</em>
                    <textarea
                      rows={4}
                      value={form.formation}
                      onChange={(e) => update('formation', e.target.value)}
                      placeholder="Décrivez brièvement votre parcours de formation..."
                      required
                    />
                  </label>
                  <label>
                    Expérience professionnelle / stages <em>*</em>
                    <textarea
                      rows={4}
                      value={form.experience}
                      onChange={(e) => update('experience', e.target.value)}
                      placeholder="Stages, apprentissages, expériences liées au métier..."
                      required
                    />
                  </label>
                  <label>
                    Motivation <em>*</em>
                    <textarea
                      rows={4}
                      value={form.motivation}
                      onChange={(e) => update('motivation', e.target.value)}
                      placeholder="Pourquoi souhaitez-vous participer à Côte d'Ivoire Skills 2026 ?"
                      required
                    />
                  </label>
                </fieldset>
              ) : null}

              {step === 3 ? (
                <fieldset className="candidature-form">
                  <legend>4. Documents</legend>
                  <p className="candidature-form__hint">
                    Joignez vos pièces (PDF ou image, max. 5 Mo). Ajoutez aussi une photo et une vidéo de
                    présentation.
                  </p>
                  <div className="candidature-form__files">
                    <FileField
                      label="Pièce d'identité (CNI / passeport)"
                      accept="image/*,.pdf"
                      required
                      file={form.identite}
                      onChange={(file) => update('identite', file)}
                    />
                    <FileField
                      label="Photo de présentation"
                      hint="Portrait net, fond clair de préférence."
                      accept="image/*"
                      required
                      preview="image"
                      file={form.photo}
                      onChange={(file) => update('photo', file)}
                    />
                    <FileField
                      label="CV"
                      accept=".pdf,image/*"
                      file={form.cv}
                      onChange={(file) => update('cv', file)}
                    />
                    <FileField
                      label="Attestation / diplôme (optionnel)"
                      accept=".pdf,image/*"
                      file={form.diplome}
                      onChange={(file) => update('diplome', file)}
                    />
                    <FileField
                      label="Vidéo de présentation"
                      hint="MP4 ou WebM, courte présentation de votre talent."
                      accept="video/mp4,video/webm,video/quicktime"
                      required
                      preview="video"
                      file={form.video}
                      onChange={(file) => update('video', file)}
                    />
                  </div>
                </fieldset>
              ) : null}

              {step === 4 ? (
                <fieldset className="candidature-form">
                  <legend>5. Confirmation</legend>
                  <div className="candidature-form__note">
                    Vérifiez vos informations avant d&apos;envoyer votre candidature. Après envoi, votre
                    dossier sera examiné par l&apos;équipe Côte d&apos;Ivoire Skills. À noter : après
                    validation par l&apos;administration, vous recevrez votre badge virtuel par e-mail ou
                    WhatsApp.
                  </div>
                  <dl className="candidature-form__summary">
                    <div>
                      <dt>Candidat</dt>
                      <dd>
                        {form.prenom} {form.nom}
                        {ageFromBirth(form.naissance) != null
                          ? ` — ${ageFromBirth(form.naissance)} ans`
                          : ''}
                      </dd>
                    </div>
                    <div>
                      <dt>Contact</dt>
                      <dd>
                        {form.email} · {form.telephone}
                      </dd>
                    </div>
                    <div>
                      <dt>Métier</dt>
                      <dd>{SKILLS.find((skill) => skill.id === form.metierPrincipal)?.name ?? '—'}</dd>
                    </div>
                    <div>
                      <dt>Médias</dt>
                      <dd>
                        Photo : {form.photo?.name ?? 'manquante'} · Vidéo : {form.video?.name ?? 'manquante'}
                      </dd>
                    </div>
                  </dl>
                  <label className="candidature-form__check">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => update('consent', e.target.checked)}
                      required
                    />
                    <span>
                      J&apos;accepte le règlement de la compétition et certifie l&apos;exactitude des
                      informations fournies. <em>*</em>
                    </span>
                  </label>
                </fieldset>
              ) : null}

              <div className="candidature-form__nav">
                {step > 0 ? (
                  <button type="button" className="candidature-form__btn candidature-form__btn--ghost" onClick={goPrev}>
                    ← Précédent
                  </button>
                ) : (
                  <span />
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    className="candidature-form__btn"
                    onClick={goNext}
                    disabled={!canGoNext()}
                  >
                    Suivant →
                  </button>
                ) : (
                  <button type="submit" className="candidature-form__btn" disabled={!canGoNext()}>
                    Envoyer ma candidature →
                  </button>
                )}
              </div>
            </form>
          )}
        </section>

        <aside className="candidature-page__aside">
          <article className="candidature-page__aside-card candidature-page__aside-card--green">
            <h2>Participez et montrez votre talent !</h2>
            <p>
              Vous avez entre 16 et 30 ans ? Inscrivez-vous pour participer à la compétition, développer
              vos compétences et gagner en visibilité.
            </p>
            <ul>
              <li>Participez à votre métier</li>
              <li>Valorisez vos compétences</li>
              <li>Tentez de remporter des prix</li>
            </ul>
          </article>
          <article className="candidature-page__aside-card candidature-page__aside-card--gold">
            <h2>Conditions de participation</h2>
            <ul>
              <li>Avoir entre 16 et 30 ans à la date de la compétition</li>
              <li>Être de nationalité ivoirienne ou résident en Côte d&apos;Ivoire</li>
              <li>S&apos;engager à respecter le règlement de la compétition</li>
            </ul>
          </article>
          <article className="candidature-page__aside-card candidature-page__aside-card--blue">
            <h2>Besoin d&apos;aide ?</h2>
            <p>Notre équipe est à votre disposition pour vous accompagner.</p>
            <ul className="candidature-page__help-list">
              <li>
                <a href="mailto:contact@worldskills.ci">contact@worldskills.ci</a>
              </li>
              <li>
                <a href="mailto:worldskills@ongreveletontalent.com">
                  worldskills@ongreveletontalent.com
                </a>
              </li>
              <li>
                <a href="/">worldskills.ci</a>
              </li>
            </ul>
          </article>
        </aside>
      </div>

      <aside className="candidature-page__secure" aria-label="Protection des données">
        <span className="candidature-page__secure-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        <div>
          <h2>Vos données sont sécurisées</h2>
          <p>
            Vos informations personnelles sont protégées et utilisées uniquement dans le cadre de
            la compétition Côte d&apos;Ivoire Skills 2026.
          </p>
        </div>
      </aside>
    </main>
  )
}
