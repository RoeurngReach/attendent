"use client";

import { useEffect, useState, useRef } from 'react';
import { IdCard, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function KioskPage() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<{ action: string; name: string; code: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [time, setTime] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keep focus on the hidden input at all times
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    focusInput();
    
    // Periodically force focus just in case
    const interval = setInterval(focusInput, 1000);
    window.addEventListener('click', focusInput);
    window.addEventListener('blur', focusInput);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', focusInput);
      window.removeEventListener('blur', focusInput);
    };
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nfcUid = inputValue.trim();
      setInputValue(''); // Reset immediately
      
      if (!nfcUid) return;
      
      await handleScan(nfcUid);
    }
  };

  const handleScan = async (nfcUid: string) => {
    setStatus('loading');
    
    try {
      // Optional: attach org if needed? The cookie mechanism might work for tenant,
      // but if the kiosk is set up for a specific org, it should use the URL params
      // or we just rely on the session cookie if configured.
      const res = await fetch('/api/attendance/kiosk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nfc_uid: nfcUid })
      });
      const data = await res.json();
      
      if (data.success) {
        setResult({
          action: data.action,
          name: data.employee.name,
          code: data.employee.code,
        });
        setStatus('success');
      } else {
        setErrorMessage(data.error || 'Check-in failed');
        setStatus('error');
      }
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setResult(null);
        setErrorMessage('');
      }, 3000);
      
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error');
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setResult(null);
        setErrorMessage('');
      }, 3000);
    }
  };

  // Add a small helper to persist org if opened from owner panel with ?org=xxx
  useEffect(() => {
    if (typeof window !== 'undefined') {
       const urlParams = new URLSearchParams(window.location.search);
       const org = urlParams.get('org');
       if (org) {
         document.cookie = `org=${org}; path=/; max-age=31536000`;
       }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Hidden input to capture HID USB reader keystrokes */}
      <input 
        ref={inputRef}
        type="text" 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="absolute w-0 h-0 opacity-0 overflow-hidden" 
        autoFocus
        autoComplete="off"
      />

      <div className="absolute top-12 left-12 flex items-center gap-4 text-slate-400">
        <IdCard className="w-8 h-8" />
        <span className="text-xl font-bold tracking-widest uppercase">Kiosk Mode</span>
      </div>

      <div className="absolute top-12 right-12 text-right">
        <div className="text-4xl font-bold text-white tracking-tight">
           {time ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--'}
        </div>
        <div className="text-slate-400 text-lg">
           {time ? time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '---'}
        </div>
      </div>

      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-8"
            >
              <div className="w-48 h-48 mx-auto bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 animate-pulse shadow-2xl">
                <IdCard className="w-20 h-20 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
              </div>
              <h1 className="text-5xl font-bold text-white drop-shadow-md">Please scan your card</h1>
              <p className="text-2xl text-slate-400">Tap your NFC card on the reader below the screen</p>
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-4"
            >
              <div className="w-24 h-24 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-3xl font-medium text-slate-300">Processing...</h2>
            </motion.div>
          )}

          {status === 'success' && result && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-slate-800 p-12 rounded-3xl border border-slate-700 shadow-2xl text-center space-y-6"
            >
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-lg ${
                result.action === 'IN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <div>
                 <h2 className="text-5xl font-bold text-white tracking-tight">{result.name}</h2>
                 <p className="text-xl text-slate-400 mt-2 font-mono">{result.code}</p>
              </div>
              <div className="inline-block mt-4">
                 <div className={`text-4xl font-black tracking-widest px-8 py-3 rounded-2xl ${
                   result.action === 'IN' ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-amber-500 text-white shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                 }`}>
                   CHECK {result.action}
                 </div>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-6 bg-red-950/40 p-12 rounded-3xl border border-red-900 shadow-2xl"
            >
              <div className="w-32 h-32 mx-auto rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shadow-lg">
                <XCircle className="w-20 h-20" />
              </div>
              <h2 className="text-5xl font-bold text-red-400">Access Denied</h2>
              <p className="text-2xl text-red-200/70">{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 text-slate-500 flex items-center gap-2">
         <Clock className="w-4 h-4" />
         Ready for next scan
      </div>
    </div>
  );
}
