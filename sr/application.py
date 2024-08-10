import time
import os
import uuid
import config
import requests
from PIL import Image
from PIL import Image
from flask import Flask, render_template, request, redirect, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
CORS(app)


@app.route("/", methods=["GET", "POST"])
def index():

    uid = ""

    if request.method == "POST":
        uid = uuid.uuid4()
        f = request.files.get("img")
        print(request.files)
        fpath = os.path.join("static/uploads/", f.filename)
        f.save(fpath)
        fuck = Image.open(fpath)
        fuck.info["uid"] = uid
        print(fuck.info)
        fuck.save(fpath)
        print("TODO: send request to canister")
        response = {
            'uid': uid,
            'image': fpath
        }
        return jsonify(response)

    hour = time.localtime().tm_hour
    greeting = "Good morning!" if 4 <= hour <= 11 else "Good afternoon!" if 12 <= hour <= 18 else "Good evening!"
    return render_template("index.html", canister_ip=config.canister_ip, greeting=greeting, uid=uid)


if __name__ == "__main__":
    app.run(host="localhost", port=8000, debug=True)