import './ContactSection.css'

type ContactSectionProps = {
  /** Sur la page partenariat : éviter le lien « Devenir partenaire » redondant. */
  embedded?: boolean
}

export function ContactSection({ embedded = false }: ContactSectionProps) {
  return (
    <section id="contact" className="ws-contact" aria-labelledby="ws-contact-title">
      <div className="ws-contact__inner">
        <div className="ws-contact__intro">
          <p className="ws-contact__eyebrow">Contact</p>
          <h2 id="ws-contact-title">Direction de la Vie scolaire — METFPA</h2>
          <p className="ws-contact__lead">
            Pour les inscriptions, le partenariat, la presse ou toute question sur
            les Olympiades des métiers — WorldSkills Côte d&apos;Ivoire.
          </p>
        </div>

        <div className="ws-contact__grid">
          <article className="ws-contact__card">
            <h3>Coordonnées</h3>
            <ul className="ws-contact__channels">
              <li>
                <strong>E-mail</strong>
                <a href="mailto:contact@worldskills.ci">contact@worldskills.ci</a>
                <a href="mailto:worldskills@ongreveletontalent.com">
                  worldskills@ongreveletontalent.com
                </a>
              </li>
              <li>
                <strong>Lieu de la finale</strong>
                <span>Parc des Expositions d&apos;Abidjan</span>
              </li>
              <li>
                <strong>ONG</strong>
                <span>Révèle Ton Talent</span>
              </li>
              <li>
                <strong>Ministère</strong>
                <span>METFPA — Enseignement technique &amp; formation professionnelle</span>
              </li>
            </ul>
            <div className="ws-contact__actions">
              {!embedded ? (
                <a href="/partenariat" className="ws-contact__btn ws-contact__btn--primary">
                  Devenir partenaire
                </a>
              ) : null}
              <a
                href="/competition"
                className={`ws-contact__btn${embedded ? ' ws-contact__btn--primary' : ' ws-contact__btn--ghost'}`}
              >
                Voir la compétition
              </a>
            </div>
          </article>

          <article className="ws-contact__card">
            <h3>Écrire au comité</h3>
            <form
              className="ws-contact__form"
              onSubmit={(event) => {
                event.preventDefault()
                window.alert('Merci, votre message a été envoyé.')
              }}
            >
              <label>
                Nom complet
                <input name="name" required autoComplete="name" />
              </label>
              <label>
                E-mail
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                Sujet
                <select name="subject" required defaultValue="">
                  <option value="" disabled>
                    Choisir un sujet
                  </option>
                  <option value="inscription">Inscription candidat</option>
                  <option value="partenariat">Partenariat entreprise</option>
                  <option value="presse">Presse / média</option>
                  <option value="autre">Autre demande</option>
                </select>
              </label>
              <label>
                Message
                <textarea name="message" rows={4} required />
              </label>
              <button type="submit" className="ws-contact__btn ws-contact__btn--primary">
                Envoyer le message
              </button>
            </form>
          </article>
        </div>
      </div>
    </section>
  )
}
