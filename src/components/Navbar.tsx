import { useEffect, useState } from 'react'
import './Navbar.css'

const SCROLL_SOLID_THRESHOLD_PX = 32

const SUBPAGE_PREFIXES = [
  '/actualites',
  '/competition',
  '/concours',
  '/edition',
  '/metiers',
  '/partenariat',
] as const

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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
    { href: '/edition', label: 'Éditions' },
    { href: '/actualites', label: 'Actualités' },
    { href: '/partenariat', label: 'Partenariat' },
    { href: `${homePrefix}contact`, label: 'Contact' },
  ] as const

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_SOLID_THRESHOLD_PX)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
          src="/logo.png"
          width={56}
          height={56}
          alt="WorldSkills Côte d'Ivoire"
        />
        <span className="site-navbar__title">WorldSkills CI</span>
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
                className="site-navbar__link"
                href={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
