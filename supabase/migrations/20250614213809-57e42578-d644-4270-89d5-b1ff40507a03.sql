
-- Crear tabla para protocolos de comunicación
CREATE TABLE public.protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('image_naming', 'briefing', 'hashtags', 'general')),
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla para recursos del kit de medios
CREATE TABLE public.media_kit_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('press_convocation', 'press_note', 'banners', 'photos', 'videos')),
  url TEXT NOT NULL,
  format TEXT,
  file_size BIGINT,
  tags TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_protocols_type ON public.protocols(type);
CREATE INDEX idx_protocols_active ON public.protocols(active);
CREATE INDEX idx_media_kit_category ON public.media_kit_resources(category);
CREATE INDEX idx_media_kit_active ON public.media_kit_resources(active);
CREATE INDEX idx_media_kit_tags ON public.media_kit_resources USING GIN(tags);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_protocols_updated_at 
    BEFORE UPDATE ON public.protocols 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_kit_updated_at 
    BEFORE UPDATE ON public.media_kit_resources 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos protocolos de ejemplo
INSERT INTO public.protocols (title, description, type, content) VALUES
(
  'Nomenclatura de Imágenes',
  'Estándares para el naming de archivos multimedia',
  'image_naming',
  'Estructura del nombre de archivo:
[PRODUCTO]_[TIPO_CONTENIDO]_[FECHA]_[VERSIÓN]

Ejemplos:
- PRODUCTO_POST_20240614_V1.jpg
- PRODUCTO_STORY_20240614_V1.mp4
- PRODUCTO_REEL_20240614_V2.jpg

Normas:
- Usar MAYÚSCULAS para el nombre del producto
- Fechas en formato YYYYMMDD
- Versiones con V + número
- No usar espacios ni caracteres especiales'
),
(
  'Estructura de Briefing',
  'Template estándar para briefings de contenido',
  'briefing',
  'BRIEFING DE CONTENIDO

1. OBJETIVO DE LA PUBLICACIÓN
   - ¿Qué queremos conseguir?
   - Métrica principal a impactar

2. AUDIENCIA TARGET
   - Demografía
   - Intereses
   - Comportamiento

3. MENSAJE CLAVE
   - Propuesta de valor
   - Call to action

4. TONO Y ESTILO
   - Personalidad de marca
   - Registro comunicativo

5. ESPECIFICACIONES TÉCNICAS
   - Formato requerido
   - Dimensiones
   - Duración (si aplica)

6. TIMING
   - Fecha de entrega
   - Fecha de publicación'
),
(
  'Estrategia de Hashtags',
  'Guidelines para el uso efectivo de hashtags',
  'hashtags',
  'ESTRATEGIA DE HASHTAGS

ESTRUCTURA RECOMENDADA (máx. 30):
- 5-7 hashtags de marca
- 8-10 hashtags de nicho/industria
- 10-12 hashtags de alcance medio (10K-100K posts)
- 3-5 hashtags trending/momento

CATEGORÍAS:
🎯 Marca: #NombreMarca #ProductoEspecífico
🏭 Industria: #TuSector #TendenciaIndustria
📊 Alcance: #HashtagsPopulares #ComunidadTarget
🔥 Trending: #TendenciaActual #EventoMomento

BEST PRACTICES:
- Investigar hashtags antes de usar
- Variar hashtags entre posts
- Monitorear rendimiento
- Evitar hashtags banned o shadowbanned'
);

-- Insertar algunos recursos de ejemplo para el kit de medios
INSERT INTO public.media_kit_resources (name, description, category, url, format, tags) VALUES
(
  'Logo Principal Horizontal',
  'Logo oficial de la marca en formato horizontal para redes sociales',
  'photos',
  '/media/logos/logo-horizontal.png',
  'PNG',
  ARRAY['logo', 'branding', 'oficial']
),
(
  'Template Story Instagram',
  'Plantilla base para stories de Instagram con branding corporativo',
  'banners',
  '/media/templates/story-template.psd',
  'PSD',
  ARRAY['template', 'story', 'instagram', 'branding']
),
(
  'Video Presentación Producto',
  'Video corporativo de presentación del producto principal',
  'videos',
  '/media/videos/producto-presentacion.mp4',
  'MP4',
  ARRAY['producto', 'presentacion', 'corporativo']
);
