
// Mock data for the social media management dashboard
import { 
  SocialProfile, 
  SocialPost, 
  Product, 
  GeneralInfo, 
  Platform,
  ContentType,
  PostStatus,
  ContentFormat
} from '@/types';

// Mock Social Profiles
export const mockProfiles: SocialProfile[] = [
  {
    id: '1',
    name: 'Miniland España',
    handle: '@miniland_es',
    platform: 'Instagram',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Miniland Official',
    handle: '@minilandofficial',
    platform: 'TikTok',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Miniland',
    handle: '@miniland',
    platform: 'LinkedIn',
    active: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Miniland',
    handle: '@miniland_oficial',
    platform: 'X',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Miniland Toys',
    handle: '@minilandtoys',
    platform: 'Pinterest',
    active: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'Miniland',
    handle: '@MinilandChannel',
    platform: 'YouTube',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Dolls Collection 2024',
    description: 'Nueva colección de muñecas inclusivas y diversas',
    landingUrl: 'https://miniland.com/dolls-2024',
    hashtags: ['#miniland', '#dolls2024', '#diversidad', '#inclusion'],
    briefing: 'Lanzamiento de la nueva colección de muñecas que celebra la diversidad y la inclusión',
    communicationKitUrl: 'https://drive.google.com/folder/dolls2024',
    countries: ['España', 'Francia', 'Italia', 'Portugal'],
    salesObjectives: ['Incrementar ventas 25%', 'Expandir mercado europeo', 'Posicionamiento premium'],
    creativeConcept: 'Celebrando la diversidad a través del juego',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Smart Toys Line',
    description: 'Línea de juguetes educativos inteligentes',
    landingUrl: 'https://miniland.com/smart-toys',
    hashtags: ['#smarttoys', '#educacion', '#tecnologia', '#miniland'],
    briefing: 'Productos educativos que combinan tecnología y aprendizaje',
    communicationKitUrl: 'https://drive.google.com/folder/smarttoys',
    countries: ['España', 'Reino Unido', 'Alemania'],
    salesObjectives: ['Penetrar mercado tech-edu', 'Diferenciación premium'],
    creativeConcept: 'El futuro del aprendizaje está aquí',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Mock Posts
export const mockPosts: SocialPost[] = [
  {
    id: '1',
    productId: '1',
    date: '2024-06-15T10:00:00Z',
    profileId: '1',
    contentType: 'Post',
    contentFormat: '1:1',
    mediaResources: [
      {
        id: '1',
        name: 'dolls_hero_1x1.jpg',
        type: 'image',
        url: '/api/media/dolls_hero_1x1.jpg',
        format: '1:1'
      }
    ],
    copies: [
      {
        platform: 'Instagram',
        content: '✨ Descubre nuestra nueva colección de muñecas 2024 ✨\n\nCada muñeca cuenta una historia única de diversidad e inclusión. ¿Cuál será tu favorita?\n\n#miniland #dolls2024 #diversidad #inclusion',
        hashtags: ['#miniland', '#dolls2024', '#diversidad', '#inclusion']
      }
    ],
    hashtags: ['#miniland', '#dolls2024', '#diversidad', '#inclusion'],
    status: 'Approved',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-05T00:00:00Z'
  },
  {
    id: '2',
    productId: '1',
    date: '2024-06-16T14:30:00Z',
    profileId: '2',
    contentType: 'Reel',
    contentFormat: '9:16',
    mediaResources: [
      {
        id: '2',
        name: 'dolls_reel_9x16.mp4',
        type: 'video',
        url: '/api/media/dolls_reel_9x16.mp4',
        format: '9:16'
      }
    ],
    copies: [
      {
        platform: 'TikTok',
        content: 'POV: Encontraste la muñeca perfecta que te representa 💕\n\n#miniland #dolls2024 #representacion #diversidad #fyp',
        hashtags: ['#miniland', '#dolls2024', '#representacion', '#diversidad', '#fyp']
      }
    ],
    hashtags: ['#miniland', '#dolls2024', '#representacion', '#diversidad', '#fyp'],
    status: 'Pending',
    createdAt: '2024-06-02T00:00:00Z',
    updatedAt: '2024-06-02T00:00:00Z'
  },
  {
    id: '3',
    productId: '2',
    date: '2024-06-20T09:00:00Z',
    profileId: '3',
    contentType: 'Post',
    contentFormat: '4:5',
    mediaResources: [
      {
        id: '3',
        name: 'smart_toys_linkedin_4x5.jpg',
        type: 'image',
        url: '/api/media/smart_toys_linkedin_4x5.jpg',
        format: '4:5'
      }
    ],
    copies: [
      {
        platform: 'LinkedIn',
        content: 'En Miniland, creemos que la tecnología debe ser una herramienta para potenciar el aprendizaje.\n\nNuestra nueva línea Smart Toys combina innovación y educación para preparar a los niños para el futuro.\n\n#educacion #tecnologia #innovacion #miniland',
        hashtags: ['#educacion', '#tecnologia', '#innovacion', '#miniland']
      }
    ],
    hashtags: ['#educacion', '#tecnologia', '#innovacion', '#miniland'],
    status: 'Published',
    createdAt: '2024-06-03T00:00:00Z',
    updatedAt: '2024-06-10T00:00:00Z',
    publishedAt: '2024-06-10T09:00:00Z'
  }
];

// Mock General Info
export const mockGeneralInfo: GeneralInfo = {
  protocols: [
    {
      id: '1',
      title: 'Nomenclatura de Imágenes',
      description: 'Protocolo para nombrar archivos de imágenes',
      type: 'image_naming',
      content: 'Formato: [producto]_[tipo]_[formato]_[version].ext\nEjemplo: dolls2024_hero_1x1_v1.jpg'
    },
    {
      id: '2',
      title: 'Estructura de Briefing',
      description: 'Plantilla estándar para briefings de campaña',
      type: 'briefing',
      content: '1. Objetivo de campaña\n2. Público objetivo\n3. Mensaje clave\n4. Tono de comunicación\n5. Call to action\n6. KPIs a medir'
    },
    {
      id: '3',
      title: 'Uso de Hashtags',
      description: 'Guía para el uso correcto de hashtags por plataforma',
      type: 'hashtags',
      content: 'Instagram: Máximo 30, usar 5-10 principales\nTikTok: 3-5 hashtags trending + branded\nLinkedIn: 3-5 hashtags profesionales\nX: 1-2 hashtags máximo'
    }
  ],
  mediaKit: [
    {
      id: '1',
      name: 'Convocatoria de Prensa Dolls 2024',
      category: 'press_convocation',
      url: '/api/media/press_convocation_dolls2024.pdf',
      description: 'Convocatoria oficial para el lanzamiento'
    },
    {
      id: '2',
      name: 'Nota de Prensa Smart Toys',
      category: 'press_note',
      url: '/api/media/press_note_smarttoys.pdf',
      description: 'Comunicado oficial Smart Toys Line'
    },
    {
      id: '3',
      name: 'Banners Promocionales',
      category: 'banners',
      url: '/api/media/banners/',
      description: 'Colección de banners en diferentes formatos'
    },
    {
      id: '4',
      name: 'Fotografías Producto',
      category: 'photos',
      url: '/api/media/photos/',
      description: 'Banco de imágenes oficiales de productos'
    },
    {
      id: '5',
      name: 'Videos Corporativos',
      category: 'videos',
      url: '/api/media/videos/',
      description: 'Contenido audiovisual para campañas'
    }
  ],
  updatedAt: '2024-06-01T00:00:00Z'
};
