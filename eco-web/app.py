from flask import Flask, render_template, jsonify, request, redirect, session
import sqlite3
import os
import hashlib
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
app.config["UPLOAD_FOLDER"] = "static/uploads"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "eco.db")

propuestas = []

# === STATIC PAGES ===


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/impacto")
def impacto():
    return render_template("impacto.html")


@app.route("/proyectos")
def proyectos():
    return render_template("proyectos.html")


@app.route("/accesibilidad")
def accesibilidad():
    return render_template("accesibilidad.html")


@app.route("/detalle")
def detalle():
    return render_template("detalle.html")


@app.route("/reciclaje")
def reciclaje():
    return render_template("reciclaje.html")


@app.route("/pluvial")
def pluvial():
    return render_template("pluvial.html")


@app.route("/paneles_solares")
def paneles_solares():
    return render_template("paneles_solares.html")


@app.route("/loginpage", methods=["GET", "POST"])
def loginpage():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        password_hash = hashlib.sha256(password.encode()).hexdigest()

        conexion = sqlite3.connect(DB_PATH)
        cursor = conexion.cursor()
        cursor.execute("SELECT username, nombre FROM admins WHERE username = ? AND password_hash = ?",
                       (username, password_hash))
        admin = cursor.fetchone()
        conexion.close()

        if admin:
            session["usuario"] = admin[0]
            session["nombre"] = admin[1]
            return redirect("/admin")

        return render_template("login.html", error="Credenciales incorrectas")

    return render_template("login.html")


@app.route("/participa", methods=["GET", "POST"])
def participa():
    if request.method == "POST":
        nombre = request.form.get("nombre")
        correo = request.form.get("correo")
        mensaje = request.form.get("mensaje")
        archivo = request.files.get("archivo")
        nombre_archivo = ""
        if archivo and archivo.filename != "":
            nombre_archivo = archivo.filename
            ruta = os.path.join(app.config["UPLOAD_FOLDER"], nombre_archivo)
            archivo.save(ruta)

        propuestas.append({"nombre": nombre, "correo": correo, "mensaje": mensaje, "archivo": nombre_archivo, "estado": "Pendiente"})
        return redirect("/participa")

    return render_template("participa.html")


@app.route("/contacto", methods=["GET", "POST"])
def contacto():
    if request.method == "POST":
        nombre = request.form.get("nombre")
        correo = request.form.get("correo")
        mensaje = request.form.get("mensaje")
        if nombre == "admin22" and correo == "admin22@hotmail.com":
            return redirect("/loginpage")
        propuestas.append({
            "nombre": nombre,
            "correo": correo,
            "mensaje": mensaje,
            "archivo": "",
            "estado": "Pendiente",
        })
        return redirect("/contacto")

    return render_template("contacto.html")


@app.route("/admin")
def admin():
    if "usuario" not in session:
        return redirect("/")
    return render_template("admin.html", propuestas=propuestas)


@app.route("/listaProy")
def listaProy():
    conexion = sqlite3.connect(DB_PATH)
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM proyectos")
    resultado = cursor.fetchall()
    conexion.close()
    return jsonify(resultado)


# === ERROR HANDLERS ===


@app.errorhandler(404)
def not_found(e):
    return render_template("404.html", error_code=404, error_message=None), 404


@app.errorhandler(500)
def server_error(e):
    return render_template("404.html", error_code=500, error_message=str(e)), 500


@app.errorhandler(Exception)
def handle_exception(e):
    return render_template("404.html", error_code=500, error_message=str(e)), 500


if __name__ == "__main__":
    os.makedirs(os.path.join(BASE_DIR, "static/uploads"), exist_ok=True)
    app.run(debug=True)
