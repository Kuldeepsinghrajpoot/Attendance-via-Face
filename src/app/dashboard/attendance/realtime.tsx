'use client';

import React, { useRef, useEffect } from 'react';
interface ImageCaptureProps {
    onCapture: (imageData: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null); // Store stream reference

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream; // Store stream in ref
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };

        startCamera();

        const intervalId = setInterval(captureImage, 10000); // Capture image every 10 sec

        return () => {
            clearInterval(intervalId); // Clear interval when component unmounts
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop()); // Stop camera properly
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
        <div className='rounded-md'>
            <video className='w-96 rounded-md shadow-xl' ref={videoRef} autoPlay />
            <div></div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default ImageCapture;
