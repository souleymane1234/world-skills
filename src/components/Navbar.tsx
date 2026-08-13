import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa6'
import { getAuthEventName, isCandidateLoggedIn, logoutCandidate } from '../lib/candidate-auth'
import { clearAuthSession } from '../lib/auth-session'
import './Navbar.css'

const SCROLL_SOLID_THRESHOLD_PX = 32

const SUBPAGE_PREFIXES = [
  '/actualites',
  '/competition',
  '/concours',
  '/metiers',
  '/partenariat',
  '/contact',
  '/connexion',
  '/inscription',
  '/profil',
  '/showroom',
  '/vote',
] as const

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [candidateLoggedIn, setCandidateLoggedIn] = useState(() => isCandidateLoggedIn())
  const pathname = window.location.pathname
  const hash = window.location.hash

  const isSubPage = SUBPAGE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
  const isActualitesDetail = /^\/actualites\/[^/]+\/?$/.test(pathname)
  const homePrefix = isSubPage || isActualitesDetail ? '/#' : '#'

  const navLinks = [
    { href: `${homePrefix}accueil`, label: 'Accueil' },
    { href: '/competition', label: 'Compétition' },
    { href: '/actualites', label: 'Actualités' },
    { href: '/partenariat', label: 'Partenariat' },
    ...(candidateLoggedIn
      ? [{ href: '/profil', label: 'Profil' }]
      : [{ href: '/inscription', label: 'Inscription' }]),
  ]

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_SOLID_THRESHOLD_PX)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onAuthChanged = () => setCandidateLoggedIn(isCandidateLoggedIn())
    window.addEventListener(getAuthEventName(), onAuthChanged)
    window.addEventListener('storage', onAuthChanged)
    return () => {
      window.removeEventListener(getAuthEventName(), onAuthChanged)
      window.removeEventListener('storage', onAuthChanged)
    }
  }, [])

  const isSolid =
    isSubPage || isActualitesDetail || scrolled || menuOpen

  const isLinkActive = (href: string) => {
    if (href.includes('#accueil')) {
      return pathname === '/' && (hash === '' || hash === '#accueil')
    }
    if (href === '/actualites') {
      return pathname === '/actualites' || pathname.startsWith('/actualites/')
    }
    if (href === '/inscription') {
      return pathname === '/inscription' || pathname.startsWith('/inscription/')
    }
    if (href === '/connexion') {
      return pathname === '/connexion' || pathname.startsWith('/connexion/')
    }
    if (href === '/partenariat') {
      return (
        pathname === '/partenariat' ||
        pathname.startsWith('/partenariat/') ||
        pathname === '/contact' ||
        pathname.startsWith('/contact/')
      )
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className={`site-navbar${isSolid ? ' site-navbar--solid' : ''}`}>
      <a
        className="site-navbar__brand"
        href="/#accueil"
        onClick={() => setMenuOpen(false)}
      >
        <img
          className="site-navbar__logo"
          src="/logo-removebg-preview.png"
          width={56}
          height={56}
          alt="WorldSkills Côte d'Ivoire"
        />
      </a>

      <button
        type="button"
        className="site-navbar__toggle"
        aria-expanded={menuOpen}
        aria-controls="site-navbar-menu"
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="site-navbar__toggle-bar" />
        <span className="site-navbar__toggle-bar" />
        <span className="site-navbar__toggle-bar" />
      </button>

      <nav
        id="site-navbar-menu"
        className={`site-navbar__nav${menuOpen ? ' site-navbar__nav--open' : ''}`}
        aria-label="Navigation principale"
      >
        <ul className="site-navbar__list">
          {navLinks.map(({ href, label }) => (
            <li key={href + label}>
              <a
                className={`site-navbar__link${label === 'Inscription' ? ' site-navbar__link--cta' : ''}${isLinkActive(href) ? ' site-navbar__link--active' : ''}`}
                href={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
          {candidateLoggedIn ? (
            <li>
              <button
                type="button"
                className="site-navbar__link site-navbar__link--logout"
                onClick={() => {
                  setMenuOpen(false)
                  clearAuthSession()
                  logoutCandidate()
                  window.location.href = '/'
                }}
              >
                Déconnexion
              </button>
            </li>
          ) : (
            <li>
              <a
                className={`site-navbar__icon-btn${isLinkActive('/connexion') ? ' is-active' : ''}`}
                href="/connexion"
                aria-label="Connexion"
                title="Connexion"
                onClick={() => setMenuOpen(false)}
              >
                <FaUser aria-hidden="true" />
                <span className="site-navbar__icon-btn-label">Connexion</span>
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
