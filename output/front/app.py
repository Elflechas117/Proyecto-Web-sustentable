from flask import request, Flask, render_template, jsonify
import sqlite3
import os


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/impacto")
def impacto():
    return render_template("impacto.html")


@app.route("/proyectos")
def proyectos():
    return render_template("proyectos.html")


@app.route("/participa")
def participa():
    return render_template("participa.html")


@app.route("/contacto")
def contacto():
    return render_template("contacto.html")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "eco.db")


@app.route("/listaProy")
def listaProy():
    conexion = sqlite3.connect(DB_PATH)
    conexion.row_factory = sqlite3.Row
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM proyectos")
    resultado = [dict(fila) for fila in cursor.fetchall()]
    conexion.close()
    return jsonify(resultado)


@app.route("/sugerencias", methods=["POST"])
def sugerencias():
    sugerencia = request.get_json()
    if not sugerencia:
        return {"Error": "Espacio vacio"}, 400
    nombre = sugerencia.get("NombreProyecto")
    descripcion = sugerencia.get("Descripcion")
    if not nombre or not descripcion:
        return {"error": "Todos los campos son obligatorios"}, 400
    conexion = sqlite3.connect(DB_PATH)
    cursor = conexion.cursor()
    cursor.execute(
        "INSERT INTO sugerencias (NombreProyecto, Descripcion) VALUES (?,?)",
        (nombre, descripcion),
    )
    conexion.commit()
    cursor.close()
    conexion.close()
    return {"mensaje": "Sugerencia Enviada"}, 201


@app.route("/aceptado", methods=["POST"])
def aceptado():
    proyectoAceptado = request.get_json()
    if not proyectoAceptado or "id" not in proyectoAceptado:
        return {"error": "ID de sugerencia requerido"}, 400

    sugerencia_id = proyectoAceptado["id"]
    Conexion = sqlite3.connect(DB_PATH)
    cursor = Conexion.cursor()

    # Obtener la sugerencia
    cursor.execute("SELECT * FROM sugerencias WHERE id = ?", (sugerencia_id,))
    sugerencia = cursor.fetchone()

    if not sugerencia:
        Conexion.close()
        return {"error": "Sugerencia no encontrada"}, 404

    # Insertar en proyectos
    cursor.execute(
        "INSERT INTO proyectos (NombreProyecto, Descripcion) VALUES (?, ?)",
        (
            sugerencia[1],
            sugerencia[2],
        ),  # Asumiendo columnas: id, NombreProyecto, Descripcion
    )

    # Eliminar de sugerencias
    cursor.execute("DELETE FROM sugerencias WHERE id = ?", (sugerencia_id,))

    Conexion.commit()
    Conexion.close()
    return {"mensaje": "Proyecto aceptado"}, 200


@app.route("/rechazado", methods=["POST"])
def rechazado():
    proyectoRechazado = request.get_json()
    if not proyectoRechazado or "id" not in proyectoRechazado:
        return {"error": "ID de sugerencia requerido"}, 400

    sugerencia_id = proyectoRechazado["id"]
    Conexion = sqlite3.connect(DB_PATH)
    cursor = Conexion.cursor()

    # Verificar que existe
    cursor.execute("SELECT * FROM sugerencias WHERE id = ?", (sugerencia_id,))
    if not cursor.fetchone():
        Conexion.close()
        return {"error": "Sugerencia no encontrada"}, 404

    # Eliminar de sugerencias
    cursor.execute("DELETE FROM sugerencias WHERE id = ?", (sugerencia_id,))

    Conexion.commit()
    Conexion.close()
    return {"mensaje": "Proyecto rechazado"}, 200


@app.route("/TomarSugerencias", methods=["GET", "POST"])
def TomarSugerencias():
    conexion = sqlite3.connect(DB_PATH)
    conexion.row_factory = sqlite3.Row
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM sugerencias")
    resultado = [dict(fila) for fila in cursor.fetchall()]
    conexion.close()
    return render_template("admin.html", sugerencias=resultado)


@app.route("/buscar", methods=["GET", "POST"])
def busqueda():
    texto = request.json.get("query", "").lower()

    conexion = sqlite3.connect(DB_PATH)
    conexion.row_factory = sqlite3.Row
    cursor = conexion.cursor()

    cursor.execute("SELECT * FROM proyectos")
    resultado = [dict(fila) for fila in cursor.fetchall()]

    filtrado = []

    for valor in resultado:
        nombre = valor["NombreProyecto"].lower()

        if texto in nombre:
            filtrado.append(valor)

    conexion.close()
    return jsonify(filtrado)


@app.route("/detalle")
def detalle():
    return render_template("detalle.html")


if __name__ == "__main__":
    app.run(debug=True)
