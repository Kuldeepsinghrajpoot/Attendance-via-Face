# Attendance via Face Recognition

## Overview

Attendance via Face is a system that automates attendance tracking using facial recognition technology. This project leverages Next.js for the front end and integrates various technologies to provide a seamless experience.

## Features

- **Facial Recognition**: Uses advanced algorithms to identify and verify faces.
- **Real-time Attendance**: Automatically logs attendance as individuals are recognized.
- **User Management**: Manage user profiles and attendance records efficiently.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kuldeepsinghrajpoot/Attendance-via-Face.git
   cd Attendance-via-Face
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
### Running the Application

1. Start the development server:
   ``` bash
   npm run dev
   # or
   yarn dev

2. Open your browser and navigate to http://localhost:3000.
3. Replace `.env.temp` with `.env` and update the file with the basic requirements they are asking for.


### Technologies Used


## Frontend
- Next.js
- React
- Tailwind CSS

## Programming Language
- TypeScript
- Python

## Backend
- Next.js
- Rest API
- FastAPI
- ORM: Prisma
- Database: MongoDB

## ML Portion

### Dependencies
- [os](https://docs.python.org/3/library/os.html)
- [cv2 (OpenCV)](https://pypi.org/project/opencv-python/)
- [numpy (np)](https://numpy.org/)
- [face_recognition](https://pypi.org/project/face-recognition/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [BackgroundTasks](https://fastapi.tiangolo.com/tutorial/background-tasks/)
- [HTTPException](https://fastapi.tiangolo.com/tutorial/handling-errors/)
- [CORSMiddleware](https://fastapi.tiangolo.com/tutorial/cors/)
- [BaseModel (from pydantic)](https://pydantic-docs.helpmanual.io/)
- [base64](https://docs.python.org/3/library/base64.html)
- [requests](https://docs.python-requests.org/en/latest/)

### Run server
install all the required dependencies then run :

```bash
uvicorn app:app --reload
```


##If you encounter issues installing face_recognition due to missing dependencies like dlib, you can try installing it manually. Follow these steps:
1. Clone the Dlib Windows Python3.x repository from z-mahmud22/Dlib_Windows_Python3.x.
   ```bash
   git clone https://github.com/z-mahmud22/Dlib_Windows_Python3.x.git
   ```
2. Navigate to the cloned repository.
   ```bash
   cd Dlib_Windows_Python3.x
   ```
3. Install dlib using pip.
   ```bash
   pip install dlib-19.21.99-cp39-cp39-win_amd64.whl
   ```
4. Replace dlib-19.21.99-cp39-cp39-win_amd64.whl with the appropriate wheel file for your Python version and architecture.

Once dlib is installed, you can proceed to install face_recognition
  ```bash
  Replace dlib-19.21.99-cp39-cp39-win_amd64.whl with the appropriate wheel file for your Python version and architecture.

Once dlib is installed, you can proceed to install face_recognition
 ```
### Run once again file
```bash
uvicorn app:app --reload
```




