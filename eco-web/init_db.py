import sqlite3
import hashlib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
conn = sqlite3.connect(os.path.join(BASE_DIR, "eco.db"))
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS proyectos (
    NombreProyecto TEXT, Descripcion TEXT, Ubicacion TEXT, FechaInicio TEXT, Estado TEXT
)
""")

cursor.execute("""
INSERT OR IGNORE INTO proyectos VALUES
('Huerto Urbano', 'Cultivo sustentable en espacios pequeños', 'Ciudad', '2024-01-01', 'Activo'),
('Energía Solar Básica', 'Instalación accesible de paneles solares', 'Zona rural', '2024-02-01', 'En progreso')
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nombre TEXT
)
""")

cursor.execute("INSERT OR IGNORE INTO admins VALUES (1, 'admin', ?, 'Administrador')",
               (hashlib.sha256("admin123".encode()).hexdigest(),))
cursor.execute("INSERT OR IGNORE INTO admins VALUES (2, 'eco', ?, 'Eco Admin')",
               (hashlib.sha256("eco2026".encode()).hexdigest(),))

conn.commit()
conn.close()

print("Base de datos inicializada. Usuarios: admin/admin123, eco/eco2026")
