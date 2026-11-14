import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle2, AlertCircle, FlipHorizontal, Upload } from 'lucide-react';

interface CustomCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  title?: string;
}

export const CustomCameraModal: React.FC<CustomCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Front Camera Selfie Verification'
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); // Default: Front camera
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async (mode: 'user' | 'environment') => {
    setIsInitializing(true);
    setCameraError(null);
    stopCamera();

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('[Camera] getUserMedia error:', err);
      setCameraError(
        'Unable to access camera. Please allow camera permissions or upload a selfie file manually below.'
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Flip horizontally if front camera for natural mirror effect
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleToggleCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setCapturedImage(dataUrl);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#161922] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#0A0C10] border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport / Preview */}
        <div className="relative bg-black aspect-[4/3] flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Selfie Preview"
              className="w-full h-full object-cover"
            />
          ) : cameraError ? (
            <div className="p-6 text-center space-y-3 text-xs text-red-300">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <p>{cameraError}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover ${
                facingMode === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />
          )}

          {/* Front Camera Indicator Badge */}
          {!capturedImage && !cameraError && (
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-white flex items-center space-x-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{facingMode === 'user' ? 'Front Camera (Selfie Mode)' : 'Rear Camera'}</span>
            </div>
          )}

          {/* Flip Camera Button */}
          {!capturedImage && !cameraError && (
            <button
              type="button"
              onClick={handleToggleCamera}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 text-white cursor-pointer transition-transform hover:scale-105"
              title="Flip Camera"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Footer */}
        <div className="p-4 bg-[#0A0C10] border-t border-gray-800 space-y-3">
          {capturedImage ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Selfie</span>
              </button>
              
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confirm Selfie</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCapture}
                disabled={isInitializing || !!cameraError}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Selfie (Front Camera)</span>
              </button>

              {/* Upload fallback */}
              <div className="relative text-center">
                <label className="text-[11px] text-gray-400 hover:text-blue-400 cursor-pointer flex items-center justify-center space-x-1">
                  <Upload className="w-3 h-3" />
                  <span>Or select selfie image file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
