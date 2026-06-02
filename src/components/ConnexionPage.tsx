import { useEffect, useState } from 'react'
import {
  getAuthEventName,
  isCandidateLoggedIn,
  loginCandidate,
  registerCandidate,
} from '../lib/candidate-auth'
import './AuthPages.css'

export function ConnexionPage() {
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [loggedIn, setLoggedIn] = useState(() => isCandidateLoggedIn())
  const [message, setMessage] = useState('')

  useEffect(() => {
    const onChanged = () => setLoggedIn(isCandidateLoggedIn())
    window.addEventListener(getAuthEventName(), onChanged)
    window.addEventListener('storage', onChanged)
    return () => {
      window.removeEventListener(getAuthEventName(), onChanged)
      window.removeEventListener('storage', onChanged)
    }
  }, [])

  return (
    <main className="auth-page">
      <section className="auth-page__shell auth-page__shell--login">
        <div className="auth-page__brand">
          <img src="/logo-removebg-preview.png" alt="WorldSkills Côte d'Ivoire" />
          <h1>WorldSkills Côte d&apos;Ivoire</h1>
          <p>Plateforme officielle · Espace candidat</p>
          <a href="/#accueil" className="auth-page__btn auth-page__btn--ghost">
            Retour à l&apos;accueil
          </a>
        </div>

        {loggedIn ? (
          <div className="auth-page__success">
            <p>Vous êtes connecté.</p>
            <a href="/profil" className="auth-page__btn auth-page__btn--primary">
              Ouvrir mon profil
            </a>
          </div>
        ) : (
          <>
            <p className="auth-page__eyebrow">E-mail &amp; mot de passe</p>
            <div className="auth-page__tabs">
              <button
                type="button"
                className={`auth-page__tab${mode === 'register' ? ' auth-page__tab--active' : ''}`}
                onClick={() => {
                  setMode('register')
                  setMessage('')
                }}
              >
                Inscription
              </button>
              <button
                type="button"
                className={`auth-page__tab${mode === 'login' ? ' auth-page__tab--active' : ''}`}
                onClick={() => {
                  setMode('login')
                  setMessage('')
                }}
              >
                Connexion
              </button>
            </div>

            {mode === 'register' ? (
              <form
                className="auth-page__form"
                onSubmit={(event) => {
                  event.preventDefault()
                  const fd = new FormData(event.currentTarget)
                  const fullName = String(fd.get('fullName') ?? '')
                  const email = String(fd.get('email') ?? '')
                  const password = String(fd.get('password') ?? '')
                  const confirm = String(fd.get('confirmPassword') ?? '')

                  if (password.length < 6) {
                    setMessage('Le mot de passe doit contenir au moins 6 caractères.')
                    return
                  }
                  if (password !== confirm) {
                    setMessage('Les mots de passe ne correspondent pas.')
                    return
                  }

                  const result = registerCandidate({ fullName, email, password })
                  if (!result.ok) {
                    setMessage(result.message)
                    return
                  }
                  window.location.href = '/profil'
                }}
              >
                <h2 className="auth-page__mode-title">Inscription</h2>
                <p className="auth-page__mode-text">
                  Créez votre compte candidat avant de soumettre votre candidature.
                </p>
                <label>
                  Nom complet
                  <input name="fullName" required autoComplete="name" />
                </label>
                <label>
                  E-mail
                  <input name="email" type="email" required autoComplete="email" />
                </label>
                <label>
                  Mot de passe
                  <input name="password" type="password" required minLength={6} />
                </label>
                <label>
                  Confirmer le mot de passe
                  <input name="confirmPassword" type="password" required minLength={6} />
                </label>
                <button type="submit" className="auth-page__btn auth-page__btn--primary">
                  Créer mon compte
                </button>
              </form>
            ) : (
              <form
                className="auth-page__form"
                onSubmit={(event) => {
                  event.preventDefault()
                  const fd = new FormData(event.currentTarget)
                  const email = String(fd.get('email') ?? '')
                  const password = String(fd.get('password') ?? '')
                  const ok = loginCandidate(email, password)
                  if (!ok) {
                    setMessage('Identifiants invalides.')
                    return
                  }
                  window.location.href = '/profil'
                }}
              >
                <h2 className="auth-page__mode-title">Connexion</h2>
                <p className="auth-page__mode-text">
                  Connectez-vous avec l&apos;e-mail et le mot de passe de votre compte.
                </p>
                <label>
                  E-mail
                  <input name="email" type="email" required autoComplete="email" />
                </label>
                <label>
                  Mot de passe
                  <input name="password" type="password" required />
                </label>
                <button type="submit" className="auth-page__btn auth-page__btn--primary">
                  Se connecter
                </button>
              </form>
            )}
          </>
        )}

        {message ? <p className="auth-page__message">{message}</p> : null}
        <p className="auth-page__footer-note">Connexion sécurisée · WorldSkills Côte d&apos;Ivoire</p>
      </section>
    </main>
  )
}
