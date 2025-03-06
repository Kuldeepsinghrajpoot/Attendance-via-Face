"use client";
import { useEffect, useRef, useState } from "react";

const IMAGE_INTERVAL_MS = 42;

const drawFaceRectangles = (video, canvas, faces) => {
  const ctx = canvas.getContext("2d");

  ctx.width = video.videoWidth;
  ctx.height = video.videoHeight;

  ctx.beginPath();
  ctx.clearRect(0, 0, ctx.width, ctx.height);
  for (const [x, y, width, height] of faces.faces) {
    ctx.strokeStyle = "#49fb35";
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();
  }
};

export default function FaceDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  let socket = useRef(null);
  let intervalId = useRef(null);

  useEffect(() => {
    async function getCameras() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    }
    getCameras();
  }, []);

  const startFaceDetection = (deviceId) => {
    if (socket.current) {
      socket.current.close();
    }

    socket.current = new WebSocket("ws://127.0.0.1:5000/face-detection");

    socket.current.addEventListener("open", () => {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { deviceId, width: { max: 640 }, height: { max: 480 } },
        })
        .then((stream) => {
          if (!videoRef.current || !canvasRef.current) return;

          videoRef.current.srcObject = stream;
          videoRef.current.play().then(() => {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;

            intervalId.current = setInterval(() => {
              const tempCanvas = document.createElement("canvas");
              const ctx = tempCanvas.getContext("2d");
              tempCanvas.width = videoRef.current.videoWidth;
              tempCanvas.height = videoRef.current.videoHeight;
              ctx.drawImage(videoRef.current, 0, 0);

              tempCanvas.toBlob((blob) => socket.current.send(blob), "image/jpeg");
            }, IMAGE_INTERVAL_MS);
          });
        });
    });

    socket.current.addEventListener("message", (event) => {
      console.log("Message from server ", JSON.stringify(event.data));
      if (videoRef.current && canvasRef.current) {
        drawFaceRectangles(videoRef.current, canvasRef.current, JSON.parse(event.data));
      }
    });

    socket.current.addEventListener("close", () => {
      clearInterval(intervalId.current);
      if (videoRef.current) videoRef.current.pause();
    });
  };

  return (
    <div>
      <h1>Face Detection</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startFaceDetection(selectedDevice);
        }}
      >
        <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
        <button type="submit">Start Detection</button>
      </form>
      <video ref={videoRef} autoPlay playsInline style={{ display: "block", width: "100%" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
    </div>
  );
}
