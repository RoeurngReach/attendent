"use client";

import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CheckCircle2, ScanFace, X, Loader2 } from 'lucide-react';

interface FaceCheckInProps {
  onBack: () => void;
  onSuccess: (userId: string, name: string) => void;
}

export default function FaceCheckIn({ onBack, onSuccess }: FaceCheckInProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"loading_models" | "starting_camera" | "ready" | "capturing" | "success" | "error">("loading_models");
  const [message, setMessage] = useState("Loading AI models...");
  const [matchedName, setMatchedName] = useState("");
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;

    const loadModelsAndStart = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        
        if (!mounted) return;
        setStatus("starting_camera");
        setMessage("Starting camera...");

        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (videoRef.current && mounted) {
          videoRef.current.srcObject = stream;
          setStatus("ready");
          setMessage("Position your face to check-in");
        }
      } catch (err: any) {
        if (mounted) {
          setStatus("error");
          setMessage(`Error: ${err.message}`);
        }
      }
    };

    loadModelsAndStart();

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndMatch = async () => {
    if (!videoRef.current || status !== "ready") return;
    setStatus("capturing");
    setMessage("Matching face...");

    try {
      const detection = await faceapi.detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatus("ready");
        setMessage("No face detected. Please try again.");
        return;
      }

      // Read local enrollments to pass to server (mock DB)
      const enrollmentsString = localStorage.getItem('face_enrollments');
      const enrollments = enrollmentsString ? JSON.parse(enrollmentsString) : {};

      const response = await fetch('/api/face-match', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            descriptor: Array.from(detection.descriptor),
            enrollments
         })
      });

      const result = await response.json();

      if (response.ok && result.success) {
         setStatus("success");
         setMatchedName(result.match.name);
         setMessage(`Welcome, ${result.match.name}!`);
         
         setTimeout(() => {
            onSuccess(result.match.userId, result.match.name);
         }, 1500);
      } else {
         setStatus("ready");
         setMessage(result.error || "Face not recognized. Access denied.");
      }

    } catch (err: any) {
      setStatus("ready");
      setMessage(`Check-in failed: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
               <ScanFace className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800">Selfie Check-In</h2>
               <p className="text-sm text-slate-500">AI Identity Verification</p>
             </div>
          </div>
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 bg-slate-100 rounded-full overflow-hidden border-4 border-brand-200 shadow-inner flex items-center justify-center">
            {(status === "loading_models" || status === "starting_camera") && (
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            )}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transition-opacity duration-300 ${(status === "loading_models" || status === "starting_camera") ? 'opacity-0' : 'opacity-100'}`}
              onPlay={() => {
                if (status === "starting_camera") setStatus("ready");
              }}
            />
            {status === "success" && (
              <div className="absolute inset-0 bg-emerald-500/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                 <CheckCircle2 className="w-16 h-16 drop-shadow-md mb-2" />
                 <span className="font-medium text-lg drop-shadow-md">{matchedName}</span>
              </div>
            )}
          </div>
          
          <div className="text-center">
             <p className={`font-medium ${status === 'error' ? 'text-rose-600' : 'text-slate-600'}`}>
               {message}
             </p>
          </div>
          
          <button 
            onClick={captureAndMatch}
            disabled={status !== "ready"}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-sm ${
              status === "ready" 
              ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20 hover:shadow-brand-500/30'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
             <ScanFace className="w-5 h-5" />
             Verify & Submit
          </button>
        </div>
      </div>
    </div>
  );
}
