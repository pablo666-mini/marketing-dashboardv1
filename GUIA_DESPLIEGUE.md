
# Guía de Despliegue - Sistema de Gestión de Lanzamientos

## Requisitos Previos

### Herramientas Necesarias
- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**
- Cuenta de **Supabase** (para base de datos)
- Cuenta en plataforma de hosting (Vercel, Netlify, etc.)

### Credenciales Requeridas
- URL de Supabase y Anon Key
- Credenciales de la plataforma de hosting
- Dominio personalizado (opcional)

## Configuración Local

### 1. Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Instalar Dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## Configuración de Base de Datos (Supabase)

### 1. Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Configura nombre y región
4. Copia URL y Anon Key

### 2. Ejecutar Migraciones
Las migraciones están en `supabase/migrations/`. Ejecuta cada una en orden:
1. `20250612073336-62589825-5351-4f75-99c6-8a0b4e43ae34.sql`
2. `20250614152259-6930e6d1-cb90-4a58-a9a4-602c4fe5717e.sql`
3. `20250614154233-06f8913c-4b30-4e06-b3d5-a7daeec903f1.sql`
4. `20250614160226-3f99afd5-451c-4c6e-a279-ec48e13aa6f8.sql`
5. `20250614203605-9d910fff-d736-40a1-a711-cc1b00574772.sql`
6. `20250614213809-57e42578-d644-4270-89d5-b1ff40507a03.sql`
7. `20250614215327-4dfe2913-d986-4e07-9c78-cd302e78cc1e.sql`
8. `20250614221025-9ce8cb5c-8868-489e-939c-d9a4ffb20053.sql`
9. `20250614223144-e6a851c1-28ab-4ab7-83b2-d3eec0ed0005.sql`

### 3. Configurar Políticas RLS (Row Level Security)
Por defecto, las tablas no tienen políticas RLS configuradas. Para un entorno de producción:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Repetir para todas las tablas

-- Crear políticas básicas (ejemplo)
CREATE POLICY "Enable all operations for authenticated users" ON social_posts
    FOR ALL USING (auth.role() = 'authenticated');
```

## Despliegue en Producción

### Opción 1: Vercel (Recomendado)

#### Desde GitHub
1. Conecta tu repositorio a Vercel
2. Configura variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automático desde la rama principal

#### Desde CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Redeploy con nuevas variables
vercel --prod
```

### Opción 2: Netlify

#### Desde Git
1. Conecta repositorio en Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configura variables de entorno en Settings

#### Configuración de Deploy
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Opción 3: Deploy Manual

#### Build para Producción
```bash
npm run build
```

Los archivos estáticos estarán en la carpeta `dist/`

#### Subir a Servidor
- Copia el contenido de `dist/` a tu servidor web
- Configura servidor para servir SPA (Single Page Application)
- Configura HTTPS y dominio personalizado

## Configuración de Dominio Personalizado

### En Vercel
1. Ve a Project Settings → Domains
2. Agrega tu dominio personalizado
3. Configura DNS según instrucciones

### En Netlify
1. Ve a Site Settings → Domain Management
2. Agrega dominio personalizado
3. Configura DNS records

### Configuración DNS Típica
```
Tipo    Nombre    Valor
A       @         IP_DEL_HOSTING
CNAME   www       tu-proyecto.vercel.app
```

## Monitoreo y Mantenimiento

### Logs y Debugging
- **Vercel**: Ve a Functions → View Function Logs
- **Netlify**: Ve a Site Dashboard → Functions
- **Browser Console**: Para debugging frontend

### Variables de Entorno de Producción
```env
# Production .env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
VITE_APP_ENV=production
```

### Backup de Base de Datos
```bash
# Backup manual desde Supabase Dashboard
# Settings → Database → Backup

# O usando CLI de Supabase
supabase db dump --db-url "postgresql://..." > backup.sql
```

### Actualizaciones
```bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Corregir automáticamente
npm audit fix
```

## Troubleshooting

### Errores Comunes

#### Build Falla
- Verificar versión de Node.js
- Limpiar caché: `rm -rf node_modules package-lock.json && npm install`
- Verificar variables de entorno

#### Problemas de Conexión a Supabase
- Verificar URL y API Key
- Comprobar políticas RLS
- Revisar logs de Supabase

#### Problemas de Routing
- Configurar redirects para SPA
- Verificar configuración de servidor web

### Contacto de Soporte
- Revisar documentación de la plataforma de hosting
- Consultar logs de error específicos
- Verificar status de servicios (Supabase, Vercel, etc.)

## Checklist de Despliegue

### Pre-despliegue
- [ ] Código probado localmente
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Build exitoso sin errores

### Despliegue
- [ ] Deploy ejecutado correctamente
- [ ] Variables de entorno configuradas en producción
- [ ] SSL/HTTPS habilitado
- [ ] Dominio personalizado configurado (opcional)

### Post-despliegue
- [ ] Aplicación accesible en producción
- [ ] Funcionalidades principales funcionando
- [ ] Base de datos conectada correctamente
- [ ] Monitoreo configurado
- [ ] Backup programado

### Mantenimiento Continuo
- [ ] Actualizaciones de seguridad aplicadas
- [ ] Monitoreo de performance
- [ ] Backup regular de datos
- [ ] Documentación actualizada
