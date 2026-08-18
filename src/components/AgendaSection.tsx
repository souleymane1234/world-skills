import {
  FaCalendarDays,
  FaClock,
  FaGlobe,
  FaLocationDot,
  FaMicrochip,
  FaPeopleGroup,
  FaTrophy,
  FaUserGear,
  FaUsers,
  FaWrench,
} from 'react-icons/fa6'
import { useRevealOnView } from '../hooks/useRevealOnView'
import './AgendaSection.css'

const META = [
  {
    icon: FaCalendarDays,
    title: '22 - 25 octobre 2026',
    text: "4 jours d'evenements",
  },
  {
    icon: FaLocationDot,
    title: "Palais de la culture d'Abidjan",
    text: 'Abidjan, Cote d’Ivoire',
  },
  {
    icon: FaUsers,
    title: '10 000+',
    text: 'Jeunes talents attendus',
  },
] as const

const AGENDA = [
  {
    step: '01',
    title: 'Preparation',
    accent: 'green',
    date: 'Mercredi 22 octobre 2026',
    points: [
      {
        icon: FaPeopleGroup,
        time: '07h30 - 09h00',
        text: 'Accueil des equipes, coordination terrain et briefing des jurys.',
      },
      {
        icon: FaClock,
        time: '09h30 - 12h00',
        text: 'Installation des espaces, reperages techniques et tests logistiques.',
      },
      {
        icon: FaWrench,
        time: '14h00 - 18h00',
        text: 'Finalisation des ateliers, verification des materiels et parcours visiteurs.',
      },
    ],
    note: 'Mise en place des dispositifs avant lancement officiel.',
  },
  {
    step: '02',
    title: "Ceremonie d'ouverture",
    accent: 'orange',
    date: 'Jeudi 23 octobre 2026',
    points: [
      {
        icon: FaGlobe,
        time: '08h30 - 10h00',
        text: 'Ouverture des espaces, accueil des partenaires et mise en place protocolaire.',
      },
      {
        icon: FaUsers,
        time: '10h00 - 12h00',
        text: 'Ceremonie institutionnelle, prises de parole et lancement du rendez-vous.',
      },
      {
        icon: FaTrophy,
        time: '14h00 - 17h30',
        text: 'Premieres demonstrations, immersion des delegations et visites officielles.',
      },
    ],
    note: 'Une entree en matiere ambitieuse, visible et inspiree.',
  },
  {
    step: '03',
    title: 'Competitions et rencontres',
    accent: 'navy',
    date: 'Vendredi 24 octobre 2026',
    points: [
      {
        icon: FaMicrochip,
        time: '08h00 - 12h30',
        text: 'Epreuves metiers, challenges techniques et activations innovation.',
      },
      {
        icon: FaUserGear,
        time: '10h00 - 15h00',
        text: 'Conferences, rencontres filieres et temps forts autour de l’employabilite.',
      },
      {
        icon: FaPeopleGroup,
        time: '15h00 - 18h00',
        text: 'Echanges B2B, networking partenaires et valorisation des talents.',
      },
    ],
    note: 'La journee la plus dense pour l’experience competition et reseau.',
  },
  {
    step: '04',
    title: 'Finales et cloture',
    accent: 'green',
    date: 'Samedi 25 octobre 2026',
    points: [
      {
        icon: FaTrophy,
        time: '08h00 - 11h30',
        text: 'Finales, deliberations et validation des performances par les jurys.',
      },
      {
        icon: FaClock,
        time: '12h30 - 16h00',
        text: 'Animations, temps publics, decouverte des savoir-faire et parcours visiteurs.',
      },
      {
        icon: FaCalendarDays,
        time: '17h00 - 20h30',
        text: 'Ceremonie de cloture, remise des distinctions et moment de celebration.',
      },
    ],
    note: 'Une conclusion premium pour marquer l’excellence et la suite.',
  },
] as const

export function AgendaSection() {
  const { ref, isVisible } = useRevealOnView<HTMLElement>()

  return (
    <section
      ref={ref}
      id="agenda"
      className={`agenda-section${isVisible ? ' agenda-section--visible' : ''}`}
      aria-labelledby="agenda-section-title"
    >
      <div className="agenda-section__inner">
        <header className="agenda-section__header">
          <div className="agenda-section__heading">
            <p className="agenda-section__eyebrow">Agenda</p>
            <h2 id="agenda-section-title">Le programme WorldSkills Cote d’Ivoire 2026</h2>
            <p className="agenda-section__lead">
              Quatre temps forts pour faire rayonner la competition, les metiers
              et l’avenir des talents.
            </p>
          </div>

          <ul className="agenda-section__meta">
            {META.map(({ icon: Icon, title, text }) => (
              <li key={title} className="agenda-section__meta-item">
                <span className="agenda-section__meta-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
              </li>
            ))}
          </ul>
        </header>

        <div className="agenda-section__grid">
          {AGENDA.map((item) => (
            <article
              key={item.step}
              className={`agenda-card agenda-card--${item.accent}`}
            >
              <div className="agenda-card__top">
                <div className="agenda-card__step">{item.step}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p className="agenda-card__date">{item.date}</p>
                </div>
              </div>

              <ul className="agenda-card__list">
                {item.points.map(({ icon: Icon, time, text }) => (
                  <li key={time + text}>
                    <span className="agenda-card__bullet" aria-hidden="true">
                      <Icon />
                    </span>
                    <div>
                      <strong>{time}</strong>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="agenda-card__note">{item.note}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
