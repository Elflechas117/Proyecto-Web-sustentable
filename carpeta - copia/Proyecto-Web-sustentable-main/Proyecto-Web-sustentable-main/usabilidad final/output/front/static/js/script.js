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
  try { localStorage.setItem("high-contrast", isOn ? "1" : "0"); } catch (_) {}
}

function changeFontSize(amount) {
  const current = parseFloat(getComputedStyle(document.documentElement).fontSize);
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
        card.innerHTML = `<h3>${p.nombre}</h3><p>${p.descripcion}</p>`;
        contenedor.appendChild(card);
      });
  }
}
document.addEventListener("DOMContentLoaded", cargar);

const archivoInput = document.getElementById("archivo");

const fileName = document.getElementById("file-name");

if (archivoInput && fileName) {

  archivoInput.addEventListener("change", () => {

    if (archivoInput.files.length > 0) {

      fileName.textContent =
        "Archivo seleccionado: " +
        archivoInput.files[0].name;

    } else {

      fileName.textContent =
        "Ningún archivo seleccionado";

    }

  });

}

/* =========================
   MODO ALTO CONTRASTE
========================= */

function toggleContrast() {
  document.body.classList.toggle("high-contrast");
}

/* =========================
   CAMBIO DE TAMAÑO
========================= */

function changeFontSize(amount) {

  const root = document.documentElement;

  let currentSize =
    parseFloat(
      getComputedStyle(root).fontSize
    );

  let newSize = currentSize + amount;

  /* límite mínimo */
  if (newSize < 14) {
    newSize = 14;
  }

  /* límite máximo */
  if (newSize > 30) {
    newSize = 30;
  }

  root.style.fontSize = newSize + "px";
}