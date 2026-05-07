import sqlite3

conn = sqlite3.connect("eco.db")
cursor = conn.cursor()

cursor.execute("""
INSERT INTO proyectos 
(NombreProyecto, Descripcion, Ubicacion, FechaInicio, Estado)
VALUES
('Huerto Urbano', 'Cultivo sustentable en espacios pequeños', 'Ciudad', '2024-01-01', 'Activo')
""")

cursor.execute("""
INSERT INTO proyectos 
(NombreProyecto, Descripcion, Ubicacion, FechaInicio, Estado)
VALUES
('Energía Solar Básica', 'Instalación accesible de paneles solares', 'Zona rural', '2024-02-01', 'En progreso')
""")

conn.commit()
conn.close()

print("Datos insertados.")
