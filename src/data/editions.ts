export type Competitor = {
  id: string
  name: string
  username: string
  age: number
  region: string
  city: string
  establishment?: string
  photoSrc: string
  bio: string
  /** Discipline / métier en compétition */
  tradition: string
  votes: number
  points: number
  quizPoints: number
  mentorName: string
  mentorSubtitle: string
  videoSrc?: string
}

/** @deprecated Alias pour compatibilité EditionPage */
export type Candidate = Competitor

type CompetitorInput = Omit<
  Competitor,
  'username' | 'votes' | 'points' | 'quizPoints' | 'mentorName' | 'mentorSubtitle'
> &
  Partial<Pick<Competitor, 'username' | 'votes' | 'points' | 'quizPoints' | 'mentorName' | 'mentorSubtitle'>>

function enrichCompetitors(list: CompetitorInput[]): Competitor[] {
  const pointPresets = [4520, 4180, 3860, 3520, 3280, 3010, 2760, 2540]

  return list.map((item, index) => {
    const slug = item.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')

    return {
      username: item.username ?? `${slug}_${String(index + 1).padStart(2, '0')}`,
      votes: item.votes ?? 0,
      points: item.points ?? pointPresets[index] ?? 1500,
      quizPoints: item.quizPoints ?? 0,
      mentorName: item.mentorName ?? 'Encadrement',
      mentorSubtitle: item.mentorSubtitle ?? 'METFPA',
      videoSrc: item.videoSrc ?? '/video.mp4',
      ...item,
    }
  })
}

export type EditionPrize = {
  title: string
  description: string
}

export type EditionSponsor = {
  name: string
  logoSrc: string
  tier: 'principal' | 'or' | 'argent' | 'bronze'
}

export type Edition = {
  year: number
  status: 'current' | 'past'
  title: string
  theme: string
  tagline: string
  description: string
  coverImageSrc: string
  videoSrc: string
  videoPosterSrc: string
  dates: string
  location: string
  candidateCount: number
  candidates: Competitor[]
  winnerId?: string
  prizes: EditionPrize[]
  rulesSummary: string[]
  rulesDocumentHref: string
  sponsors: EditionSponsor[]
  highlights: string[]
}

const PHOTO = (seed: string) => `https://picsum.photos/seed/wsci-${seed}/480/640`

