# Portfolio de Facundo Duarte

Sitio estático publicado en <https://facuduarte-dev.github.io>. HTML, CSS y un
poco de JavaScript, sin framework, sin paso de compilación y sin dependencias.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `index.html` | Portada: proyectos, método, formación y contacto |
| `selene/index.html` | Caso de estudio de SELENE |
| `parkex/index.html` | Caso de estudio de ParkEx (incluye Matrícula OCR) |
| `404.html` | Página de error de GitHub Pages |
| `assets/css/estilos.css` | Todos los estilos (colores y tipografía en `:root`) |
| `assets/js/main.js` | Interacciones opcionales: copiar email, índice activo, recorrido por pasos |
| `assets/img/` | Imágenes optimizadas en WebP; `og-image.jpg` es la vista previa al compartir |
| `sitemap.xml`, `robots.txt` | SEO |
| `servidor-local.mjs` | Servidor estático mínimo para verlo en local |

El sitio funciona sin JavaScript: el script solo agrega detalles.

## Verlo en local

Requiere Node.js 18 o superior.

```bash
node servidor-local.mjs
```

Abrí <http://localhost:4321>. Abrir `index.html` directo con doble clic también
funciona, salvo la página 404.

## Agregar o cambiar imágenes

Las capturas se guardan en WebP con ancho máximo de 1800 px. Con FFmpeg:

```bash
ffmpeg -i captura.png -vf "scale='min(1800,iw)':-2" -c:v libwebp -quality 82 assets/img/nombre.webp
```

Cada imagen lleva en su pie una etiqueta que dice qué es: `Captura real`,
`Diagrama`, `Ilustración`, etc. No mezclar ilustraciones con demostraciones reales.

## Publicar

GitHub Pages publica la rama `main`. El rediseño se trabaja en la rama
`rediseno-2026` y se publica recién cuando está aprobado:

```bash
git switch main
git merge rediseno-2026
git push origin main
```

GitHub Pages actualiza el sitio en uno o dos minutos.
