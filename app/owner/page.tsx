"use client";

import { useState, useEffect } from 'react';
import { Building, Settings, Link, Copy, Check, Save, LogOut } from 'lucide-react';

export default function OwnerPanel() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [copied, setCopied] = useState('');

  const fetchOrgs = async () => {
    try {
      const res = await fetch('/api/owner', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      if (res.ok) {
        const d = await res.json();
        setOrgs(d.orgs || []);
      } else {
        alert('Invalid Owner Password');
      }
    } catch(e) {}
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
    fetchOrgs();
  };

  const handleCreate = () => {
    setSelectedOrg({
      slug: '', name: '', admin_password: 'admin', 
      geofence: { lat: 11.562108, lng: 104.888535, radius: 200 },
      payroll: { workStart: "08:00", workEnd: "17:00", timezone: "Asia/Phnom_Penh" },
      qr_secret: 'secret_' + Date.now(),
      attendance_methods: { face_match: true, qr: true, gps: true, pin: true, manual: true }
    });
  };

  const saveOrg = async () => {
    if(!selectedOrg.slug) return alert('Slug is required');
    try {
      const res = await fetch('/api/owner', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ action: 'update', org: selectedOrg })
      });
      if (res.ok) {
        const d = await res.json();
        setOrgs(d.orgs || []);
        setSelectedOrg(null);
      }
    } catch(e: any) {
      alert(e.message);
    }
  };

  const copyLink = (path: string, slug: string) => {
    const url = `${window.location.origin}${path}?org=${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <form onSubmit={login} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-sm w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-800">Owner Terminal</h1>
            <p className="text-slate-500 text-sm">System Administration</p>
          </div>
          <div>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Owner Password"
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono text-center outline-none" />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
            Enter System
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3">
             <Building className="w-8 h-8 text-indigo-600" />
             <h1 className="text-2xl font-bold text-slate-800">Tenant Organizations</h1>
           </div>
           <button onClick={() => setAuthenticated(false)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2">
             <LogOut className="w-4 h-4" /> Logout
           </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <div className="md:col-span-1 space-y-4">
              <button onClick={handleCreate} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-sm transition-colors">
                + New Organization
              </button>
              {orgs.map(o => (
                <div key={o.slug} onClick={() => setSelectedOrg({...o})} className={`p-4 rounded-2xl cursor-pointer border transition-colors shadow-sm ${selectedOrg?.slug === o.slug ? 'bg-indigo-50 border-indigo-200 shadow-inner' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
                  <div className="font-bold text-slate-800">{o.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">/{o.slug}</div>
                </div>
              ))}
           </div>
           
           <div className="md:col-span-2">
             {selectedOrg ? (
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                   <Settings className="w-5 h-5 text-indigo-500" /> Organization Settings
                 </h2>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-sm font-bold text-slate-700">Name</label>
                     <input className="w-full p-3 bg-slate-50 border rounded-xl" value={selectedOrg.name} onChange={e=>setSelectedOrg({...selectedOrg, name: e.target.value})} />
                   </div>
                   <div className="space-y-1">
                     <label className="text-sm font-bold text-slate-700">Slug (ID)</label>
                     <input className="w-full p-3 bg-slate-50 border rounded-xl font-mono text-sm" value={selectedOrg.slug} onChange={e=>setSelectedOrg({...selectedOrg, slug: e.target.value})} disabled={orgs.some(o => o.slug === selectedOrg.slug)} />
                   </div>
                   <div className="space-y-1">
                     <label className="text-sm font-bold text-slate-700">Admin Password</label>
                     <input className="w-full p-3 bg-slate-50 border rounded-xl font-mono text-sm" value={selectedOrg.admin_password} onChange={e=>setSelectedOrg({...selectedOrg, admin_password: e.target.value})} />
                   </div>
                   <div className="space-y-1">
                     <label className="text-sm font-bold text-slate-700">QR Secret</label>
                     <input className="w-full p-3 bg-slate-50 border rounded-xl font-mono text-sm" value={selectedOrg.qr_secret} onChange={e=>setSelectedOrg({...selectedOrg, qr_secret: e.target.value})} />
                   </div>
                 </div>

                 <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">Attendance Methods</h3>
                    <div className="flex flex-wrap gap-4">
                      {['face_match', 'qr', 'gps', 'pin', 'manual'].map(method => (
                        <label key={method} className="flex items-center gap-2 text-sm text-slate-700 capitalize">
                          <input type="checkbox" checked={selectedOrg.attendance_methods[method]} 
                            onChange={e => setSelectedOrg({...selectedOrg, attendance_methods: {...selectedOrg.attendance_methods, [method]: e.target.checked}})} 
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                          {method.replace('_', ' ')}
                        </label>
                      ))}
                    </div>
                 </div>

                 {orgs.some(o => o.slug === selectedOrg.slug) && (
                   <div className="space-y-3 pt-4 border-t border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Link className="w-4 h-4"/> Direct Links</h3>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => copyLink('/', selectedOrg.slug)} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                          <span className="text-sm text-slate-700 font-medium">Employee Portal</span>
                          {copied.includes('/?org=') ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        </button>
                        <button onClick={() => copyLink('/admin', selectedOrg.slug)} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                          <span className="text-sm text-slate-700 font-medium">Admin Dashboard</span>
                          {copied.includes('/admin?org=') ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        </button>
                        <button onClick={() => copyLink('/kiosk', selectedOrg.slug)} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                          <span className="text-sm text-slate-700 font-medium">NFC Kiosk</span>
                          {copied.includes('/kiosk?org=') ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>
                   </div>
                 )}

                 <div className="pt-6">
                    <button onClick={saveOrg} className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Organization
                    </button>
                 </div>
               </div>
             ) : (
               <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex items-center justify-center text-slate-400 font-medium">
                  Select or create an organization
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
