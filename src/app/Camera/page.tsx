// 'use client'
// import React, { useRef, useState } from 'react';

// interface ImageCaptureProps {
//     onCapture: (imageData: string) => void; // Change "never" to "void" for the return type
// }

// const ImageCapture: React.FC<ImageCaptureProps> = ({ onCapture }) => {
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const [stream, setStream] = useState<MediaStream | null>(null);
//     const [capturedImageData, setCapturedImageData] = useState<string>('');

//     const startCapture = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//             setStream(stream);
//             if (videoRef.current) {
//                 videoRef.current.srcObject = stream;
//             }
//         } catch (error) {
//             console.error('Error accessing camera:', error);
//         }
//     };

//     const captureImage = () => {
//         if (videoRef.current && canvasRef.current) {
//             const context = canvasRef.current.getContext('2d');
//             if (context) {
//                 context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
//                 const imageData = canvasRef.current.toDataURL('image/jpeg');
//                 setCapturedImageData(imageData);
//                 onCapture(imageData);
//             }
//         }
//         stopCapture();
//     };

//     const stopCapture = () => {
//         if (stream) {
//             const tracks = stream.getTracks();
//             tracks.forEach(track => track.stop());
//             setStream(null); // Reset stream state
//         }
//     };

//     return (
//         <div className='flex justify-start'>
//             <div className='w-full h-full'>
//                 <label htmlFor="name">Capture Image</label>
//                 <div className='h-24 w-24 rounded-lg'>
//                     {capturedImageData ? (
//                         <img className='h-[5.8rem] w-24 rounded-md overflow-hidden items-center object-cover' src={capturedImageData} alt="Captured Image" />
//                     ) : (
//                         <video className='h-24 w-24' ref={videoRef} autoPlay />
//                     )}
//                     {capturedImageData === "" && (
//                         <canvas ref={canvasRef} style={{ display: 'none' }} />
//                     )}
//                 </div>
//             </div>
//             <div className='w-full h-full py-10 gap-5'>
//                 <div className='flex justify-start gap-10 text-white'>
//                     <div>
//                         <button type='button' onClick={startCapture} className='bg-red-700 w-[6rem] px-3 rounded-md py-2 gap-5'>Start</button>
//                     </div>
//                     <div>
//                         <button type='button' onClick={captureImage} className='bg-red-700 w-[6rem] px-3 rounded-md py-2 gap-5'>Capture</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ImageCapture;

import React from 'react';

const page = () => {
  return (
    <div>
      
    </div>
  );
}

export default page;
