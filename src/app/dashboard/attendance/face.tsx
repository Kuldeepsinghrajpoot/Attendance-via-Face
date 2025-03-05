'use client'
import ImageCapture from "./realtime";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

export default function FaceVerify() {
  const router = useRouter();

  const handleCapture = async (dataURL: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_FAST_API}/verify-face`, {
        image: dataURL,
      });
      router.refresh();
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = response.data;

      if (data) {
        toast.success(data[0], { position: "top-right", autoClose: 5000 });
      } else {
        toast.error(data?.message, {
          position: "top-right",
        });
      }

     
    } catch (error) {
      console.error("Error in handleCapture:", error);
      toast.error("Failed to send image for verification!", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="md:flex md:justify-start">
      <div className="rounded-md">
        <ImageCapture onCapture={handleCapture} />
      </div>
    </div>
  );
}