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

# Path to known faces directory
KNOWN_FACES_DIR = "../public/temp"
os.makedirs(KNOWN_FACES_DIR, exist_ok=True)  # Ensure the directory exists

# Load OpenCV's pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:5000",
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

# Cache to track marked students
attendance_cache = set()

@app.post("/verify-face")
async def verify_face(image: Image, background_tasks: BackgroundTasks):
    """Verifies the face, ensures it is human, and marks attendance."""
    
    if "," not in image.image:
        raise HTTPException(status_code=400, detail="Invalid base64 format")

    encoded_image = image.image.split(",")[1]

    try:
        # Convert base64 to OpenCV image
        img_np = np.frombuffer(base64.b64decode(encoded_image), np.uint8)
        frame = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        # Detect if there's a human face
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) == 0:
            return
            return {"id": "", "response": "No human face detected"}

        temp_image_path = "temp_image.jpg"
        if not cv2.imwrite(temp_image_path, frame):
            raise HTTPException(status_code=500, detail="Failed to save temp image")

        # Skip recognition if student is already marked present
        for file in os.listdir(KNOWN_FACES_DIR):
            student_id = os.path.splitext(file)[0]  # Extract name (ID)

            if student_id in attendance_cache:
                os.remove(temp_image_path)
                return {"id": student_id, "response": "Attendance already recorded"}

            known_image_path = os.path.join(KNOWN_FACES_DIR, file)
            try:
                result = DeepFace.verify(temp_image_path, known_image_path)

                if result.get("verified"):
                    attendance_cache.add(student_id)  # Mark as recognized
                    background_tasks.add_task(send_attendance, student_id)

                    os.remove(temp_image_path)
                    return {"id": student_id, "response": "Attendance recorded"}

            except Exception as e:
                print("Error in DeepFace verification:", e)

        # If no match is found
        os.remove(temp_image_path)
        return {"id": "", "response": "User not found"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


async def send_attendance(student_id):
    """Send attendance to backend ONLY IF the student was not previously marked."""
    print(f"Sending attendance for student ID: {student_id}")
    try:
        response = requests.post("http://localhost:3000/api/attendance", json={"avatar": student_id})
        print(response.json())
        response.raise_for_status()
        print("Attendance successfully sent:", response.json())
    except requests.exceptions.RequestException as e:
        print("Error sending attendance:", e)
