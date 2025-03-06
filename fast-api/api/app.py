import asyncio
import os
import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Tuple
from deepface import DeepFace

app = FastAPI()

class Faces(BaseModel):
    faces: List[Tuple[int, int, int, int]]
    match: bool
    matched_person: str | None = None

# Load known faces from the "face" folder
def load_known_faces(folder_path="faces"):
    known_faces = {}

    for filename in os.listdir(folder_path):
        if filename.endswith((".jpg", ".png")):
            path = os.path.join(folder_path, filename)
            known_faces[filename.split(".")[0]] = path  # Store filename as the person's name

    return known_faces

# Global variable to store known faces
known_faces = load_known_faces()

async def receive(websocket: WebSocket, queue: asyncio.Queue):
    bytes_data = await websocket.receive_bytes()
    try:
        queue.put_nowait(bytes_data)
    except asyncio.QueueFull:
        pass

async def detect(websocket: WebSocket, queue: asyncio.Queue):
    while True:
        bytes_data = await queue.get()
        data = np.frombuffer(bytes_data, dtype=np.uint8)
        img = cv2.imdecode(data, 1)

        # Convert to RGB (DeepFace expects RGB images)
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Detect faces using OpenCV
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        gray = cv2.cvtColor(rgb_img, cv2.COLOR_RGB2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        match_found = False
        matched_person = None

        if len(faces) == 0:
            # No face detected, send an empty response
            faces_output = Faces(faces=[], match=False, matched_person=None)
        else:
            for (x, y, w, h) in faces:
                face_roi = rgb_img[y:y+h, x:x+w]  # Extract detected face region
                
                # Compare with stored faces using DeepFace
                for person_name, face_path in known_faces.items():
                    try:
                        result = DeepFace.verify(img1_path=face_roi, img2_path=face_path, model_name="Facenet", enforce_detection=False, spofing=True)

                        if result["verified"]:
                            match_found = True
                            matched_person = person_name
                            break
                    except Exception as e:
                        print(f"Error in DeepFace verification: {e}")

                if match_found:
                    break  # Exit loop if a match is found

            faces_output = Faces(faces=faces.tolist(), match=match_found, matched_person=matched_person)

        await websocket.send_json(faces_output.dict())

@app.websocket("/face-detection")
async def face_detection(websocket: WebSocket):
    await websocket.accept()
    queue: asyncio.Queue = asyncio.Queue(maxsize=10)
    detect_task = asyncio.create_task(detect(websocket, queue))
    
    try:
        while True:
            await receive(websocket, queue)
    except WebSocketDisconnect:
        detect_task.cancel()
        await websocket.close()

@app.on_event("startup")
async def startup():
    global known_faces
    known_faces = load_known_faces()
