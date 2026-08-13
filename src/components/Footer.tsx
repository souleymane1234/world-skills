import './Footer.css'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa6'

const CURRENT_YEAR = new Date().getFullYear()

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com', label: 'Facebook', icon: FaFacebookF },
  { href: 'https://www.linkedin.com', label: 'LinkedIn', icon: FaLinkedinIn },
  { href: 'https://www.instagram.com', label: 'Instagram', icon: FaInstagram },
  { href: 'https://www.youtube.com', label: 'YouTube', icon: FaYoutube },
] as const

const FOOTER_COLUMNS = [
  {
    title: 'Navigation',
    links: [
      { href: '/#accueil', label: 'Accueil' },
      { href: '/competition', label: 'Compétition' },
      { href: '/actualites', label: 'Actualités' },
      { href: '/partenariat', label: 'Partenariat' },
    ],
  },
  {
    title: 'Partenaires',
    links: [
      { href: '/#partenaires', label: 'Nos partenaires' },
      { href: '/partenariat', label: 'Devenir partenaire' },
      { href: '/actualites', label: 'Espace presse' },
      { href: 'https://www.worldskills.org', label: 'WorldSkills International' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { href: '/partenariat#contact', label: 'Inscriptions établissements' },
      { href: '/partenariat#contact', label: 'Sponsoring' },
      { href: '/partenariat#contact', label: 'Presse & médias' },
      { href: 'mailto:contact@worldskills.ci', label: 'contact@worldskills.ci' },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="site-footer" aria-label="Pied de page">
      <div className="site-footer__main">
        <section className="site-footer__brand" aria-label="WorldSkills Côte d'Ivoire">
          <a className="site-footer__brand-logo" href="/#accueil" aria-label="Accueil">
            <img
              src="/logo-removebg-preview.png"
              alt="WorldSkills Côte d'Ivoire"
              width={72}
              height={72}
            />
          </a>
          <p className="site-footer__tagline">
            Olympiades des métiers — METFPA
          </p>
          <ul className="site-footer__socials" aria-label="Réseaux sociaux">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <Icon aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="site-footer__columns">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} className="site-footer__column" aria-label={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="site-footer__legal">
          <a href="/partenariat#contact">Mentions légales</a>
          <a href="/partenariat#contact">Politique de confidentialité</a>
        </div>
        <p className="site-footer__copy">
          {CURRENT_YEAR} WorldSkills Côte d&apos;Ivoire · ONG RTT · METFPA. Tous droits réservés.
        </p>
      </div>

      <a className="site-footer__to-top" href="/#accueil" aria-label="Retour en haut">
        ^
      </a>
    </footer>
  )
}
