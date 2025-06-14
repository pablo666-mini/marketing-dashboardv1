
-- Create ENUM types for launch management
CREATE TYPE launch_category AS ENUM ('Product Launch', 'Campaign', 'Update', 'Other');
CREATE TYPE launch_status AS ENUM ('Planned', 'In Progress', 'Completed', 'Canceled');
CREATE TYPE phase_status AS ENUM ('Not Started', 'In Progress', 'Completed', 'Blocked');

-- Create launches table
CREATE TABLE public.launches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category launch_category NOT NULL DEFAULT 'Other',
  status launch_status NOT NULL DEFAULT 'Planned',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  description TEXT,
  responsible TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create launch_phases table
CREATE TABLE public.launch_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  launch_id UUID NOT NULL REFERENCES public.launches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status phase_status NOT NULL DEFAULT 'Not Started',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  responsible TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for optimized queries
CREATE INDEX idx_launches_product_id ON public.launches(product_id);
CREATE INDEX idx_launches_status ON public.launches(status);
CREATE INDEX idx_launches_category ON public.launches(category);
CREATE INDEX idx_launches_start_date ON public.launches(start_date);
CREATE INDEX idx_launches_end_date ON public.launches(end_date);
CREATE INDEX idx_launch_phases_launch_id ON public.launch_phases(launch_id);
CREATE INDEX idx_launch_phases_status ON public.launch_phases(status);
CREATE INDEX idx_launch_phases_start_date ON public.launch_phases(start_date);

-- Insert sample data for testing
INSERT INTO public.launches (product_id, name, category, status, start_date, end_date, description, responsible) VALUES
(
  (SELECT id FROM public.products LIMIT 1),
  'Lanzamiento Baby Walker Q3',
  'Product Launch',
  'In Progress',
  '2025-01-15T09:00:00Z',
  '2025-03-30T18:00:00Z',
  'Lanzamiento del nuevo Baby Walker para el tercer trimestre con campaña integrada en redes sociales',
  'María González'
),
(
  (SELECT id FROM public.products LIMIT 1 OFFSET 1),
  'Campaña Navidad 2025',
  'Campaign',
  'Planned',
  '2025-11-01T00:00:00Z',
  '2025-12-31T23:59:59Z',
  'Campaña especial de Navidad con promociones y contenido temático',
  'Carlos Ruiz'
),
(
  (SELECT id FROM public.products LIMIT 1),
  'Actualización Kit Educativo',
  'Update',
  'Completed',
  '2024-12-01T08:00:00Z',
  '2024-12-20T17:00:00Z',
  'Actualización de materiales educativos y nuevas funcionalidades',
  'Ana López'
);

-- Insert sample launch phases
INSERT INTO public.launch_phases (launch_id, name, status, start_date, end_date, responsible, notes) VALUES
(
  (SELECT id FROM public.launches WHERE name = 'Lanzamiento Baby Walker Q3'),
  'Investigación de Mercado',
  'Completed',
  '2025-01-15T09:00:00Z',
  '2025-01-30T17:00:00Z',
  'María González',
  'Análisis completado con insights clave sobre público objetivo'
),
(
  (SELECT id FROM public.launches WHERE name = 'Lanzamiento Baby Walker Q3'),
  'Desarrollo de Contenido',
  'In Progress',
  '2025-02-01T09:00:00Z',
  '2025-02-28T17:00:00Z',
  'Equipo Creativo',
  'Creación de assets visuales y copy para todas las plataformas'
),
(
  (SELECT id FROM public.launches WHERE name = 'Lanzamiento Baby Walker Q3'),
  'Campaña en Redes',
  'Not Started',
  '2025-03-01T09:00:00Z',
  '2025-03-30T18:00:00Z',
  'Social Media Team',
  'Ejecución de campaña multiplataforma'
),
(
  (SELECT id FROM public.launches WHERE name = 'Campaña Navidad 2025'),
  'Planificación Estratégica',
  'Not Started',
  '2025-11-01T09:00:00Z',
  '2025-11-15T17:00:00Z',
  'Carlos Ruiz',
  'Definición de objetivos y estrategia general'
);
