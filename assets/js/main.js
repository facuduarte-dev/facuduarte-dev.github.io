// Interacciones mínimas del portfolio. Todo funciona sin JavaScript;
// esto solo agrega detalles: borde de la cabecera, copiar el email,
// índice activo y el recorrido por pasos de ParkEx.

document.documentElement.classList.add("js");

const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();

// Borde inferior de la cabecera al desplazarse.
const cabecera = document.querySelector(".cabecera");
if (cabecera) {
  const marcar = () => cabecera.classList.toggle("con-borde", window.scrollY > 8);
  marcar();
  window.addEventListener("scroll", marcar, { passive: true });
}

// Copiar el email con aviso accesible.
const copiar = document.getElementById("copiar-correo");
const aviso = document.getElementById("aviso-correo");
if (copiar && aviso && navigator.clipboard) {
  copiar.hidden = false;
  copiar.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copiar.dataset.correo);
      aviso.textContent = "Copiado";
    } catch {
      aviso.textContent = "No se pudo copiar";
    }
    setTimeout(() => { aviso.textContent = ""; }, 2400);
  });
}

// Índice de los casos de estudio: marca la sección que se está leyendo.
const enlacesIndice = document.querySelectorAll(".indice a");
if ("IntersectionObserver" in window && enlacesIndice.length) {
  const porId = new Map([...enlacesIndice].map((a) => [a.hash.slice(1), a]));
  const observadorIndice = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      enlacesIndice.forEach((a) => a.classList.remove("activo"));
      porId.get(entrada.target.id)?.classList.add("activo");
    }
  }, { rootMargin: "-30% 0px -60% 0px" });
  porId.forEach((_, id) => {
    const seccion = document.getElementById(id);
    if (seccion) observadorIndice.observe(seccion);
  });
}

// Recorrido por pasos (diagrama de ParkEx).
document.querySelectorAll("[data-recorrido]").forEach((recorrido) => {
  const botones = [...recorrido.querySelectorAll(".recorrido-pasos button")];
  const detalles = [...recorrido.querySelectorAll(".recorrido-detalle > div")];
  let actual = 0;

  const mostrar = (indice) => {
    actual = (indice + botones.length) % botones.length;
    botones.forEach((b, i) => b.setAttribute("aria-pressed", String(i === actual)));
    detalles.forEach((d, i) => { d.hidden = i !== actual; });
  };

  botones.forEach((b, i) => b.addEventListener("click", () => mostrar(i)));
  recorrido.querySelector("[data-anterior]")?.addEventListener("click", () => mostrar(actual - 1));
  recorrido.querySelector("[data-siguiente]")?.addEventListener("click", () => mostrar(actual + 1));
  recorrido.querySelector(".recorrido-control").hidden = false;
  mostrar(0);
});
