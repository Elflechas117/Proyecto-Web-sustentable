# Proyectos Ecológicos — Web App

Aplicación web **Flask** sobre proyectos sustentables con **accesibilidad WCAG AAA**, panel admin, modo oscuro y búsqueda en tiempo real.

---

## Inicio rápido

```bash
pip install -r requirements.txt
python init_db.py    # Crea BD + datos de prueba
python app.py        # http://localhost:5000
```

Usuarios predefinidos:
- `admin` / `admin123` — Administrador general
- `eco` / `eco2026` — Eco Admin
- Easter egg: en el formulario de `/contacto`, usá `admin22` / `admin22@hotmail.com` para acceder al panel

---

## Estructura

```
eco-web/
├── app.py              Backend Flask (11 rutas)
├── init_db.py          Inicialización de base de datos
├── requirements.txt    flask>=3.0
├── eco.db              SQLite (proyectos + admins)
├── static/
│   ├── css/styles.css
│   ├── js/script.js
│   └── uploads/        Archivos subidos por usuarios
└── templates/          12 páginas HTML
    ├── index.html
    ├── impacto.html
    ├── proyectos.html
    ├── contacto.html
    ├── admin.html
    ├── login.html
    ├── detalle.html
    ├── accesibilidad.html
    ├── participa.html
    ├── reciclaje.html
    ├── pluvial.html
    └── paneles_solares.html
```

---

## Funcionalidades

| Funcionalidad | Cómo |
|---|---|
| **Login con autenticación** | POST a `/loginpage`, verifica contra SHA256 en SQLite, sesión con `secret_key` |
| **Panel admin protegido** | `/admin` solo accesible con sesión activa |
| **Easter egg de acceso** | Formulario `/contacto` con `admin22` + `admin22@hotmail.com` redirige al panel |
| **Alto contraste** | `toggleContrast()` con persistencia en localStorage |
| **Ajuste de fuente** | Rango 14-28px sobre `:root` |
| **Modo oscuro** | Persiste en localStorage |
| **Filtro por categoría** | Muestra/oculta `.card[data-categoria]` |
| **Buscador en vivo** | Filtra por título, descripción y líder |
| **Carga vía API** | GET `/listaProy` desde SQLite |
| **Subida de archivos** | En `/participa`, se guardan en `static/uploads/` |
| **Gráfica Chart.js** | Barras de proyectos por categoría en `/impacto` |
| **Scroll reveal** | Animación al hacer scroll |
| **Toast notifications** | Mensajes flotantes con auto-destrucción |
| **Volver arriba** | Botón flotante |

---

## Cosas a mejorar

- `propuestas` en memoria volátil — al reiniciar Flask se pierden los contactos. Migrar a tabla `propuestas` en `eco.db`.
- Admin sin persistencia — los botones en `admin.html` no tienen backend.
- Páginas de detalle con contenido hardcodeado — deberían consultar la BD por `id`.
- No hay `base.html` — el header, nav, footer y scripts se repiten en las 12 páginas.
- `participa.html` tiene `action="#"` — nunca envía datos.
- Ruta de imagen rota en `paneles_solares.html`.
- Sin tests, sin `404.html`, sin manejo de errores en `listaProy()`.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Backend | Python 3 + Flask |
| Base de datos | SQLite3 |
| Frontend | HTML5 + CSS3 (variables, grid, flexbox, animaciones) |
| JS | Vanilla JS |
| Gráficas | Chart.js (CDN) |
| Fuentes | Google Fonts (Fraunces + DM Sans) |
