import os
import cv2 # type: ignore
import numpy as np # type: ignore
from deepface import DeepFace # type: ignore
from fastapi import FastAPI, HTTPException # type: ignore
from pydantic import BaseModel # type: ignore
import base64
from fastapi.middleware.cors import CORSMiddleware # type: ignore
app = FastAPI()

# Path to known faces directory
KNOWN_FACES_DIR = "../public/temp"
os.makedirs(KNOWN_FACES_DIR, exist_ok=True)  # Ensure the directory exists

# Load OpenCV's pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

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

@app.post("/verify-face")
async def verify_face(image: Image):
    """Verifies the face and returns the detected name."""
    if "," not in image.image:
        raise HTTPException(status_code=400, detail="Invalid base64 format")

    encoded_image = image.image.split(",")[1]
    try:
        # Convert base64 to OpenCV image
        img_np = np.frombuffer(base64.b64decode(encoded_image), np.uint8)
        frame = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        # Detect face
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        if len(faces) == 0:
            return {"name": "No human face detected"}
        
        temp_image_path = "temp_image.jpg"
        if not cv2.imwrite(temp_image_path, frame):
            raise HTTPException(status_code=500, detail="Failed to save temp image")
        
        # Compare with known faces
        for file in os.listdir(KNOWN_FACES_DIR):
            student_name = os.path.splitext(file)[0]  # Extract name (ID)
            known_image_path = os.path.join(KNOWN_FACES_DIR, file)
            try:
                result = DeepFace.verify(temp_image_path, known_image_path)
                if result.get("verified"):
                    os.remove(temp_image_path)
                    return {"name": student_name, "status": "200"}
            except Exception as e:
                print("Error in DeepFace verification:", e)
        
        os.remove(temp_image_path)
        return {"name": "User not found", "status": "404"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")