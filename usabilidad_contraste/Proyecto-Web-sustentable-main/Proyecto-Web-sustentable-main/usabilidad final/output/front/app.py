from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect
)

import sqlite3
import os

app = Flask(__name__)

# CONFIGURACION

UPLOAD_FOLDER = "static/uploads"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


propuestas = []

# PAGINAS

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


#Contacto

@app.route("/contacto", methods=["GET", "POST"])
def contacto():

    if request.method == "POST":

        nombre = request.form.get("nombre")

        correo = request.form.get("correo")

        mensaje = request.form.get("mensaje")

        archivo = request.files.get("archivo")

        nombre_archivo = ""

        
        if archivo and archivo.filename != "":

            nombre_archivo = archivo.filename

            ruta = os.path.join(
                app.config["UPLOAD_FOLDER"],
                nombre_archivo
            )

            archivo.save(ruta)

        
        propuestas.append({
            "nombre": nombre,
            "correo": correo,
            "mensaje": mensaje,
            "archivo": nombre_archivo,
            "estado": "Pendiente"
        })

        return redirect("/contacto")

    return render_template("contacto.html")


#Admin

@app.route("/admin")
def admin():

    return render_template(
        "admin.html",
        #propuestas=propuestas
    )

#API proyectos

@app.route("/listaProy")
def listaProy():

    conexion = sqlite3.connect("eco.db")

    cursor = conexion.cursor()

    cursor.execute(
        "SELECT * FROM proyectos"
    )

    resultado = cursor.fetchall()

    conexion.close()

    return jsonify(resultado)


#Detalles

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


#Main

if __name__ == "__main__":

    os.makedirs(
        "static/uploads",
        exist_ok=True
    )

    app.run(debug=True)


