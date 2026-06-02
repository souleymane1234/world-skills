export type SkillCategory = 'artisanat' | 'industrie' | 'services' | 'numerique' | 'agro'

export type Skill = {
  id: string
  name: string
  category: SkillCategory
  icon: string
}

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  artisanat: 'Artisanat & arts',
  industrie: 'Industrie & technique',
  services: 'Services & hôtellerie',
  numerique: 'Numérique & design',
  agro: 'Agroalimentaire',
}

/** Disciplines représentatives des Olympiades des métiers — WorldSkills CI 2025. */
export const SKILLS: Skill[] = [
  { id: 'coiffure', name: 'Coiffure', category: 'services', icon: '✂️' },
  { id: 'electricite-auto', name: 'Électricité automobile', category: 'industrie', icon: '⚡' },
  { id: 'peinture-deco', name: 'Peinture et décoration', category: 'artisanat', icon: '🎨' },
  { id: 'bijouterie', name: 'Bijouterie', category: 'artisanat', icon: '💎' },
  { id: 'mecanique-moteur', name: 'Mécanique moteur', category: 'industrie', icon: '🔧' },
  { id: 'transformation-fl', name: 'Transformation F&L', category: 'agro', icon: '🥗' },
  { id: 'cuisine', name: 'Cuisine', category: 'services', icon: '👨‍🍳' },
  { id: 'boulangerie', name: 'Boulangerie–Viennoiserie–Pâtisserie', category: 'agro', icon: '🥖' },
  { id: 'bar-cocktail', name: 'Bar et cocktail', category: 'services', icon: '🍸' },
  { id: 'service-etage', name: "Service d'étage", category: 'services', icon: '🛎️' },
  { id: 'techniques-commerciales', name: 'Techniques commerciales et banque', category: 'services', icon: '🏦' },
  { id: 'cao-dao', name: 'CAO / DAO', category: 'numerique', icon: '📐' },
  { id: 'menuiserie', name: 'Menuiserie', category: 'artisanat', icon: '🪚' },
  { id: 'domotique', name: 'Domotique', category: 'numerique', icon: '🏠' },
  { id: 'soudure', name: 'Soudure', category: 'industrie', icon: '🔥' },
  { id: 'plomberie', name: 'Plomberie', category: 'industrie', icon: '🚿' },
  { id: 'esthetique', name: 'Esthétique', category: 'services', icon: '💅' },
  { id: 'couture', name: 'Couture', category: 'artisanat', icon: '🧵' },
]

export const WORLD_SKILLS_STATS = {
  disciplines: 28,
  establishments2025: 15,
  competitors2025: 325,
  regions: 4,
  editionYear: 2025,
  foundingYear: 2021,
} as const
