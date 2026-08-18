import './PartnersTrustCarousel.css'

const TRUST_LOGOS = [
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
].map((file) => {
  const name = file.replace(/\.[^.]+$/, '')
  return {
    id: name,
    src: `/trustCaroussel/${file}`,
    alt: name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' '),
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
            {loopLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="partners-trust__item"
                aria-hidden={index >= TRUST_LOGOS.length}
              >
                <img
                  className="partners-trust__logo"
                  src={logo.src}
                  alt={index < TRUST_LOGOS.length ? logo.alt : ''}
                  width={180}
                  height={90}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
