const USERNAME = "facuduarte-dev";

document.getElementById("year").textContent = new Date().getFullYear();

const nav = document.querySelector(".nav-wrap");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 24), { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible"));
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const terminal = document.querySelector(".tilt-card");
if (matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)").matches) {
  terminal.addEventListener("pointermove", (event) => {
    const box = terminal.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    terminal.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
  });
  terminal.addEventListener("pointerleave", () => terminal.style.transform = "rotateY(-5deg) rotateX(2deg)");
}

fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`)
  .then((response) => response.ok ? response.json() : Promise.reject())
  .then((repos) => {
    const publicRepos = repos.filter((repo) => !repo.fork).length;
    const repoFact = [...document.querySelectorAll(".facts strong")][0];
    if (repoFact) repoFact.textContent = `${publicRepos}+`;
    document.querySelector(".all-projects").firstChild.textContent = `Ver los ${repos.length} repositorios `;
  })
  .catch(() => {});

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let dots = [];

function resize() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  dots = Array.from({ length: Math.min(75, Math.floor(innerWidth / 18)) }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.25 + 0.25,
    v: Math.random() * 0.12 + 0.04,
    a: Math.random() * 0.35 + 0.08
  }));
}

function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  dots.forEach((dot) => {
    dot.y -= dot.v;
    if (dot.y < -4) dot.y = innerHeight + 4;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(103,232,249,${dot.a})`;
    ctx.fill();
  });
  requestAnimationFrame(draw);
}

if (!matchMedia("(prefers-reduced-motion:reduce)").matches) {
  addEventListener("resize", resize);
  resize();
  draw();
}
