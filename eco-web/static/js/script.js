// === ACCESIBILIDAD ===

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

try {
  if (localStorage.getItem("high-contrast") === "1") {
    document.body.classList.add("high-contrast");
    const btn = document.getElementById("btn-contraste");
    if (btn) btn.setAttribute("aria-pressed", "true");
  }
} catch (_) {}

// === NAVEGACION ===

const navLinks = {
  inicio: document.getElementById("ini"),
  proyectos: document.getElementById("proy"),
  impacto: document.getElementById("impac"),
};

const sections = ["inicio", "proyectos", "impacto"]
  .map(function(id) { return document.getElementById(id); })
  .filter(Boolean);

if (sections.length > 0) {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        Object.values(navLinks).forEach(function(link) {
          if (link) {
            link.style.backgroundColor = "";
            link.removeAttribute("aria-current");
          }
        });
        var active = navLinks[entry.target.id];
        if (active) {
          active.style.backgroundColor = "rgba(0,0,0,0.25)";
          active.setAttribute("aria-current", "location");
        }
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(function(s) { observer.observe(s); });
}

// === FILTROS ===

function filtrar(cat) {
  var cards = document.querySelectorAll(".card[data-categoria]");
  var btns = document.querySelectorAll(".filtros button");
  cards.forEach(function(el) {
    el.style.display = (cat === "todos" || el.dataset.categoria === cat) ? "" : "none";
  });
  btns.forEach(function(btn) {
    var match = btn.getAttribute("onclick");
    if (match) match = match.match(/'([^']+)'/);
    btn.setAttribute("aria-pressed", (match && match[1] === cat) ? "true" : "false");
  });
}

// === API ===

async function cargar() {
  var res = await fetch("/listaProy");
  var data = await res.json();
  var contenedor = document.getElementById("content");
  if (contenedor) {
    contenedor.innerHTML = "";
    data.forEach(function(p) {
      var card = document.createElement("div");
      card.className = "card";
      card.innerHTML = "<h3>" + p[1] + "</h3><p>" + p[2] + "</p>";
      contenedor.appendChild(card);
    });
  }
}
document.addEventListener("DOMContentLoaded", cargar);

// === BOTON MAGICO ===

document.addEventListener("DOMContentLoaded", function() {
  var btnMagico = document.getElementById("btn-magico");
  var panelPropuesta = document.getElementById("panel-propuesta");
  if (btnMagico && panelPropuesta) {
    btnMagico.addEventListener("click", function() {
      panelPropuesta.classList.toggle("visible");
      if (panelPropuesta.classList.contains("visible")) {
        btnMagico.innerHTML = "Ocultar seccion de archivos";
        btnMagico.style.borderColor = "#ef4444";
        btnMagico.style.color = "#b91c1c";
        btnMagico.style.backgroundColor = "#fef2f2";
      } else {
        btnMagico.innerHTML = "Tienes un proyecto? Adjunta tu archivo aqui";
        btnMagico.style.borderColor = "#22c55e";
        btnMagico.style.color = "#166534";
        btnMagico.style.backgroundColor = "#f0fdf4";
      }
    });
  }
});

// === SCROLL REVEAL ===

function reveal() {
  var reveals = document.querySelectorAll(".reveal");
  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      reveals[i].classList.add("active");
    }
  }
}
window.addEventListener("scroll", reveal);
reveal();

// === BUSCADOR ===

document.addEventListener("DOMContentLoaded", function() {
  var buscador = document.getElementById("buscador-proyectos");
  if (buscador) {
    buscador.addEventListener("input", function(e) {
      var termino = e.target.value.toLowerCase();
      var tarjetas = document.querySelectorAll(".project-card");
      tarjetas.forEach(function(tarjeta) {
        var titulo = tarjeta.querySelector("h3").textContent.toLowerCase();
        var descripcion = tarjeta.querySelector("p").textContent.toLowerCase();
        var lider = tarjeta.querySelector(".project-team span:last-child");
        var contiene = titulo.includes(termino) || descripcion.includes(termino);
        if (lider) contiene = contiene || lider.textContent.toLowerCase().includes(termino);
        if (contiene) {
          tarjeta.classList.remove("hidden-by-search");
        } else {
          tarjeta.classList.add("hidden-by-search");
        }
      });
    });
  }
});

// === MODO OSCURO ===

document.addEventListener("DOMContentLoaded", function() {
  var btnDark = document.getElementById("dark-mode-toggle");
  var body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    if (btnDark) btnDark.textContent = "☀️";
  }

  if (btnDark) {
    btnDark.addEventListener("click", function() {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        btnDark.textContent = "☀️";
      } else {
        localStorage.setItem("theme", "light");
        btnDark.textContent = "🌙";
      }
    });
  }
});

// === VOLVER ARRIBA ===

document.addEventListener("DOMContentLoaded", function() {
  var btnSubir = document.getElementById("btn-volver-arriba");
  if (btnSubir) {
    window.addEventListener("scroll", function() {
      if (window.scrollY > 300) {
        btnSubir.classList.add("mostrar");
      } else {
        btnSubir.classList.remove("mostrar");
      }
    });
    btnSubir.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// === TOAST ===

window.mostrarToast = function(mensaje) {
  var contenedor = document.getElementById("toast-container");
  if (!contenedor) return;
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = "<span></span> <span>" + mensaje + "</span>";
  contenedor.appendChild(toast);
  setTimeout(function() {
    toast.classList.add("esconder");
    setTimeout(function() { toast.remove(); }, 400);
  }, 3000);
};

// === FORM VALIDATION ===

document.addEventListener("DOMContentLoaded", function() {
  var formulario = document.querySelector("form");
  if (formulario) {
    formulario.addEventListener("submit", function(evento) {
      if (!formulario.checkValidity()) {
        evento.preventDefault();
        formulario.classList.add("form-error");
        mostrarToast("Por favor, llena todos los campos correctamente.");
        setTimeout(function() { formulario.classList.remove("form-error"); }, 500);
      }
    });
  }
});

// === ARCHIVO INPUT ===

document.addEventListener("DOMContentLoaded", function() {
  var archivoInput = document.getElementById("archivo");
  var fileName = document.getElementById("file-name");
  if (archivoInput && fileName) {
    archivoInput.addEventListener("change", function() {
      if (archivoInput.files.length > 0) {
        fileName.textContent = "Archivo seleccionado: " + archivoInput.files[0].name;
      } else {
        fileName.textContent = "Ningun archivo seleccionado";
      }
    });
  }
});
