import { useEffect, useState } from 'react'
import { getAuthEventName, isCandidateLoggedIn } from '../lib/candidate-auth'
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
  '/profil',
] as const

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [candidateLoggedIn, setCandidateLoggedIn] = useState(() => isCandidateLoggedIn())
  const pathname = window.location.pathname

  const isSubPage = SUBPAGE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
  const isActualitesDetail = /^\/actualites\/[^/]+\/?$/.test(pathname)
  const homePrefix = isSubPage || isActualitesDetail ? '/#' : '#'

  const navLinks = [
    { href: `${homePrefix}accueil`, label: 'Accueil' },
    { href: '/metiers', label: 'Métiers' },
    { href: '/competition', label: 'Compétition' },
    { href: '/actualites', label: 'Actualités' },
    { href: '/partenariat', label: 'Partenariat' },
    { href: '/contact', label: 'Contact' },
    candidateLoggedIn
      ? { href: '/profil', label: 'Profil' }
      : { href: '/connexion', label: 'Connexion' },
  ] as const

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
                className={`site-navbar__link${label === 'Connexion' ? ' site-navbar__link--cta' : ''}`}
                href={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a
        className="site-navbar__ticket-btn"
        href="/billetterie"
        onClick={() => setMenuOpen(false)}
      >
        Bielleterie
      </a>
    </header>
  )
}
