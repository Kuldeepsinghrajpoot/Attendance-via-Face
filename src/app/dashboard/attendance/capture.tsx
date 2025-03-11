"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function CameraCapture({ attendanceData }: any) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [matchResult, setMatchResult] = useState<string | null>(null);
    const [attendanceMarked, setAttendanceMarked] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false); // Track dialog open/close state
    const Router = useRouter();
    const { data: session } = useSession();
    const id = session?.user?.id;

    useEffect(() => {
        if (open) {
            startCamera();
        } else {
            stopCamera();
            resetState(); // Clear image & match result when dialog closes
        }
    }, [open]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    };
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    };
    const resetState = () => {
        setCapturedImage(null);
        setMatchResult(null);
        setAttendanceMarked(false);
    };
    const captureAndVerify = async () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            if (context) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                context.drawImage(
                    videoRef.current,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                const imageData = canvas.toDataURL("image/png");
                setCapturedImage(imageData); // Set captured image (triggers re-render)
                stopCamera(); // Stop the camera after capturing the image
                try {
                    const verifyResponse = await fetch(
                        "http://127.0.0.1:5000/verify-face",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ image: imageData }),
                        }
                    );
                    const verifyData = await verifyResponse.json();
                    setMatchResult(verifyData.name);
                    if (verifyData.status === "200") {
                        // Router.refresh();
                        await markAttendance(verifyData.name);
                    }
                } catch (error) {
                    setMatchResult("Verification failed.");
                }
            }
        }
    };

    const markAttendance = async (name: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_PORT}/api/attendance?id=${id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...attendanceData, avatar: name }),
                }
            );
            if (!response.ok) {
                throw new Error(`Failed with status ${response.status}`);
            }
            const data = await response.json();
            // console.log(data);
            if (data.status === 200) {
                setAttendanceMarked(true);
                toast.success(data.message);
            } else {
                toast.error(data.errors);
            }

            Router.refresh(); // Corrected syntax
            stopCamera(); // Stop camera after attendance is marked
        } catch (error) {
            // console.error(error);
            toast.error("Failed to mark attendance.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="space-x-1" variant="ghost">
                    <User2 />
                    <span>Mark</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center gap-4 p-4">
                <div className="flex flex-col items-center gap-4">
                    {!capturedImage && (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className=" w-80 h-60 border rounded-lg "
                        />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                    {capturedImage && (
                        <>
                            <h3 className="text-lg font-semibold">
                                Captured Image:
                            </h3>
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="w-80 h-60 border rounded-lg "
                            />
                            {matchResult && (
                                <p className="text-lg font-bold">
                                    {matchResult}
                                </p>
                            )}
                            {attendanceMarked && (
                                <p className="text-primary font-bold">
                                    Attendance Marked Successfully
                                </p>
                            )}
                        </>
                    )}
                </div>
                <Button onClick={captureAndVerify} className=" rounded-sm">
                    Capture & Verify
                </Button>
            </DialogContent>
        </Dialog>
    );
}
