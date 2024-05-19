'use client'

import React, { useRef, useEffect } from 'react';

interface ImageCaptureProps {
    onCapture: (imageData: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current && stream) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };

        startCamera();

        const intervalId = setInterval(captureImage, 1000); // Capture image every 1000 milliseconds (1 second)

        return () => {
            clearInterval(intervalId); // Clear the interval when the component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop()); // Stop all tracks in the stream
            }
        };
    }, []);

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/jpeg');
                onCapture(imageData);
            }
        }
    };

    return (
        <div className=' rounded-md'>
            <video className='w-96 rounded-md shadow-xl' ref={videoRef} autoPlay />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
}

export default ImageCapture;
