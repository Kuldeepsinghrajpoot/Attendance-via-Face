'use client'
import { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const FaceDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.tinyYolov2.loadFromUri('/models') // Load TinyYolov2 model
      ]);
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    loadModels();
    startVideo();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return; // Exit if videoRef is null

    videoRef.current.addEventListener('play', async () => {
      const canvas = faceapi.createCanvasFromMedia(videoRef?.current);
      document.body.append(canvas);
      const displaySize = { width: videoRef?.current?.videoWidth || 640, height: videoRef?.current?.videoHeight || 480 };
      faceapi.matchDimensions(canvas, displaySize);
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef?.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }, 100);
    });
  }, []);

  return <video id="video" ref={videoRef} autoPlay muted />;
};

export default FaceDetection;
