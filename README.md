# Apartamento Valdelagrana

Sitio web del apartamento de alquiler temporal en la Playa de Valdelagrana,
El Puerto de Santa María (Cádiz). Sitio estático servido por GitHub Pages,
con un Cloudflare Worker para la API de precios y disponibilidad.

- **Live**: https://valdelagrana.dhlr.net/
- **Repo**: https://github.com/leo-hildegarde/apartamento-valdelagrana

## Estructura

```
├── index.html              # Sitio completo (HTML + CSS + JS inline)
├── images/
│   ├── jpg/tile/           # Miniaturas 800px (JPEG)
│   ├── jpg/full/          # Imágenes 2000px (JPEG)
│   ├── webp/tile/         # Miniaturas 800px (WebP)
│   ├── webp/full/         # Imágenes 2000px (WebP)
│   └── hero.webp          # Imagen de portada
├── new pictures/          # Fotos originales en alta resolución (fuente)
├── admin/
│   └── index.html         # Backoffice de gestión (precios, fechas)
├── worker/
│   ├── worker.js          # Cloudflare Worker (API /api/state, /api/admin)
│   └── wrangler.toml      # Configuración del Worker
├── PICTURES.md            # Catálogo de las 25 fotos de la galería
├── gracias.html           # Página de agradecimiento tras el formulario
└── README.md
```

## Secciones del sitio

| Sección | ID | Descripción |
|---|---|---|
| Cabecera | `header` | Logo, navegación, selector de idioma (ES/FR/EN) |
| Hero | `#top` | Título + datos clave (45 m², 4 personas, 150 m playa) |
| El apartamento | `#apartamento` | Capacidad, distribución, stats (superficie, terraza, playa) |
| Equipamiento | `#servicios` | Parking, piscina, AC, WiFi, lavadora, lavavajillas, etc. |
| Ubicación | `#ubicacion` | Tarjetas de lugares + chips de transporte + mapa Leaflet |
| Galería | `#galeria` | 25 fotos con lightbox navegable (flechas, teclado, contador) |
| Precios | `#precios` | Tarifas por quincena (julio, agosto, septiembre) |
| Disponibilidad | `#disponibilidad` | Fechas disponibles (oculta, activar con `DATES_VISIBLE=true`) |
| Contacto | `#contacto` | Formulario (Web3Forms + hCaptcha) |
| Footer | `footer` | Nombre, "Alquiler temporada", selector de idioma |

## Internacionalización (i18n)

- 3 idiomas: **ES**, **FR**, **EN**
- 80 claves de traducción en el objeto `I18N` dentro del `<script>` de `index.html`
- Función `apply(lang)` actualiza todos los elementos con `data-i18n`
- Idioma guardado en `localStorage` (`vdg-lang`)
- Selectores de idioma en cabecera y footer (sincronizados)

## Galería

- 25 fotos en `<picture>` con responsive images (WebP + JPEG, srcset 800w/2000w)
- Lightbox con navegación: botones prev/next, flechas de teclado, contador, botón cerrar
- Última foto centrada en la grid (CSS `.gal-grid picture:last-child`)
- Catálogo de fotos en `PICTURES.md`

## Mapa

- **Leaflet** 1.9.4 con tiles de OpenStreetMap
- Vista inicial: península ibérica (`fitBounds`)
- Marcador con popup "Playa de Valdelagrana, El Puerto de Santa María"
- Zoom con botones funcionales; scroll-zoom se activa al hacer click en el mapa

## SEO

- `<title>` y `<meta description>` optimizados
- `<meta name="keywords">`, `<meta name="robots" content="index, follow">`
- `<link rel="canonical">` a `https://valdelagrana.dhlr.net/`
- Favicon SVG inline
- **Open Graph**: type, locale (es_ES + alternates fr/en), site_name, title, description, url, image
- **Twitter Card**: summary_large_image
- **JSON-LD** (`LodgingBusiness`): nombre, dirección, geo, habitaciones, capacidad, servicios

## Seguridad

| Medida | Estado |
|---|---|
| HTTPS | Cloudflare redirige HTTP → HTTPS; certificado Google Trust Services |
| CSP | `<meta http-equiv="Content-Security-Policy">` restrictiva (scripts, estilos, imágenes, form-action) |
| SRI | Hashes de integridad en Leaflet JS/CSS y Web3Forms |
| Formulario | Web3Forms + hCaptcha + honeypot; `maxlength` en todos los campos |
| XSS | i18n usa `textContent`; renderizado de disponibilidad usa DOM API (no `innerHTML`) |
| Sin contenido mixto | Todos los recursos cargan por HTTPS |
| Sin `eval`/`document.write` | No hay patrones peligrosos en el JS |

## API (Cloudflare Worker)

- **`GET /api/state`** — lectura pública (precios + disponibilidad)
- **`GET /api/admin`** — lectura para el backoffice (protegido por Cloudflare Access)
- **`PUT /api/admin`** — escritura de precios + fechas en KV (protegido por Cloudflare Access)
- Despliegue: `cd worker && npx wrangler deploy`
- Configuración en `worker/wrangler.toml`

## Backoffice

- `admin/index.html` — interfaz de gestión para precios y fechas
- Protegido por Cloudflare Access sobre `/api/admin`
- La sección de disponibilidad en el sitio público está oculta por defecto (`DATES_VISIBLE = false` en `index.html`)

## Despliegue

1. Commit a `main` → push a `origin/main`
2. GitHub Pages despliega automáticamente (1-2 min)
3. Cloudflare sirve el dominio `valdelagrana.dhlr.net` sobre HTTPS

```bash
git add -A && git commit -m "Mensaje del commit" && git push origin main
```

## Imágenes

- Originales en `new pictures/` (alta resolución)
- Variantes optimizadas en `images/jpg/` y `images/webp/` (tile 800px, full 2000px)
- Generadas con scripts de Pillow (ver historial de commits)
- Catálogo: `PICTURES.md`

## Stack

- HTML estático (sin build, sin framework)
- CSS inline en `<style>` (variables CSS, responsive, mobile-first)
- JavaScript vanilla (sin dependencias, salvo Leaflet)
- Google Fonts (Inter)
- GitHub Pages (hosting)
- Cloudflare (DNS, CDN, HTTPS, Worker, Access)
- Web3Forms (formulario de contacto)
- hCaptcha (anti-spam)
