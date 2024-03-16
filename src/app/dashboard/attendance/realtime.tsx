import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js'; // Import the face-api.js library

const ImageCapture: React.FC<{ onCapture: (imageData: string) => void }> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const loadModelsAndStartCamera = async () => {
      try {
        // Load face detection model
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

        // Start camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Set detecting flag to true when camera is ready
        setDetecting(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    loadModelsAndStartCamera();
  }, []); // Run once when component mounts

  useEffect(() => {
    if (detecting) {
      detectFaces();
    }
  }, [detecting]); // Run whenever `detecting` state changes

  const detectFaces = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      const intervalId = setInterval(async () => {
        // Detect faces in the video feed
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

        // Draw face landmarks on the canvas
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        
        // If at least one face is detected, capture the image
        if (detections.length > 0) {
          captureImage();
        }
      }, 1000); // Adjust the interval time as needed

      return () => clearInterval(intervalId);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        onCapture(imageData);
      }
    }
  };

  return (
    <div>
      <Card className='bg-background border-none rounded-sm drop-shadow-md'>
        <CardContent>
          <div>
            <video width="740" height="580" ref={videoRef} autoPlay />
            <canvas width="740" height="580" ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageCapture;
