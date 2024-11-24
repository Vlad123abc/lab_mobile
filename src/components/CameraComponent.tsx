import React, { useRef, useState } from "react";
export interface ImageProps {
  onImageCaptured: (imageData: string) => void; // Callback for image capture
}

const WebcamCapture: React.FC<ImageProps> = ({ onImageCaptured }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    }
  };

  const takePicture = () => {
    console.log("taking bloody pic");
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        // Set canvas dimensions to match video dimensions
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
        const imageDataUrl = canvasRef.current.toDataURL("image/png");
        console.log("image data url is: ", imageDataUrl);
        setPhoto(imageDataUrl);
        onImageCaptured(imageDataUrl);
      } else {
        console.log("no bloody context");
      }
    } else {
      console.log("failed");
    }
  };

  return (
    <div>
      <h1>Webcam Capture</h1>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={takePicture}>Take Picture</button>
      <div>
        <video ref={videoRef} style={{ width: "100%", marginTop: "20px" }} />
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {photo && (
        <div>
          <h2>Captured Image</h2>
          <img
            src={photo}
            alt="Captured"
            style={{ width: "100%", marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
