'use client'
import ImageCapture from "./realtime"
import { useRouter } from 'next/navigation'


export default function TableDemo() {
  const router = useRouter()
  const handleCapture = async (dataURL: string) => {
    const response = await fetch('http://127.0.0.1:8000/verify-face', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: dataURL }),
    });
    const data = await response.json();
    
    console.log(data.id);
    router.refresh()


  }

  return (
    <div className="md:flex md:justify-start ">
      <div className=" rounded-md">
          <ImageCapture onCapture={handleCapture} />
      </div>
   
    </div>
  )
}
