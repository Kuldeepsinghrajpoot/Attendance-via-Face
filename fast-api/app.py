import os
import cv2
import numpy as np
from deepface import DeepFace
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import requests

app = FastAPI()

# Path to the directory where you store the known images
KNOWN_FACES_DIR = "../public/temp"

# Ensure the known faces directory exists
os.makedirs(KNOWN_FACES_DIR, exist_ok=True)

# Load known faces
known_names = []
for file in os.listdir(KNOWN_FACES_DIR):
    known_names.append(os.path.splitext(file)[0])

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:11",
    "http://127.0.0.1:8000",
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

# Dictionary to store students who have already been marked present
attendance_cache = {}

@app.post("/verify-face")
async def verify_face(image: Image, background_tasks: BackgroundTasks):
    # Validate base64 string
    if "," not in image.image:
        raise HTTPException(status_code=400, detail="Invalid base64 format")

    encoded_image = image.image.split(",")[1]
    
    try:
        img_np = np.frombuffer(base64.b64decode(encoded_image), np.uint8)
        frame = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        temp_image_path = "temp_image.jpg"
        if not cv2.imwrite(temp_image_path, frame):
            raise HTTPException(status_code=500, detail="Failed to save temp image")

        for file in os.listdir(KNOWN_FACES_DIR):
            known_image_path = os.path.join(KNOWN_FACES_DIR, file)
            try:
                result = DeepFace.verify(temp_image_path, known_image_path)
                if result.get("verified"):
                    name = os.path.splitext(file)[0]
                    student_id = name  # Assuming name is the student ID

                    # Check if the student is already marked present
                    if student_id in attendance_cache:
                        os.remove(temp_image_path)
                        return {"id": name, "response": "Attendance already recorded"}

                    # Mark attendance
                    attendance_cache[student_id] = True
                    background_tasks.add_task(send_attendance, student_id)

                    # Cleanup temp file
                    os.remove(temp_image_path)
                    return {"id": name, "response": "Attendance recorded"}

            except Exception as e:
                print("Error in DeepFace verification:", e)

        # Cleanup temp file if no match found
        os.remove(temp_image_path)
        return {"id": ""}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

async def send_attendance(student_id):
    print("Sending attendance for student ID:", student_id)
    try:
        response = requests.post("http://localhost:3000/api/attendance", json={"avatar": student_id})
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print("Error sending attendance:", e)
