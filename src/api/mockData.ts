// Mock data for the social media management dashboard
import { 
  SocialProfile, 
  SocialPost, 
  Product, 
  GeneralInfo, 
  Platform,
  ContentType,
  PostStatus,
  ContentFormat,
  PlatformCopy
} from '@/types';

// Mock Social Profiles
export const mockProfiles: SocialProfile[] = [
  {
    id: '1',
    name: 'Empresa Principal',
    handle: '@empresa_principal',
    platform: 'Instagram',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    description: 'Perfil oficial de la empresa en Instagram',
    url: 'https://instagram.com/empresa_principal',
    followers_count: 15000,
    growth_rate: 5.2,
    engagement_rate: 3.8,
    notes: 'Perfil principal con buen engagement',
    last_updated: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'TikTok Oficial',
    handle: '@empresa_tiktok',
    platform: 'TikTok',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    description: 'Contenido viral y entretenimiento',
    url: 'https://tiktok.com/@empresa_tiktok',
    followers_count: 8500,
    growth_rate: 12.1,
    engagement_rate: 7.2,
    notes: 'Crecimiento rápido en audiencia joven',
    last_updated: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'LinkedIn Corporativo',
    handle: '@empresa-linkedin',
    platform: 'LinkedIn',
    active: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    description: 'Perfil profesional y B2B',
    url: 'https://linkedin.com/company/empresa',
    followers_count: 3200,
    growth_rate: 2.1,
    engagement_rate: 4.5,
    notes: 'Temporalmente inactivo',
    last_updated: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Twitter/X Empresa',
    handle: '@empresa_x',
    platform: 'X',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    description: 'Noticias y actualizaciones rápidas',
    url: 'https://x.com/empresa_x',
    followers_count: 5400,
    growth_rate: 1.8,
    engagement_rate: 2.9,
    notes: 'Enfoque en noticias y comunicados',
    last_updated: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Pinterest Creativo',
    handle: '@empresa_pinterest',
    platform: 'Pinterest',
    active: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    description: 'Inspiración visual y productos',
    url: 'https://pinterest.com/empresa_pinterest',
    followers_count: 1200,
    growth_rate: 0.5,
    engagement_rate: 1.8,
    notes: 'Bajo rendimiento, revisando estrategia',
    last_updated: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'YouTube Canal',
    handle: '@EmpresaYT',
    platform: 'YouTube',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    description: 'Tutoriales y contenido educativo',
    url: 'https://youtube.com/@EmpresaYT',
    followers_count: 2800,
    growth_rate: 8.7,
    engagement_rate: 6.1,
    notes: 'Excelente performance en videos educativos',
    last_updated: '2024-01-01T00:00:00Z'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Dolls Collection 2024',
    description: 'Nueva colección de muñecas inclusivas y diversas',
    landing_url: 'https://miniland.com/dolls-2024',
    hashtags: ['#miniland', '#dolls2024', '#diversidad', '#inclusion'],
    briefing: 'Lanzamiento de la nueva colección de muñecas que celebra la diversidad y la inclusión',
    communication_kit_url: 'https://drive.google.com/folder/dolls2024',
    countries: ['España', 'Francia', 'Italia', 'Portugal'],
    sales_objectives: ['Incrementar ventas 25%', 'Expandir mercado europeo', 'Posicionamiento premium'],
    creative_concept: 'Celebrando la diversidad a través del juego',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Smart Toys Line',
    description: 'Línea de juguetes educativos inteligentes',
    landing_url: 'https://miniland.com/smart-toys',
    hashtags: ['#smarttoys', '#educacion', '#tecnologia', '#miniland'],
    briefing: 'Productos educativos que combinan tecnología y aprendizaje',
    communication_kit_url: 'https://drive.google.com/folder/smarttoys',
    countries: ['España', 'Reino Unido', 'Alemania'],
    sales_objectives: ['Penetrar mercado tech-edu', 'Diferenciación premium'],
    creative_concept: 'El futuro del aprendizaje está aquí',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  }
];

// Mock Posts with multi-profile support
export const mockPosts: SocialPost[] = [
  {
    id: '1',
    product_id: '1',
    post_date: '2024-06-15T10:00:00Z',
    profile_id: '1', // Legacy support
    profile_ids: ['1'], // Multi-profile support
    content_type: 'Post',
    content_format: '1:1',
    media_resources_ids: ['1'],
    copies: [
      {
        platform: 'Instagram',
        content: '✨ Descubre nuestra nueva colección de muñecas 2024 ✨\n\nCada muñeca cuenta una historia única de diversidad e inclusión. ¿Cuál será tu favorita?\n\n#miniland #dolls2024 #diversidad #inclusion',
        hashtags: ['#miniland', '#dolls2024', '#diversidad', '#inclusion']
      }
    ],
    hashtags: ['#miniland', '#dolls2024', '#diversidad', '#inclusion'],
    status: 'Approved',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-05T00:00:00Z',
    launch_id: null
  },
  {
    id: '2',
    product_id: '1',
    post_date: '2024-06-16T14:30:00Z',
    profile_id: '2', // Legacy support
    profile_ids: ['2'], // Multi-profile support
    content_type: 'Reel',
    content_format: '9:16',
    media_resources_ids: ['2'],
    copies: [
      {
        platform: 'TikTok',
        content: 'POV: Encontraste la muñeca perfecta que te representa 💕\n\n#miniland #dolls2024 #representacion #diversidad #fyp',
        hashtags: ['#miniland', '#dolls2024', '#representacion', '#diversidad', '#fyp']
      }
    ],
    hashtags: ['#miniland', '#dolls2024', '#representacion', '#diversidad', '#fyp'],
    status: 'Pending',
    created_at: '2024-06-02T00:00:00Z',
    updated_at: '2024-06-02T00:00:00Z',
    launch_id: null
  },
  {
    id: '3',
    product_id: '2',
    post_date: '2024-06-20T09:00:00Z',
    profile_id: '3', // Legacy support
    profile_ids: ['3', '4'], // Multi-profile example: LinkedIn + X
    content_type: 'Post',
    content_format: '4:5',
    media_resources_ids: ['3'],
    copies: [
      {
        platform: 'LinkedIn',
        content: 'En Miniland, creemos que la tecnología debe ser una herramienta para potenciar el aprendizaje.\n\nNuestra nueva línea Smart Toys combina innovación y educación para preparar a los niños para el futuro.\n\n#educacion #tecnologia #innovacion #miniland',
        hashtags: ['#educacion', '#tecnologia', '#innovacion', '#miniland']
      },
      {
        platform: 'X',
        content: '🚀 Smart Toys: el futuro del aprendizaje ya está aquí\n\nCombinamos tecnología e innovación para crear experiencias educativas únicas.\n\n#smarttoys #educacion #miniland',
        hashtags: ['#smarttoys', '#educacion', '#miniland']
      }
    ],
    hashtags: ['#educacion', '#tecnologia', '#innovacion', '#miniland'],
    status: 'Published',
    created_at: '2024-06-03T00:00:00Z',
    updated_at: '2024-06-10T00:00:00Z',
    launch_id: null
  }
];

// Mock General Info
export const mockGeneralInfo: GeneralInfo = {
  id: '1',
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
  media_kit: [
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
  updated_at: '2024-06-01T00:00:00Z'
};
