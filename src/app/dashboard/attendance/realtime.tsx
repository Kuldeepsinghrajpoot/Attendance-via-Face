'use client'
import { Card } from '@/components/ui/card';
import React, { useRef, useState, useEffect } from 'react';

interface ImageCaptureProps {
    onCapture: (imageData: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [capturedImageData, setCapturedImageData] = useState<string>('');

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
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
        };
    }, []);

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                const imageData = canvasRef.current.toDataURL('image/jpeg');
                // setCapturedImageData(imageData);
                onCapture(imageData);
            }
        }
    };

    return (
        <div className=' rounded-md'>
            
            <video  className='w-96 rounded-md  shadow-xl' ref={videoRef} autoPlay />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
           
        </div>
    );
}

export default ImageCapture;
