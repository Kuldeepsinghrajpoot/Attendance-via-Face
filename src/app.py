import os
import cv2
import numpy as np
import face_recognition
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import requests

app = FastAPI()

# Path to the directory where you store the known images
KNOWN_FACES_DIR = "../public/temp"

# Load known faces
known_faces = []
known_names = []

# Ensure the known faces directory exists
if os.path.exists(KNOWN_FACES_DIR):
    for file in os.listdir(KNOWN_FACES_DIR):
        image = face_recognition.load_image_file(os.path.join(KNOWN_FACES_DIR, file))
        face_encodings = face_recognition.face_encodings(image)
        if len(face_encodings) > 0:
            face_encoding = face_encodings[0]
            known_faces.append(face_encoding)
            known_names.append(os.path.splitext(file)[0])
else:
    raise FileNotFoundError(f"The directory '{KNOWN_FACES_DIR}' does not exist.")

# CORS (Cross-Origin Resource Sharing) configuration
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:5501",
    "http://127.0.0.1:11",
    "http://127.0.0.1:8000",  # Add the origin of your HTML page
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

class Image(BaseModel):
    image: str

@app.post("/verify-face")
async def verify_face(image: Image, background_tasks: BackgroundTasks):
    encoded_image = image.image.split(",")[1]
    img_np = np.frombuffer(base64.b64decode(encoded_image), np.uint8)
    frame = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    match_found = False
    # Face recognition logic
    faces_current_frame = face_recognition.face_locations(frame)
    encodes_current_frame = face_recognition.face_encodings(frame, faces_current_frame)

    for encode_face, face_loc in zip(encodes_current_frame, faces_current_frame):
        matches = face_recognition.compare_faces(known_faces, encode_face)
        face_dis = face_recognition.face_distance(known_faces, encode_face)
        match_index = np.argmin(face_dis)

        if matches[match_index]:
            name = known_names[match_index]
            student_id = name  # Assuming name is the student ID
            # Send a POST request to the attendance API
            background_tasks.add_task(send_attendance, student_id)
            response = await send_attendance(student_id)
            match_found = True
            return {"id": name, "response": response}

    # If no match found
    if not match_found:
        return {"id": ""}

# Define a function to send attendance
async def send_attendance(student_id):
    try:
        response = requests.post("http://localhost:3000/api/attendance", json={"avatar": student_id})
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print("Error sending attendance:", e)
