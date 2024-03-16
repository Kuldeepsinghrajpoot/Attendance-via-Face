'use client'


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { useRef, useState } from 'react';


const ImageCapture: React.FC<{ onCapture: (imageData: string) => void }> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImageData, setCapturedImageData] = useState<string>('');

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImageData(imageData);
        onCapture(imageData);
      }
    }
    stopCapture();
  };

  const stopCapture = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setStream(null); // Reset stream state
    }
  };


  return (
    <div  >
      <>
        <Card className=' bg-background   border-none rounded-sm  drop-shadow-md   '>
         <div className='py-2'></div>
          <CardContent>
            <div className=''>
              {capturedImageData === "" ? (

                <video width="740" height="580" ref={videoRef} autoPlay />

              ) : (
                <img width="740" height="580" className=' rounded-md' src={capturedImageData} alt="Captured Image" />
              )}
              {capturedImageData === "" ? (
                <canvas width="740" height="580" ref={canvasRef} style={{ display: 'none' }} />
              ) : null}
            </div>
          </CardContent>
         {capturedImageData === ""&& <CardContent>
            <div className='flex justify-between gap-5 text-sm '>

            <Button className=' rounded-md  -py-10'  onClick={startCapture}>Start </Button>
            <Button className=' rounded-md  -py-10'   onClick={captureImage}>Capture </Button>
            </div>

          </CardContent>}
         
        </Card>
      </>

    </div>
  );
};

export default ImageCapture;
