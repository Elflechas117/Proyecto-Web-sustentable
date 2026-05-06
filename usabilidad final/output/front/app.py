from flask import Flask, render_template, jsonify
import sqlite3
import flask as fl

app = fl.Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/impacto")
def impacto():
    return render_template("impacto.html")


@app.route("/contacto")
def contacto():
    return render_template("contacto.html")


@app.route("/accesibilidad")
def accesibilidad():
    return render_template("accesibilidad.html")


@app.route("/detalle")
def detalle():
    return render_template("detalle.html")


@app.route("/listaProy")
def listaProy():
    conexion = sqlite3.connect("eco.db")
    cursor = conexion.cursor()
    cursor.execute("")
    resultado = cursor.fetchall()
    return jsonify(resultado)


@app.route("/proyectos")
def proyectos():
    return render_template("proyectos.html")


if __name__ == "__main__":
    app.run(debug=True)
