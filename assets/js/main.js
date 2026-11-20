// Interacciones mínimas del portfolio. Todo funciona sin JavaScript;
// esto solo agrega detalles: visor de proyectos, ampliar imágenes, demo a pedido,
// menú activo, borde de la cabecera, copiar el email,
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

const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Visor de proyectos de la portada: cambia la imagen real de cada proyecto.
document.querySelectorAll("[data-visor]").forEach((visor) => {
  const botones = [...visor.querySelectorAll(".visor-pestanas button")];
  const datos = [...visor.querySelector("[data-visor-datos]").content.children];
  const enlace = visor.querySelector("[data-visor-enlace]");
  const img = visor.querySelector("[data-visor-img]");
  const pie = visor.querySelector("[data-visor-pie]");
  const ver = visor.querySelector("[data-visor-ver]");
  const marco = img.closest(".marco");

  // Precarga las otras imágenes cuando el navegador está libre.
  const precargar = () => datos.slice(1).forEach((d) => { new Image().src = d.dataset.src; });
  ("requestIdleCallback" in window ? requestIdleCallback : setTimeout)(precargar);

  const mostrar = (i) => {
    const d = datos[i];
    botones.forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
    const aplicar = () => {
      img.src = d.dataset.src;
      img.width = Number(d.dataset.w);
      img.height = Number(d.dataset.h);
      img.alt = d.dataset.alt;
      marco.classList.toggle("contener", d.hasAttribute("data-contener"));
      pie.innerHTML = d.innerHTML;
      ver.textContent = d.dataset.ver;
      enlace.href = d.dataset.href;
      const externo = /^https?:/.test(d.dataset.href);
      if (externo) enlace.rel = "noopener"; else enlace.removeAttribute("rel");
      img.classList.remove("cambiando");
    };
    if (sinMovimiento) { aplicar(); return; }
    img.classList.add("cambiando");
    setTimeout(aplicar, 180);
  };

  botones.forEach((b, i) => {
    b.addEventListener("click", () => mostrar(i));
    b.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const siguiente = (i + (e.key === "ArrowRight" ? 1 : -1) + botones.length) % botones.length;
      botones[siguiente].focus();
      mostrar(siguiente);
    });
  });
});

// Ampliar capturas y diagramas en un diálogo nativo.
const ampliables = document.querySelectorAll(".figura .marco img, .proyecto .marco img");
if (ampliables.length && typeof HTMLDialogElement === "function") {
  const dialogo = document.createElement("dialog");
  dialogo.className = "visor-grande";
  dialogo.setAttribute("aria-label", "Imagen ampliada");
  dialogo.innerHTML = '<img alt=""><p><span></span><button type="button">Cerrar</button></p>';
  document.body.append(dialogo);
  const grande = dialogo.querySelector("img");
  const texto = dialogo.querySelector("span");
  dialogo.querySelector("button").addEventListener("click", () => dialogo.close());
  dialogo.addEventListener("click", (e) => { if (e.target === dialogo) dialogo.close(); });

  ampliables.forEach((img) => {
    if (img.closest("a")) return; // las que ya son enlace no se amplían
    img.classList.add("ampliable");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `Ampliar: ${img.alt}`);
    const abrir = () => {
      grande.src = img.currentSrc || img.src;
      grande.alt = img.alt;
      const pie = img.closest("figure")?.querySelector("figcaption");
      texto.textContent = pie ? pie.textContent.trim() : "";
      dialogo.showModal();
    };
    img.addEventListener("click", abrir);
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); }
    });
  });
}

// Demo real de SELENE: el iframe se carga solo si la persona lo pide.
document.querySelectorAll("[data-demo]").forEach((demo) => {
  const boton = demo.querySelector("button");
  if (!boton) return;
  boton.hidden = false;
  boton.addEventListener("click", () => {
    const marco = document.createElement("iframe");
    marco.src = demo.dataset.demo;
    marco.title = demo.dataset.titulo || "Demo";
    marco.loading = "lazy";
    marco.allow = "fullscreen";
    demo.replaceChildren(marco);
    marco.focus();
  });
});

// Portada: resalta en el menú la sección visible.
const enlacesNav = document.querySelectorAll('.nav a[href^="#"]');
if ("IntersectionObserver" in window && enlacesNav.length) {
  const mapa = new Map([...enlacesNav].map((a) => [a.hash.slice(1), a]));
  const obs = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      enlacesNav.forEach((a) => a.removeAttribute("aria-current"));
      mapa.get(entrada.target.id)?.setAttribute("aria-current", "true");
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  mapa.forEach((_, id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
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
