export type SkillCategory =
  | 'technologie-tertiaire'
  | 'hotellerie-agroalimentaire'
  | 'technologie-industrielle'
  | 'arts-mode-esthetique'
  | 'batiment'

export type Skill = {
  id: string
  name: string
  category: SkillCategory
  icon: string
}

const DISCIPLINE_IMAGE_FILES = [
  'Aéronautique.jpg',
  'Bar cocktail.jpg',
  'Boulangerie-pâtisserie.jpg',
  'Communication.jpg',
  'Couture.jpg',
  'Cuisine.jpg',
  'Finance-comptabilité.jpg',
  'Froid-climatisation.jpeg',
  'Maintenance industrielle et usinage CNC.jpg',
  'Mécanique automobile.jpg',
  'Mécatronique.jpg',
  'Numérique et technologie.jpg',
  'Robotique.jpg',
  'Soudage.jpg',
  'Transformation agroalimentaire.jpg',
  'WhatsApp Image 2026-06-02 at 11.05.13.jpeg',
  'bijouterie.jpeg',
  'coiffure.jpeg',
  'domotique.jpeg',
  'electricité.jpeg',
  'entrepreneuriat.jpg',
  'peinture.jpeg',
] as const

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const FILE_INDEX = DISCIPLINE_IMAGE_FILES.map((file) => ({
  file,
  normalized: normalize(file.replace(/\.[^.]+$/, '')),
}))

export function getSkillImageCandidates(id: string, name: string): string[] {
  const idNormalized = normalize(id.replace(/-/g, ' '))
  const nameNormalized = normalize(name)

  const matched = FILE_INDEX.find(
    (entry) =>
      entry.normalized.includes(nameNormalized) ||
      nameNormalized.includes(entry.normalized) ||
      entry.normalized.includes(idNormalized),
  )

  const strictByIdBase = `/image discipline/${id}`
  const strictCandidates = [
    `${strictByIdBase}.jpg`,
    `${strictByIdBase}.jpeg`,
    `${strictByIdBase}.png`,
    `${strictByIdBase}.webp`,
    `${strictByIdBase}.avif`,
  ]

  if (!matched) return strictCandidates

  return [`/image discipline/${matched.file}`, ...strictCandidates]
}

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  'technologie-tertiaire': 'TECHNOLOGIE TERTIAIRE',
  'hotellerie-agroalimentaire': 'HOTELLERIE ET AGROALIMENTAIRE',
  'technologie-industrielle': 'TECHNOLOGIE INDUSTRIELLE',
  'arts-mode-esthetique': 'ARTS – MODE ET ESTHETIQUE',
  batiment: 'BATIMENT',
}

/** Domaines professionnels concernés — WorldSkills Côte d'Ivoire. */
export const SKILLS: Skill[] = [
  { id: 'finance-comptabilite', name: 'Finance-comptabilité', category: 'technologie-tertiaire', icon: '📊' },
  { id: 'entrepreneuriat', name: 'Entrepreneuriat', category: 'technologie-tertiaire', icon: '💼' },
  { id: 'communication', name: 'Communication', category: 'technologie-tertiaire', icon: '📣' },

  { id: 'cuisine', name: 'Cuisine', category: 'hotellerie-agroalimentaire', icon: '👨‍🍳' },
  { id: 'boulangerie-patisserie', name: 'Boulangerie-pâtisserie', category: 'hotellerie-agroalimentaire', icon: '🥖' },
  { id: 'bar-cocktail', name: 'Bar cocktail', category: 'hotellerie-agroalimentaire', icon: '🍸' },
  { id: 'transformation-agroalimentaire', name: 'Transformation agroalimentaire', category: 'hotellerie-agroalimentaire', icon: '🥗' },

  {
    id: 'maintenance-cnc',
    name: 'Maintenance industrielle et usinage CNC',
    category: 'technologie-industrielle',
    icon: '⚙️',
  },
  { id: 'mecatronique', name: 'Mécatronique', category: 'technologie-industrielle', icon: '🧠' },
  { id: 'robotique', name: 'Robotique', category: 'technologie-industrielle', icon: '🤖' },
  { id: 'soudage', name: 'Soudage', category: 'technologie-industrielle', icon: '🔥' },
  { id: 'mecanique-automobile', name: 'Mécanique automobile', category: 'technologie-industrielle', icon: '🚗' },
  { id: 'aeronautique', name: 'Aéronautique', category: 'technologie-industrielle', icon: '✈️' },
  { id: 'numerique-technologie', name: 'Numérique et technologie', category: 'technologie-industrielle', icon: '💻' },

  { id: 'couture', name: 'Couture', category: 'arts-mode-esthetique', icon: '🧵' },
  { id: 'coiffure', name: 'Coiffure', category: 'arts-mode-esthetique', icon: '✂️' },
  { id: 'bijouterie', name: 'Bijouterie', category: 'arts-mode-esthetique', icon: '💎' },

  { id: 'maconnerie', name: 'Maçonnerie', category: 'batiment', icon: '🧱' },
  { id: 'menuiserie-bois', name: 'Menuiserie bois', category: 'batiment', icon: '🪚' },
  { id: 'carrelage', name: 'Carrelage', category: 'batiment', icon: '🟫' },
  { id: 'peinture', name: 'Peinture', category: 'batiment', icon: '🎨' },
  { id: 'installation-sanitaire', name: 'Installation sanitaire', category: 'batiment', icon: '🚿' },
  { id: 'electricite', name: 'Électricité', category: 'batiment', icon: '⚡' },
  { id: 'froid-climatisation', name: 'Froid-climatisation', category: 'batiment', icon: '❄️' },
  { id: 'domotique', name: 'Domotique', category: 'batiment', icon: '🏠' },
]

export const WORLD_SKILLS_STATS = {
  disciplines: 25,
  competitors: 1500,
  finalistsAndExhibitors: 300,
  editionNumber: 6,
  editionYear: 2026,
  foundingYear: 2021,
} as const
