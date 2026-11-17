// Servidor estático mínimo para ver el sitio en local: node servidor-local.mjs
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL(".", import.meta.url));
const tipos = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png",
  ".xml": "application/xml", ".txt": "text/plain"
};
const puerto = Number(process.env.PORT) || 4321;

createServer(async (req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  let archivo = resolve(raiz, "." + ruta);
  if (!archivo.startsWith(resolve(raiz) + sep) && archivo !== resolve(raiz)) {
    res.writeHead(400).end();
    return;
  }
  try {
    if ((await stat(archivo)).isDirectory()) archivo = join(archivo, "index.html");
    const contenido = await readFile(archivo);
    res.writeHead(200, { "Content-Type": tipos[extname(archivo)] || "application/octet-stream" }).end(contenido);
  } catch {
    res.writeHead(404, { "Content-Type": tipos[".html"] }).end(await readFile(join(raiz, "404.html")));
  }
}).listen(puerto, () => console.log(`Portfolio en http://localhost:${puerto}`));
