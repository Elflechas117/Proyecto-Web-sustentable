/* =============================================
   PROYECTOS ECOLÓGICOS — Script principal
   ============================================= */

// ── Nav activa con IntersectionObserver ──
const navLinks = {
  inicio: document.getElementById("ini"),
  proyectos: document.getElementById("proy"),
  impacto: document.getElementById("impac"),
};

const sections = ["inicio", "proyectos", "impacto"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Quitar activo de todos
          Object.values(navLinks).forEach((link) => {
            if (link) {
              link.style.backgroundColor = "";
              link.removeAttribute("aria-current");
            }
          });

          // Marcar el activo
          const active = navLinks[entry.target.id];
          if (active) {
            active.style.backgroundColor = "rgba(0,0,0,0.25)";
            active.setAttribute("aria-current", "location");
          }
        }
      });
    },
    { threshold: 0.5 },
  );

  sections.forEach((s) => observer.observe(s));
}

// ── Alto contraste ──
function toggleContrast() {
  const body = document.body;
  const btn = document.getElementById("btn-contraste");
  const isOn = body.classList.toggle("high-contrast");
  if (btn) btn.setAttribute("aria-pressed", isOn ? "true" : "false");
  // Persistir preferencia
  try {
    localStorage.setItem("high-contrast", isOn ? "1" : "0");
  } catch (_) {}
}

// Restaurar preferencia al cargar
try {
  if (localStorage.getItem("high-contrast") === "1") {
    document.body.classList.add("high-contrast");
    const btn = document.getElementById("btn-contraste");
    if (btn) btn.setAttribute("aria-pressed", "true");
  }
} catch (_) {}

// ── Tamaño de fuente ──
function changeFontSize(amount) {
  const current = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  const next = Math.min(Math.max(current + amount, 14), 28); // límites 14–28px
  document.documentElement.style.fontSize = next + "px";
}

// ── Filtro de proyectos ──
function filtrar(cat) {
  const cards = document.querySelectorAll(".card[data-categoria]");
  const btns = document.querySelectorAll(".filtros button");

  cards.forEach((el) => {
    const visible = cat === "todos" || el.dataset.categoria === cat;
    el.style.display = visible ? "" : "none";
  });

  // Actualizar aria-pressed en botones de filtro
  btns.forEach((btn) => {
    const btnCat = btn.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
    btn.setAttribute("aria-pressed", btnCat === cat ? "true" : "false");
  });
}

async function cargar() {
  const res = await fetch("/listaProy");
  const data = await res.json();
  const contenedor = document.getElementById("content");
  contenedor.innerHTML = "";
  data.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
    `;
    contenedor.appendChild(card);
  });
}
document.addEventListener("DOMContentLoaded", cargar);
