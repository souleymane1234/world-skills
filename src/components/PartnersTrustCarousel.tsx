import './PartnersTrustCarousel.css'

type TrustLogo = {
  id: string
  src: string
  alt: string
  href?: string
}

const PARTNER_HREFS: Record<string, string> = {
  'AfrilandFirstBank.jpeg': 'https://afrilandfirstbankci.com/',
  'Amoirie.png': 'https://www.education.gouv.ci/index.php/Welcome',
  'BoisAfrique.jpeg': 'https://boisdafrique.com/',
  'Booz.png': 'https://booztech.com/',
  'CentreIvoirienRobotique.png': 'https://cirobotique.ci/',
  'Daikin.png':
    'https://www.daikinmea.com/fr_fr/dmea-sales-network/dmea-cote-divoire.html',
  'Dolait.jpeg': 'https://sotigroup.com/produit/dolait-yaourt/',
  'Eliwood.png': 'https://demo.eliwoodplay.com/',
  'festo.webp': 'https://www.festo.com/za/en',
  'Gandour.jpeg': 'https://web.facebook.com/Gandourci/?_rdc=1&_rdr#',
  'Gipame.png': 'https://www.linkedin.com/in/gipame-abidjan/',
  'GroupeCarreOr.jpg': 'https://www.carredor.org/',
  'InnovTechnology.png': 'https://www.innovtechnology-ci.com/',
  'Interform.png':
    'https://annuaireci.com/en/entreprises/interform-ci-abidjan-cote-divoire/',
  'OIPI.png': 'https://oipr-ci.org/',
  'OmniTravaux.png': 'https://snedai.com/mot-cle/omni-travaux/',
  'ortt.png': 'https://www.ongreveletontalent.com/',
  'Prosuma.png': 'https://groupeprosuma.com/',
  'Sogelus.png': 'https://www.sogelux.net/',
  'Sotiv.png': 'https://ci.linkedin.com/in/sotiv-c%C3%B4te-d-ivoire-894786257',
  'UniverselleIndustries.jpeg': 'https://universelleindustries.com/',
  'Uniwax.png':
    'https://www.uniwax.com/?srsltid=AfmBOorc2dnO1WMJQB4LQjcugEywisBQn93OpNjUtpfgQqqy6wlqNeU',
  'WorldskillsIvoire.png': 'https://worldskills.org/',
}

const TRUST_LOGOS: TrustLogo[] = [
  'Interform.png',
  'Eliwood.png',
  'Dolait.jpeg',
  'Gipame.png',
  'Gandour.jpeg',
  'ortt.png',
  'UniverselleIndustries.jpeg',
  'OIPI.png',
  'festo.webp',
  'Sogelus.png',
  'Uniwax.png',
  'OmniTravaux.png',
  'Daikin.png',
  'CentreIvoirienRobotique.png',
  'InnovTechnology.png',
  'Amoirie.png',
  'Prosuma.png',
  'BoisAfrique.jpeg',
  'AfrilandFirstBank.jpeg',
  'Booz.png',
  'WorldskillsIvoire.png',
  'Sotiv.png',
  'GroupeCarreOr.jpg',
  'port-10.png',
].map((file) => {
  const name = file.replace(/\.[^.]+$/, '')
  return {
    id: name,
    src: `/trustCaroussel/${file}`,
    alt: name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' '),
    href: PARTNER_HREFS[file],
  }
})

type PartnersTrustCarouselProps = {
  /** Ancre #partenaires (accueil). Desactive sur pages dediees qui ont deja l'ancre. */
  includeAnchorId?: boolean
}

export function PartnersTrustCarousel({ includeAnchorId = true }: PartnersTrustCarouselProps) {
  const loopLogos = [...TRUST_LOGOS, ...TRUST_LOGOS]

  return (
    <section
      {...(includeAnchorId ? { id: 'partenaires' } : {})}
      className="partners-trust"
      aria-labelledby="partners-trust-title"
    >
      <div className="partners-trust__inner">
        <header className="partners-trust__header">
          <h2 id="partners-trust-title" className="partners-trust__title">
            Ils nous font confiance
          </h2>
        </header>

        <div className="partners-trust__viewport" aria-label="Logos partenaires">
          <div className="partners-trust__track">
            {loopLogos.map((logo, index) => {
              const isDuplicate = index >= TRUST_LOGOS.length
              const img = (
                <img
                  className="partners-trust__logo"
                  src={logo.src}
                  alt={isDuplicate ? '' : logo.alt}
                  width={180}
                  height={90}
                  loading="lazy"
                  decoding="async"
                />
              )

              return (
                <div
                  key={`${logo.id}-${index}`}
                  className="partners-trust__item"
                  aria-hidden={isDuplicate}
                >
                  {logo.href ? (
                    <a
                      className="partners-trust__link"
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isDuplicate ? -1 : undefined}
                      aria-label={isDuplicate ? undefined : `${logo.alt} (ouvre le site)`}
                    >
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
