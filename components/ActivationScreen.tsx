"use client";

import { useState } from 'react';
import { Fingerprint, ArrowRight, Loader2, Shield } from 'lucide-react';
import Link from 'next/link';

interface ActivationScreenProps {
  onSuccess: (user: any) => void;
}

export default function ActivationScreen({ onSuccess }: ActivationScreenProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/employee/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeCode: code })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('currentUser', JSON.stringify(data.employee));
        onSuccess(data.employee);
      } else {
        setError(data.error || 'Activation failed');
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100 rounded-bl-full opacity-50 pointer-events-none" />
        
        <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mb-6 shadow-sm z-10">
          <Fingerprint className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2 z-10">Device Activation</h1>
        <p className="text-slate-500 text-center mb-8 z-10">Enter your Employee ID to activate SecureAttend on this device.</p>
        
        <form onSubmit={handleActivate} className="w-full z-10">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Employee ID</label>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SC-042"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 uppercase transition-shadow placeholder:normal-case"
              required
            />
            {error && <p className="text-rose-500 text-sm mt-2">{error}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading || !code}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Activate Device <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-xs text-slate-400 text-center bg-slate-50 p-3 rounded-lg border border-slate-100 w-full z-10">
          <p className="font-semibold mb-1">Demo Codes:</p>
          <p className="font-mono">SC-042, SC-089, SC-102, ADMIN</p>
        </div>

        <div className="mt-4 text-center z-10 text-sm">
          <Link href="/admin" className="text-slate-400 hover:text-brand-600 font-medium flex items-center justify-center gap-1 transition-colors">
            <Shield className="w-4 h-4" /> Go to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
