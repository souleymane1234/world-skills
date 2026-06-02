import './ContactSection.css'

export function ContactSection() {
  return (
    <section id="contact" className="ws-contact" aria-labelledby="ws-contact-title">
      <div className="ws-contact__inner">
        <p className="ws-contact__eyebrow">Contact</p>
        <h2 id="ws-contact-title">Direction de la Vie scolaire — METFPA</h2>
        <p className="ws-contact__lead">
          Pour les inscriptions, le partenariat, la presse ou toute question sur
          les Olympiades des métiers — WorldSkills Côte d&apos;Ivoire.
        </p>
        <ul className="ws-contact__channels">
          <li>
            <strong>E-mail</strong>
            <a href="mailto:contact@worldskills.ci">contact@worldskills.ci</a>
          </li>
          <li>
            <strong>Lieu de la finale</strong>
            <span>Lycée technique d&apos;Abidjan-Cocody (LTA)</span>
          </li>
          <li>
            <strong>Ministère</strong>
            <span>METFPA — Enseignement technique &amp; formation professionnelle</span>
          </li>
        </ul>
        <div className="ws-contact__actions">
          <a href="/partenariat" className="ws-contact__btn ws-contact__btn--primary">
            Devenir partenaire
          </a>
          <a href="/competition" className="ws-contact__btn ws-contact__btn--ghost">
            Règlement &amp; calendrier
          </a>
        </div>
      </div>
    </section>
  )
}
