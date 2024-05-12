'use client'
// import { toast } from "@/components/ui/use-toast"
import ImageCapture from "./realtime"
import { useRouter } from 'next/navigation'
import { ToastAction } from "@radix-ui/react-toast"
import { toast } from 'react-toastify';

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

  
 
    toast.success(data[0], {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
   
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
