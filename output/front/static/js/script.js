/* =============================================
   PROYECTOS ECOLÓGICOS — Script principal
   ============================================= */

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
          Object.values(navLinks).forEach((link) => {
            if (link) {
              link.style.backgroundColor = "";
              link.removeAttribute("aria-current");
            }
          });
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

function toggleContrast() {
  const body = document.body;
  const btn = document.getElementById("btn-contraste");
  const isOn = body.classList.toggle("high-contrast");
  if (btn) btn.setAttribute("aria-pressed", isOn ? "true" : "false");
  try {
    localStorage.setItem("high-contrast", isOn ? "1" : "0");
  } catch (_) {}
}

function changeFontSize(amount) {
  const current = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  const next = Math.min(Math.max(current + amount, 14), 28);
  document.documentElement.style.fontSize = next + "px";
}

function filtrar(cat) {
  const cards = document.querySelectorAll(".card[data-categoria]");
  cards.forEach((el) => {
    const visible = cat === "todos" || el.dataset.categoria === cat;
    el.style.display = visible ? "" : "none";
  });
}

async function cargar() {
  const res = await fetch("/listaProy");
  const data = await res.json();
  const contenedor = document.getElementById("content");
  if (contenedor) {
    contenedor.innerHTML = "";
    data.forEach((p) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${p.NombreProyecto}</h3>
        <p>${p.Descripcion}</p>
        <small>📍 ${p.Ubicacion} — Estado: ${p.Estado}</small>
      `;
      contenedor.appendChild(card);
    });
  }
}

async function TomarArchivos() {
  let peticion = document.getElementById("descargar");
  fetch("/sugerencias", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: peticion }),
  });
}
async function CargarArchivos() {
  const res = await fetch("/sugerencias");
  const data = await res.json();
  const contenedor = document.getElementById("content");
  if (contenedor) {
    contenedor.innerHTML = "";
    data.forEach((p) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${p.NombreProyecto}</h3>
        <p>${p.Descripcion}</p>
      `;
      contenedor.appendChild(card);
    });
  }
}
document.addEventListener("DOMContentLoaded", cargar);

async function buscarProyecto() {
  const texto = document.getElementById("busqueda").value;

  const res = await fetch("/buscar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: texto }),
  });

  const data = await res.json();
  const contenedor = document.getElementById("content");

  contenedor.innerHTML = "";

  data.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.NombreProyecto}</h3>
      <p>${p.Descripcion}</p>
      <small>📍 ${p.Ubicacion} — Estado: ${p.Estado}</small>
    `;
    contenedor.appendChild(card);
  });
}
