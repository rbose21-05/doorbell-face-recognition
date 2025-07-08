from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from deepface import DeepFace
from datetime import datetime
import cv2
import os
import base64
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS globally

# CORS headers
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    return response

# Log a visitor
def log_visitor(name):
    with open("visitor_log.csv", "a") as file:
        now = datetime.now()
        date = now.strftime("%Y-%m-%d")
        time = now.strftime("%H:%M:%S")
        file.write(f"{name},{date},{time}\n")

# Clear log
@app.route("/clear_log", methods=["POST"])
def clear_log():
    with open("visitor_log.csv", "w") as file:
        file.write("Name,Date,Time\n")
    return jsonify({"message": "Visitor log cleared"}), 200

# New: Recognize face from React-captured image
@app.route("/recognize", methods=["POST"])
def recognize_from_image():
    data = request.get_json()
    image_base64 = data.get("image")

    if not image_base64:
        return jsonify({"error": "No image provided"}), 400

    try:
        # Decode base64 image
        header, encoded = image_base64.split(",", 1)
        img_data = base64.b64decode(encoded)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Face recognition
        result = DeepFace.find(
            img_path=img,
            db_path="C:/Users/rupsa/OneDrive/Pictures/Desktop/doorbell/backend/faces",
            model_name="ArcFace",
            detector_backend="retinaface",
            enforce_detection=False
        )

        if len(result[0]) > 0:
            identity_path = result[0]['identity'][0]
            name = os.path.basename(identity_path).split('.')[0]
            log_visitor(name)
            return jsonify({"match": True, "name": name})
        else:
            log_visitor("Unknown")
            return jsonify({"match": False})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Keep: Add a new face using backend webcam
@app.route("/add_face", methods=["POST"])
def add_face():
    data = request.get_json()
    name = data.get("name", "").strip()

    if not name:
        return jsonify({"error": "Name is required"}), 400

    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    cam.release()

    if not ret:
        return jsonify({"error": "Failed to capture image"}), 500

    save_path = f"C:/Users/rupsa/OneDrive/Pictures/Desktop/doorbell/backend/faces/{name}.jpg"
    cv2.imwrite(save_path, frame)
    return jsonify({"message": f"Face saved as {name}"})

# View visitor log
@app.route("/log", methods=["POST"])
def get_log():
    data = request.get_json()
    key = data.get("key", "").strip()

    if key == "211005":
        if os.path.exists("visitor_log.csv"):
            return send_file("visitor_log.csv", mimetype="text/csv")
        else:
            return jsonify({"error": "Log not found"}), 404
    else:
        return jsonify({"error": "Access denied"}), 403

# Start the app
if __name__ == "__main__":
    app.run(debug=True)
