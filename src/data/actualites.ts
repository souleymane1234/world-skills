export type ActualiteItem = {
  id: number
  title: string
  slug: string
  image: string
  source: string
  publishedAt: string
  link: string
  category: string
  description: string
  content: string
}

export const ACTUALITES: ActualiteItem[] = [
  {
    id: 1,
    title: 'Olympiades des métiers 5e édition',
    slug: 'olympiades-des-metiers-5e-edition',
    image:
      'https://scontent.fabj3-2.fna.fbcdn.net/v/t39.30808-6/581435147_1141417824829922_7309119020482348035_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CbF92XNDHF0Q7kNvwGj_gWv&_nc_oc=AdqaTDuJIwyXANKGNA_q3MTa-CzGwueRj1q4MKMOaKUu6qR7npT9zhn8wOm8bvq7Grvivgdvd5l1ZBHMW0IEWwqN&_nc_zt=23&_nc_ht=scontent.fabj3-2.fna&_nc_gid=EYb-EfQv0d4ishUVfu7daQ&_nc_ss=7b289&oh=00_Af-MMxwfSZa0kaGrhRZa3ebG4SySqk-V98vZI9UBOxpj7A&oe=6A2496DE',
    source: 'METFPA',
    publishedAt: '2025-11-12',
    link: '',
    category: 'WorldSkills',
    description: "Lancement de la 5e édition des Olympiades des Métiers Côte d'Ivoire 2025.",
    content:
      'Le Ministère de l’Enseignement Technique, de la Formation Professionnelle et de l’Apprentissage organise l’édition 2025 des Olympiades des Métiers.',
  },
  {
    id: 2,
    title: 'Annonce WorldSkillsCI 4e édition',
    slug: 'annonce-worldskillsci-4e-edition',
    image:
      'https://scontent.fabj3-2.fna.fbcdn.net/v/t39.30808-6/581336319_1140874858217552_3207561049671607049_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=dfTeUCZrqUQQ7kNvwFTdDVv&_nc_oc=AdpYrmeqjCXdNEX8gGIN74sLVCfl-e5udCO7ovr5m7nxrR7Jl_H2tyFZ7KqpDwa5CIVTT5LMePCIgVP_KoHYlyk9&_nc_zt=23&_nc_ht=scontent.fabj3-2.fna&_nc_gid=HWSCUUh2Z3uplW_efiYXXA&_nc_ss=7b289&oh=00_Af_lHY08947fB6gu9iyOnj38mZ3FiOoSZVKJp_YMMOlkDg&oe=6A248250',
    source: 'METFPA',
    publishedAt: '2024-10-22',
    link: '',
    category: 'WorldSkills',
    description: "Annonce officielle de la 4e édition des WorldSkills Côte d'Ivoire.",
    content:
      'La 4e édition des WorldSkills Côte d’Ivoire s’est tenue du 22 au 25 octobre 2024 au Parc des Expositions d’Abidjan.',
  },
  {
    id: 3,
    title: 'Candidat MGH WorldSkills 2025',
    slug: 'candidat-mgh-worldskills-2025',
    image:
      'https://scontent.fabj3-2.fna.fbcdn.net/v/t39.30808-6/589813197_875306375021917_3765662843297122933_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=5b-ZEanrb68Q7kNvwFSUBdA&_nc_oc=AdqZTt1YPU9n-FCkpzPXbum0q5HASUsUrDEWyk_15Hd0FdjLrDXLGWsvnrq3j6LfmYHSlkRhCz1gKZvdeI6Y9qjf&_nc_zt=23&_nc_ht=scontent.fabj3-2.fna&_nc_gid=pVvN13xjtEY5ANRLGLGrqw&_nc_ss=7b289&oh=00_Af8dIhhVQeaiPtiqSvfRlWuM2jhxJgmFrbSM-9p4xVgrzg&oe=6A247CD6',
    source: 'LMGH',
    publishedAt: '2025-11-26',
    link: '',
    category: 'Portrait',
    description: "Présentation des candidats du Lycée Moderne d'Hôtellerie.",
    content:
      'Le Lycée Moderne d’Hôtellerie de Grand-Bassam présente ses candidats engagés dans les Olympiades des Métiers 2025.',
  },
  {
    id: 5,
    title: 'Vainqueurs WorldSkills 2022',
    slug: 'vainqueurs-worldskills-2022',
    image:
      'https://scontent.fabj3-2.fna.fbcdn.net/v/t39.30808-6/593420727_879035687982319_1238062288344791554_n.jpg?stp=dst-jpg_s590x590_tt6&_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=1sE27v2rhwgQ7kNvwFnQ2Ek&_nc_oc=AdpgBtvOfDlpNyK49nTr7TWjJTMrZ6RXpVKI7jLoEGqtWQI_oUn4OXBcX3lZr0cmhv0AkoVFyuY6Py1KJxDyIFio&_nc_zt=23&_nc_ht=scontent.fabj3-2.fna&_nc_gid=P9FHkrsCTHcrpMSYJrdTYQ&_nc_ss=7b289&oh=00_Af8mLhjdLscCieNW0Wlq8yaEwWgsHd8TROUDS3Itqrz_rg&oe=6A248A09',
    source: 'METFPA',
    publishedAt: '2022-12-21',
    link: '',
    category: 'Résultats',
    description: "Annonce des vainqueurs de l'édition 2022.",
    content:
      'Les meilleurs compétiteurs de l’édition 2022 ont été récompensés dans plusieurs catégories.',
  },
  {
    id: 6,
    title: '68 équipes qualifiées pour les phases finales',
    slug: '68-equipes-qualifiees-phases-finales',
    image: 'https://www.fratmat.info/uploads/images/2024/11/09/217944.jpg',
    source: 'Fraternité Matin',
    publishedAt: '2024-11-09',
    link: 'https://www.fratmat.info/uploads/images/2024/11/09/217944.jpg',
    category: 'Qualification',
    description: '68 équipes accèdent aux phases finales des Olympiades.',
    content:
      'Les présélections régionales ont permis de retenir 68 équipes pour les phases finales.',
  },
  {
    id: 8,
    title: 'Olympiades arts et métiers Man',
    slug: 'olympiades-arts-et-metiers-man',
    image:
      'https://man-info.net/wp-content/uploads/2025/03/IMG-20250320-WA0157-1536x1152.jpg',
    source: 'Man Info',
    publishedAt: '2025-03-14',
    link: 'https://man-info.net/wp-content/uploads/2025/03/IMG-20250320-WA0157-1536x1152.jpg',
    category: 'Arts et Métiers',
    description: 'Compétition organisée au Lycée Technique de Man.',
    content:
      'Les épreuves ont réuni plusieurs établissements techniques et professionnels autour de différentes disciplines.',
  },
  {
    id: 9,
    title: 'Les Olympiades des métiers valorisent les talents des jeunes',
    slug: 'olympiades-des-metiers-valorisent-les-talents-des-jeunes',
    image: 'https://ivoire.ci/uploads/images/202511/image_870x_6929f98dd7d4f.jpg',
    source: 'Ivoire.ci',
    publishedAt: '2025-11-08',
    link: 'https://ivoire.ci/uploads/images/202511/image_870x_6929f98dd7d4f.jpg',
    category: 'Actualité',
    description: 'Les Olympiades révèlent les talents et savoir-faire des jeunes.',
    content:
      'Les Olympiades des métiers ont pour objectif de révéler les talents et de valoriser les compétences professionnelles.',
  },
  {
    id: 10,
    title: "WorldSkills Côte d'Ivoire 2024 : la DVS mobilise les entreprises",
    slug: 'worldskills-cote-divoire-2024-la-dvs-mobilise-les-entreprises',
    image:
      'https://jdeditionsmagazine.tv/wp-content/uploads/2024/10/JD-Mag-Cote-dIvoire-Enseignement-Technique-Olympiades-des-Metiers-WorldSkills-Cote-dIvoire-2024-La-DVS-mobilise-les-entreprises.jpg',
    source: 'JD Éditions Magazine',
    publishedAt: '2024-10-24',
    link:
      'https://jdeditionsmagazine.tv/wp-content/uploads/2024/10/JD-Mag-Cote-dIvoire-Enseignement-Technique-Olympiades-des-Metiers-WorldSkills-Cote-dIvoire-2024-La-DVS-mobilise-les-entreprises.jpg',
    category: 'Partenariat',
    description: 'Mobilisation des entreprises pour accompagner les compétiteurs.',
    content:
      'La Direction de la Vie Scolaire et plusieurs partenaires privés se sont engagés pour soutenir les Olympiades des Métiers Côte d’Ivoire 2024.',
  },
]