export const EDITIONS: Edition[] = [
  {
    year: 2025,
    status: 'current',
    title: 'WorldSkills Côte d’Ivoire 2025',
    theme: 'Les métiers au cœur de la croissance économique',
    tagline: '5ᵉ édition des Olympiades des métiers — finale nationale au LTA.',
    description:
      'Organisées par le METFPA via la Direction de la Vie scolaire, les Olympiades des métiers réunissent les meilleurs apprenants des établissements de formation professionnelle. Présélections régionales à Abidjan, Bouaké, Gagnoa et Korhogo, puis finale nationale au Lycée technique d’Abidjan-Cocody.',
    coverImageSrc: '/miss.jpg',
    videoSrc: '/video.mp4',
    videoPosterSrc: '/miss.jpg',
    dates: '26 — 29 novembre 2025',
    location: 'Lycée technique d’Abidjan-Cocody (LTA)',
    candidateCount: 325,
    candidates: enrichCompetitors([
      {
        id: '2025-kouame',
        name: 'Kouamé Amani',
        age: 20,
        region: 'Gôh',
        city: 'Gagnoa',
        establishment: 'LPIG Gagnoa',
        photoSrc: PHOTO('2025-kouame'),
        tradition: 'Menuiserie',
        bio: 'Médaillé or menuiserie — présélection Gagnoa. Projet : atelier mobile de formation.',
      },
      {
        id: '2025-traore',
        name: 'Aminata Traoré',
        age: 19,
        region: 'Lagunes',
        city: 'Abidjan',
        establishment: 'LTA Cocody',
        photoSrc: PHOTO('2025-traore'),
        tradition: 'Cuisine',
        bio: 'Finaliste nationale — excellence en service et créativité culinaire.',
      },
      {
        id: '2025-diallo',
        name: 'Mamadou Diallo',
        age: 21,
        region: 'Savanes',
        city: 'Korhogo',
        establishment: 'Lycée professionnel Korhogo',
        photoSrc: PHOTO('2025-diallo'),
        tradition: 'Électricité automobile',
        bio: 'Repéré lors des phases régionales pour la rigueur technique et la sécurité.',
      },
      {
        id: '2025-kone',
        name: 'Fatou Koné',
        age: 22,
        region: 'Vallée du Bandama',
        city: 'Bouaké',
        establishment: 'CFP Bouaké',
        photoSrc: PHOTO('2025-kone'),
        tradition: 'CAO / DAO',
        bio: 'Compétitrice en conception assistée par ordinateur — profil innovation.',
      },
    ]),
    winnerId: '2025-kouame',
    prizes: [
      {
        title: 'Médaille nationale',
        description: 'Reconnaissance officielle du METFPA et sélection pour les phases internationales.',
      },
      {
        title: 'Accompagnement Académie des Talents (ACT)',
        description: 'Orientation vers les filières d’excellence et le mentorat professionnel.',
      },
      {
        title: 'Visibilité partenaires',
        description: 'Mise en avant auprès des entreprises engagées (CIE, secteur privé, ONG).',
      },
    ],
    rulesSummary: [
      'Être apprenant d’un établissement de formation professionnelle agréé.',
      'Avoir entre 15 et 23 ans (règlement WorldSkills International).',
      'Être sélectionné via les présélections régionales officielles.',
      'Respecter le règlement technique de chaque discipline.',
    ],
    rulesDocumentHref: '#contact',
    sponsors: [
      { name: 'METFPA', logoSrc: '/trustCaroussel/port-1.png', tier: 'principal' },
      { name: 'CIE', logoSrc: '/trustCaroussel/port-2.png', tier: 'or' },
      { name: 'Partenaire Or', logoSrc: '/trustCaroussel/port-3.png', tier: 'or' },
      { name: 'Partenaire Argent', logoSrc: '/trustCaroussel/port-4.png', tier: 'argent' },
      { name: 'Partenaire Bronze', logoSrc: '/trustCaroussel/port-5.png', tier: 'bronze' },
    ],
    highlights: [
      '28 disciplines',
      '15 établissements finalistes',
      '325+ compétiteurs',
      '4 villes de présélection',
    ],
  },
  {
    year: 2024,
    status: 'past',
    title: 'WorldSkills Côte d’Ivoire 2024',
    theme: 'Assurer l’adéquation compétences–employabilité pour un développement durable',
    tagline: '4ᵉ édition — 271 compétiteurs, 46 établissements.',
    description:
      'Phases finales sur cinq corps de métiers après un mois de présélections. Village partenaires et stands d’exposition au LTA.',
    coverImageSrc: '/miss.jpg',
    videoSrc: '/video.mp4',
    videoPosterSrc: '/miss.jpg',
    dates: 'Novembre 2024',
    location: 'Lycée technique d’Abidjan-Cocody',
    candidateCount: 271,
    winnerId: '2024-yao',
    candidates: enrichCompetitors([
      {
        id: '2024-yao',
        name: 'Jean Yao',
        age: 20,
        region: 'Lagunes',
        city: 'Abidjan',
        establishment: 'LTA Cocody',
        photoSrc: PHOTO('2024-yao'),
        tradition: 'Domotique',
        bio: 'Lauréat édition 2024 — domotique et systèmes intelligents.',
      },
      {
        id: '2024-bamba',
        name: 'Salimata Bamba',
        age: 19,
        region: 'Comoé',
        city: 'Aboisso',
        establishment: 'Lycée pro Aboisso',
        photoSrc: PHOTO('2024-bamba'),
        tradition: 'Esthétique',
        bio: 'Finaliste — excellence en soins et image professionnelle.',
      },
    ]),
    prizes: [
      { title: 'Médailles par discipline', description: 'Or, argent et bronze selon les standards WorldSkills.' },
    ],
    rulesSummary: ['Édition clôturée — règlement 2024 archivé.'],
    rulesDocumentHref: '#contact',
    sponsors: [
      { name: 'METFPA', logoSrc: '/trustCaroussel/port-6.png', tier: 'principal' },
      { name: 'CIE', logoSrc: '/trustCaroussel/port-7.png', tier: 'or' },
    ],
    highlights: ['271 compétiteurs', '68 équipes', '46 établissements'],
  },
  {
    year: 2021,
    status: 'past',
    title: 'WorldSkills Côte d’Ivoire 2021',
    theme: 'Lancement des Olympiades des métiers en Côte d’Ivoire',
    tagline: 'Première édition — 4 disciplines pilotes.',
    description:
      'Naissance des Olympiades des métiers en Côte d’Ivoire, alignées sur le mouvement WorldSkills International né en 1950.',
    coverImageSrc: '/miss.jpg',
    videoSrc: '/video.mp4',
    videoPosterSrc: '/miss.jpg',
    dates: '2021',
    location: 'Abidjan',
    candidateCount: 48,
    candidates: enrichCompetitors([
      {
        id: '2021-demo',
        name: 'Équipe pilote',
        age: 18,
        region: 'Lagunes',
        city: 'Abidjan',
        establishment: 'LTA Cocody',
        photoSrc: PHOTO('2021-demo'),
        tradition: 'Métiers techniques',
        bio: 'Édition inaugurale — pose des bases du dispositif national.',
      },
    ]),
    prizes: [{ title: 'Lauréats pilotes', description: 'Premiers médaillés nationaux.' }],
    rulesSummary: ['Édition inaugurale.'],
    rulesDocumentHref: '#contact',
    sponsors: [{ name: 'METFPA', logoSrc: '/trustCaroussel/port-8.png', tier: 'principal' }],
    highlights: ['4 disciplines', 'Lancement national'],
  },
]

export const CURRENT_EDITION_YEAR = 2025

export function getEditionByYear(year: number): Edition | undefined {
  return EDITIONS.find((e) => e.year === year)
}

export function getCurrentEdition(): Edition {
  return getEditionByYear(CURRENT_EDITION_YEAR) ?? EDITIONS[0]
}

export function getCandidateRank(edition: Edition, candidateId: string): number {
  const sorted = [...edition.candidates].sort((a, b) => b.points - a.points)
  const index = sorted.findIndex((c) => c.id === candidateId)
  return index === -1 ? 0 : index + 1
}

export function resolveVoteContext(candidateId: string | null): {
  edition: Edition
  candidate: Competitor
  rank: number
} | null {
  if (!candidateId) return null

  for (const edition of EDITIONS) {
    const candidate = edition.candidates.find((c) => c.id === candidateId)
    if (candidate) {
      return {
        edition,
        candidate,
        rank: getCandidateRank(edition, candidateId),
      }
    }
  }

  return null
}

export function parseVoteCandidateIdFromPath(): string | null {
  const match = window.location.pathname.match(/^\/vote\/([^/]+)\/?$/)
  return match?.[1] ?? null
}
