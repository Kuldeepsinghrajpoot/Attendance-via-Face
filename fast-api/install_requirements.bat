@echo off
echo Installing required Python dependencies...
pip install fastapi uvicorn numpy opencv-python dlib deepface requests pydantic
echo Installation complete!
pause
