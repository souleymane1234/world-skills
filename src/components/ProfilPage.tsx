import { useEffect, useMemo, useState } from 'react'
import {
  getAuthEventName,
  getCandidateAccount,
  isCandidateLoggedIn,
  logoutCandidate,
  updateCandidateProfile,
  type CandidateProfile,
} from '../lib/candidate-auth'
import './AuthPages.css'

function profileToTextarea(list: string[]): string {
  return list.join('\n')
}

function normalizeProfile(profile: CandidateProfile): CandidateProfile {
  return {
    title: profile.title ?? '',
    fullName: profile.fullName ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    city: profile.city ?? '',
    country: profile.country ?? "Cote d'Ivoire",
    gender: profile.gender ?? '',
    preferredLanguage: profile.preferredLanguage ?? 'Francais',
    address: profile.address ?? '',
    birthDate: profile.birthDate ?? '',
    school: profile.school ?? '',
    bio: profile.bio ?? '',
    realizations: profile.realizations ?? [],
  }
}

type ProfileSection = 'infos' | 'contact' | 'participation' | 'realisations'

export function ProfilPage() {
  const [loggedIn, setLoggedIn] = useState(() => isCandidateLoggedIn())
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<ProfileSection>('infos')
  const account = useMemo(() => getCandidateAccount(), [loggedIn])
  const [form, setForm] = useState<CandidateProfile | null>(
    account?.profile ? normalizeProfile(account.profile) : null,
  )
  const [realisationsText, setRealisationsText] = useState(
    profileToTextarea(account?.profile.realizations ?? []),
  )

  useEffect(() => {
    const onChanged = () => {
      const nextLogged = isCandidateLoggedIn()
      setLoggedIn(nextLogged)
      const nextAccount = getCandidateAccount()
      setForm(nextAccount?.profile ? normalizeProfile(nextAccount.profile) : null)
      setRealisationsText(profileToTextarea(nextAccount?.profile.realizations ?? []))
    }
    window.addEventListener(getAuthEventName(), onChanged)
    window.addEventListener('storage', onChanged)
    return () => {
      window.removeEventListener(getAuthEventName(), onChanged)
      window.removeEventListener('storage', onChanged)
    }
  }, [])

  if (!loggedIn || !form) {
    return (
      <main className="auth-page">
        <section className="auth-page__shell">
          <p className="auth-page__eyebrow">Espace candidat</p>
          <h1>Profil candidat</h1>
          <p className="auth-page__lead">
            Vous devez vous connecter avant d&apos;accéder à votre profil.
          </p>
          <a href="/connexion" className="auth-page__btn auth-page__btn--primary">
            Aller à la connexion
          </a>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <section className="auth-page__shell auth-page__shell--profile">
        <form
          className="auth-page__profile-layout"
          onSubmit={(event) => {
            event.preventDefault()
            const next: CandidateProfile = {
              ...form,
              fullName: form.fullName.trim(),
              email: form.email.trim().toLowerCase(),
              realizations: realisationsText
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
            }
            const ok = updateCandidateProfile(next)
            if (!ok) return
            setForm(next)
            setSaved(true)
            window.setTimeout(() => setSaved(false), 1800)
          }}
        >
          <aside className="auth-page__profile-sidebar">
            <h1>{form.fullName || 'Mon profil candidat'}</h1>
            <div className="auth-page__profile-avatar" aria-hidden="true">
              <span>{(form.fullName || 'C').slice(0, 1).toUpperCase()}</span>
            </div>
            <nav className="auth-page__profile-menu" aria-label="Sections du profil">
              <button
                type="button"
                className={activeSection === 'infos' ? 'is-active' : ''}
                onClick={() => setActiveSection('infos')}
              >
                Infos personnelles
              </button>
              <button
                type="button"
                className={activeSection === 'contact' ? 'is-active' : ''}
                onClick={() => setActiveSection('contact')}
              >
                Contact
              </button>
              <button
                type="button"
                className={activeSection === 'participation' ? 'is-active' : ''}
                onClick={() => setActiveSection('participation')}
              >
                Participation
              </button>
              <button
                type="button"
                className={activeSection === 'realisations' ? 'is-active' : ''}
                onClick={() => setActiveSection('realisations')}
              >
                Realisations
              </button>
            </nav>
          </aside>

          <div className="auth-page__profile-content">
            <header className="auth-page__profile-head">
              <p className="auth-page__eyebrow">Espace candidat</p>
              <p className="auth-page__lead">
                Mettez a jour vos informations pour preparer votre candidature.
              </p>
            </header>

            {activeSection === 'infos' ? (
              <section className="auth-page__profile-card">
                <h2 className="auth-page__profile-card-title">Infos personnelles</h2>
                <div className="auth-page__profile-rows">
                  <label className="auth-page__profile-row">
                    <span>Titre</span>
                    <select
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    >
                      <option value="">Selectionnez</option>
                      <option value="M.">M.</option>
                      <option value="Mme">Mme</option>
                      <option value="Mlle">Mlle</option>
                    </select>
                  </label>
                  <label className="auth-page__profile-row">
                    <span>Nom complet</span>
                    <input
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                  </label>
                  <label className="auth-page__profile-row">
                    <span>Date de naissance</span>
                    <input
                      type="date"
                      value={form.birthDate}
                      onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    />
                  </label>
                  <label className="auth-page__profile-row">
                    <span>Genre</span>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    >
                      <option value="">Selectionnez</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </label>
                  <label className="auth-page__profile-row">
                    <span>Pays</span>
                    <input
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    />
                  </label>
                  <label className="auth-page__profile-row">
                    <span>Langue preferee</span>
                    <select
                      value={form.preferredLanguage}
                      onChange={(e) =>
                        setForm({ ...form, preferredLanguage: e.target.value })
                      }
                    >
                      <option value="Francais">Francais</option>
                      <option value="Anglais">Anglais</option>
                    </select>
                  </label>
                </div>
              </section>
            ) : null}

            {activeSection === 'contact' ? (
              <section className="auth-page__profile-card">
                <h2 className="auth-page__profile-card-title">Infos de contact</h2>
                <div className="auth-page__profile-rows">
                  <label className="auth-page__profile-row">
                    <span>E-mail</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </label>
                  <label className="auth-page__profile-row">
                    <span>Telephone</span>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Ex : 07 00 00 00 00"
                    />
                  </label>
                  <label className="auth-page__profile-row">
                    <span>Ville</span>
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </label>
                  <label className="auth-page__profile-row">
                    <span>Adresse</span>
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Commune, quartier, rue"
                    />
                  </label>
                </div>
              </section>
            ) : null}

            {activeSection === 'participation' ? (
              <section className="auth-page__profile-card">
                <h2 className="auth-page__profile-card-title">
                  Infos et donnees de participation
                </h2>
                <div className="auth-page__profile-rows">
                  <label className="auth-page__profile-row">
                    <span>Etablissement</span>
                    <input
                      value={form.school}
                      onChange={(e) => setForm({ ...form, school: e.target.value })}
                    />
                  </label>
                  <label className="auth-page__profile-row auth-page__profile-row--textarea">
                    <span>Presentation personnelle</span>
                    <textarea
                      rows={4}
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Decrivez votre parcours, votre motivation et votre niveau."
                    />
                  </label>
                </div>
              </section>
            ) : null}

            {activeSection === 'realisations' ? (
              <section className="auth-page__profile-card">
                <h2 className="auth-page__profile-card-title">Realisations (projets)</h2>
                <label className="auth-page__profile-row auth-page__profile-row--textarea">
                  <span>Une ligne par realisation</span>
                  <textarea
                    rows={6}
                    value={realisationsText}
                    onChange={(e) => setRealisationsText(e.target.value)}
                    placeholder={'Ex :\nProjet domotique 2025\nStage technique 2024'}
                  />
                </label>
              </section>
            ) : null}

            <div className="auth-page__actions auth-page__actions--profile">
              <button type="submit" className="auth-page__btn auth-page__btn--primary">
                Enregistrer mon profil
              </button>
              <button
                type="button"
                className="auth-page__btn auth-page__btn--ghost"
                onClick={() => {
                  logoutCandidate()
                  window.location.href = '/'
                }}
              >
                Se deconnecter
              </button>
            </div>

            {saved ? <p className="auth-page__message">Profil enregistre.</p> : null}
          </div>
        </form>
      </section>
    </main>
  )
}
