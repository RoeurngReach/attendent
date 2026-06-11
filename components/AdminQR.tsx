"use client";

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, RefreshCw, Printer, Download, QrCode } from 'lucide-react';
import Image from 'next/image';

interface AdminQRProps {
  onClose: () => void;
}

export default function AdminQR({ onClose }: AdminQRProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchCurrentQR = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/qr/generate');
      const data = await res.json();
      if (data.success) {
        setSecret(data.secret);
        generateQR(data.secret);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const regenerateQR = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/qr/generate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSecret(data.secret);
        generateQR(data.secret);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const generateQR = async (text: string) => {
    try {
      // payload could be a valid json or just the secret
      const payload = JSON.stringify({ office: "HQ", secret: text });
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e293b', // slate-800
          light: '#ffffff'
        }
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCurrentQR();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `office-qr-${new Date().getTime()}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
               <QrCode className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800">Office QR</h2>
               <p className="text-sm text-slate-500">Admin Mode</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center gap-6">
           <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {qrDataUrl ? (
                 <Image src={qrDataUrl} alt="Office QR Code" width={300} height={300} className="rounded-xl" />
              ) : (
                 <div className="w-[300px] h-[300px] flex items-center justify-center text-slate-400">Loading...</div>
              )}
           </div>

           <div className="flex w-full gap-3">
              <button 
                onClick={regenerateQR}
                disabled={loading}
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
              <button 
                onClick={handleDownload}
                disabled={!qrDataUrl}
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
