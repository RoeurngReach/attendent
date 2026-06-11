"use client";

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { X, QrCode, CheckCircle2, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onClose: () => void;
  userId: string;
}

export default function QRScanner({ onClose, userId }: QRScannerProps) {
  const [status, setStatus] = useState<"scanning" | "processing" | "success" | "error">("scanning");
  const [message, setMessage] = useState("Scan the Office QR code");

  const handleScan = async (text: string) => {
    if (status !== "scanning") return;
    setStatus("processing");
    setMessage("Validating QR...");

    try {
      // Parse QR payload
      let secret = "";
      try {
        const payload = JSON.parse(text);
        if (payload.secret) {
          secret = payload.secret;
        }
      } catch (e) {
        // Fallback if not json
        secret = text;
      }

      const res = await fetch('/api/qr/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, userId })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage("Check-in via QR successful!");
        await fetch('/api/submit-checkin', {
           method: 'POST',
           body: JSON.stringify({ userId, method: 'Office QR' })
        });
        setTimeout(() => onClose(), 2000);
      } else {
        setStatus("error");
        setMessage(data.error || "Invalid QR code");
        setTimeout(() => {
          setStatus("scanning");
          setMessage("Scan the Office QR code");
        }, 3000);
      }
    } catch (err: any) {
      setStatus("error");
      setMessage("Error processing QR: " + err.message);
      setTimeout(() => {
        setStatus("scanning");
        setMessage("Scan the Office QR code");
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
               <QrCode className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800">Scan QR</h2>
               <p className="text-sm text-slate-500">Check-in via Office Scan</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center gap-6 relative">
           
           {status === "scanning" || status === "processing" ? (
             <div className="w-full aspect-square rounded-2xl overflow-hidden bg-black/5 relative border-4 border-slate-100 shadow-inner">
                {status === "processing" && (
                   <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                   </div>
                )}
                <Scanner 
                   onScan={(codes) => { if (codes.length > 0) handleScan(codes[0].rawValue); }} 
                   onError={(error) => console.log(error?.message)} 
                   scanDelay={3000}
                   allowMultiple={true}
                />
             </div>
           ) : status === "success" ? (
             <div className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center bg-emerald-50 text-emerald-600 border-4 border-emerald-100">
                <CheckCircle2 className="w-16 h-16 mb-4" />
                <span className="font-medium text-lg text-emerald-700">Success!</span>
             </div>
           ) : (
             <div className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center bg-rose-50 text-rose-600 border-4 border-rose-100">
                <AlertCircle className="w-16 h-16 mb-4" />
                <span className="font-medium text-lg text-rose-700">{message}</span>
             </div>
           )}

           <div className={`text-center font-medium ${
              status === 'error' ? 'text-rose-600' :
              status === 'success' ? 'text-emerald-600' :
              'text-slate-600'
           }`}>
             {message}
           </div>

        </div>
      </div>
    </div>
  );
}
