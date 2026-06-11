"use client";

import { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import { Fingerprint, Clock, UserPlus, QrCode, ScanLine, LogOut } from 'lucide-react';
import GPSAttendance from '@/components/GPSAttendance';
import ActivationScreen from '@/components/ActivationScreen';

const FaceRegistration = dynamic(() => import('@/components/FaceRegistration'), { ssr: false });
const AdminQR = dynamic(() => import('@/components/AdminQR'), { ssr: false });
const QRScanner = dynamic(() => import('@/components/QRScanner'), { ssr: false });

export default function App() {
  const [time, setTime] = useState<Date | null>(null);
  const [showFaceReg, setShowFaceReg] = useState(false);
  const [showAdminQR, setShowAdminQR] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [methods, setMethods] = useState<any>({});
  
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
       const urlParams = new URLSearchParams(window.location.search);
       const org = urlParams.get('org');
       if (org) {
         document.cookie = `org=${org}; path=/; max-age=31536000`;
       }
    }
    
    fetch('/api/admin/config').then(r=>r.json()).then(d=>{
      if(d.methods) setMethods(d.methods);
    }).catch(e=>{});
  }, []);

  useEffect(() => {
    // Check local storage for activation
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentUser(parsedUser);
        
        // Auto-link Telegram if opened inside Telegram Mini App
        if (typeof window !== 'undefined') {
          import('@twa-dev/sdk').then((twa) => {
            const WebApp = twa.default;
            if (WebApp && WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
              fetch('/api/employee/activate', {
                method: 'POST',
                body: JSON.stringify({ employeeCode: parsedUser.code, telegramId: WebApp.initDataUnsafe.user.id.toString() })
              });
            }
          }).catch((err) => console.log('TWA SDK not loaded:', err));
        }
      } catch (e) {
        // Invalid json
      }
    }

    setIsInitializing(false);

    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
     localStorage.removeItem('currentUser');
     setCurrentUser(null);
  };

  if (isInitializing) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans tracking-wide">Loading...</div>;
  }

  if (!currentUser) {
    return <ActivationScreen onSuccess={setCurrentUser} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full font-sans">
      {/* Header */}
      <header className="bg-gradient-sleek text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 bg-opacity-80 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 backdrop-blur-sm border border-brand-400/30">
              <Fingerprint className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-100 to-indigo-300">
              SecureAttend
            </span>
            <span className="ml-2 text-xs bg-white/10 px-2 py-1 rounded-md text-indigo-200">
              {currentUser.code}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 glass-panel px-4 py-2 rounded-full border border-indigo-400/20 bg-black/20 backdrop-blur-md">
              <Clock className="w-4 h-4 text-indigo-300" />
              <span className="font-mono text-sm tracking-widest text-indigo-100">
                {time ? time.toLocaleTimeString('en-US', { hour12: false }) : '00:00:00'}
              </span>
            </div>
            {currentUser.role === 'admin' && (
              <button 
                onClick={() => setShowAdminQR(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 rounded-full transition-colors backdrop-blur-md"
              >
                <QrCode className="w-4 h-4 text-indigo-200" />
                <span className="text-sm font-medium text-indigo-100">Office QR</span>
              </button>
            )}
            <button 
              onClick={() => setShowFaceReg(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 rounded-full transition-colors backdrop-blur-md"
            >
              <UserPlus className="w-4 h-4 text-indigo-200" />
              <span className="text-sm font-medium text-indigo-100">Register Face</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-full transition-colors backdrop-blur-md border border-rose-500/20 ml-2"
              title="Logout / Deactivate"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full pt-12 pb-24">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/secure/1920/1080')] bg-cover bg-center opacity-5 mix-blend-overlay pointer-events-none" />
        
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Greeting Hero */}
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 mb-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-5 rounded-bl-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div>
                 <p className="text-brand-600 font-medium tracking-wide text-sm mb-2 uppercase">Welcome back, {currentUser.department}</p>
                 <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
                   សួស្តី, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{currentUser.name}</span>
                 </h1>
                 <p className="text-slate-500 max-w-xl text-lg">
                   Manage your daily attendance, request leaves, and review payroll details natively directly from your dashboard.
                 </p>
               </div>
               
               <div className="flex flex-col gap-3 shrink-0">
                 {methods.qr !== false && (
                   <button 
                      onClick={() => setShowQRScanner(true)}
                      className="flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20 hover:shadow-brand-500/30 px-6 py-4 rounded-xl font-bold transition-all shadow-sm"
                   >
                      <ScanLine className="w-5 h-5" />
                      Scan Office QR
                   </button>
                 )}
                 <div className="flex sm:hidden gap-3">
                   {currentUser.role === 'admin' && methods.qr !== false && (
                     <button 
                       onClick={() => setShowAdminQR(true)}
                       className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium text-sm"
                     >
                       <QrCode className="w-4 h-4" />
                       Admin QR
                     </button>
                   )}
                   {methods.face_match !== false && (
                     <button 
                       onClick={() => setShowFaceReg(true)}
                       className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium text-sm"
                     >
                       <UserPlus className="w-4 h-4" />
                       Face Set
                     </button>
                   )}
                 </div>
               </div>
            </div>
          </div>

          {/* GPS Attendance Module */}
          <GPSAttendance currentUser={currentUser} />
        </div>
      </main>

      {showFaceReg && (
         <FaceRegistration 
           userId={currentUser.code} 
           userName={currentUser.name} 
           onClose={() => setShowFaceReg(false)} 
         />
      )}

      {showAdminQR && <AdminQR onClose={() => setShowAdminQR(false)} />}
      {showQRScanner && <QRScanner userId={currentUser.code} onClose={() => setShowQRScanner(false)} />}
    </div>
  );
}
