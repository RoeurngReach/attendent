"use client";

import { useState } from 'react';
import { Fingerprint, MapPin, ScanFace, Clock, CalendarDays, CheckCircle2, User, LogOut, ChevronLeft, ChevronRight, FileText, Check, X, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leave'>('dashboard');
  const [logs, setLogs] = useState<any[]>([
    { name: 'ចាន់ តុលា (Chan Tola)', id: 'SC-042', time: '07:52 AM', method: 'AI FACE MATCH', status: 'VERIFIED', originalMethod: 'face' },
    { name: 'លីម សុគន្ធ (Lim Sokun)', id: 'SC-089', time: '08:15 AM', method: 'NFC SCAN', status: 'LATE', originalMethod: 'nfc' },
    { name: 'គង់ ស្រីនី (Kong Sreyny)', id: 'SC-102', time: '07:45 AM', method: 'QR CODE', status: 'VERIFIED', originalMethod: 'qr' }
  ]);

  return (
    <div className="w-full h-full flex overflow-hidden bg-transparent text-white font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-black/20 border-r border-indigo-500/20 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0a11.959 11.959 0 01-2.251 5.74m-12.734 0A11.959 11.959 0 014.382 6.016M12 21.48c-3.188 0-6.271-1.156-8.618-3.04a11.962 11.962 0 01-1.282-1.378m17.18 2.756c-2.347 1.884-5.43 3.04-8.618 3.04"></path></svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-violet-200">SecureAttend</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <div onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-lg flex items-center gap-3 transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/20' : 'text-indigo-300/60 hover:text-white'}`}>
            <div className={`w-1.5 h-6 rounded-full ${activeTab === 'dashboard' ? 'bg-indigo-500' : 'opacity-0'}`}></div>
            <span className="font-medium">ផ្ទាំងគ្រប់គ្រង (Dashboard)</span>
          </div>
          <div onClick={() => setActiveTab('leave')} className={`p-3 rounded-lg flex items-center gap-3 transition-colors cursor-pointer ${activeTab === 'leave' ? 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/20' : 'text-indigo-300/60 hover:text-white'}`}>
            <div className={`w-1.5 h-6 rounded-full ${activeTab === 'leave' ? 'bg-indigo-500' : 'opacity-0'}`}></div>
            <span>ច្បាប់ឈប់សម្រាក (Leave)</span>
          </div>
          <div className="p-3 text-indigo-300/60 hover:text-white rounded-lg flex items-center gap-3 transition-colors cursor-default">
            <div className="w-1.5 h-6 opacity-0"></div>
            <span>បុគ្គលិក (Employees)</span>
          </div>
          <div className="p-3 text-indigo-300/60 hover:text-white rounded-lg flex items-center gap-3 transition-colors cursor-default">
            <div className="w-1.5 h-6 opacity-0"></div>
            <span>វត្តមាន (Attendance)</span>
          </div>
          <div className="p-3 text-indigo-300/60 hover:text-white rounded-lg flex items-center gap-3 transition-colors cursor-default">
            <div className="w-1.5 h-6 opacity-0"></div>
            <span>ប្រាក់បៀវត្សរ៍ (Payroll)</span>
          </div>
          <div className="p-3 text-indigo-300/60 hover:text-white rounded-lg flex items-center gap-3 transition-colors cursor-default">
            <div className="w-1.5 h-6 opacity-0"></div>
            <span>ការកំណត់ (Settings)</span>
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-indigo-500/10">
          <div className="bg-violet-900/40 p-4 rounded-xl border border-indigo-400/10">
            <p className="text-xs text-indigo-300/70 mb-2">សាលារៀនដែលបានជ្រើសរើស (Current Tenant)</p>
            <p className="text-sm font-semibold">Northbridge International School</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-black/10 border-b border-indigo-500/10">
          <div>
            <h1 className="text-2xl font-bold">{activeTab === 'dashboard' ? 'របាយការណ៍សង្ខេប' : 'គ្រប់គ្រងការឈប់សម្រាក'}</h1>
            <p className="text-sm text-indigo-300/60">ថ្ងៃព្រហស្បតិ៍, ១៨ មេសា ២០២៤ (Thursday, April 18, 2024)</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Live Sync</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">សុខ វិសាល (Visal Sok)</p>
                <p className="text-[10px] text-indigo-300/50">ADMINISTRATOR</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 border-2 border-indigo-400/30 flex items-center justify-center">
                 <User className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 overflow-y-auto flex flex-col gap-8">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Check-In Panel */}
              <div className="bg-indigo-900/20 border border-indigo-400/10 p-6 rounded-2xl flex flex-col items-start gap-4">
                 <h2 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-400" />
                    ជម្រើសបញ្ចូលវត្តមាន
                 </h2>
                 
                 <button className="w-full flex items-center p-4 rounded-xl bg-black/20 border border-indigo-500/20 hover:bg-white/5 transition-colors text-left group">
                    <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400 mr-4 group-hover:bg-blue-500/40 transition-colors">
                       <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="font-medium text-white">GPS Check-In</p>
                       <p className="text-xs text-indigo-300/60">Check in with location</p>
                    </div>
                 </button>

                 <button className="w-full flex items-center p-4 rounded-xl bg-black/20 border border-indigo-500/20 hover:bg-white/5 transition-colors text-left group">
                    <div className="bg-purple-500/20 p-3 rounded-lg text-purple-400 mr-4 group-hover:bg-purple-500/40 transition-colors">
                       <ScanFace className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="font-medium text-white">Face Match AI</p>
                       <p className="text-xs text-indigo-300/60">Selfie verification</p>
                    </div>
                 </button>

                 <button className="w-full flex items-center p-4 rounded-xl bg-black/20 border border-indigo-500/20 hover:bg-white/5 transition-colors text-left group">
                    <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-400 mr-4 group-hover:bg-emerald-500/40 transition-colors">
                       <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="font-medium text-white">NFC Tap</p>
                       <p className="text-xs text-indigo-300/60">Tap your employee card</p>
                    </div>
                 </button>
              </div>

              <div className="md:col-span-2 space-y-6">
                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 gap-6">
                   <div className="bg-indigo-900/20 border border-indigo-400/10 p-5 rounded-2xl flex items-center gap-6">
                     <div className="bg-indigo-500/20 p-4 rounded-2xl text-indigo-400">
                        <CalendarDays className="w-8 h-8" />
                     </div>
                     <div>
                       <p className="text-sm text-indigo-300/60 mb-1">សរុប (Total Staff)</p>
                       <h3 className="text-3xl font-bold">១៥៤ <span className="text-lg font-light opacity-50">នាក់</span></h3>
                     </div>
                   </div>
                   <div className="bg-indigo-900/20 border border-indigo-400/10 p-5 rounded-2xl flex items-center gap-6">
                     <div className="bg-emerald-500/20 p-4 rounded-2xl text-emerald-400">
                        <CheckCircle2 className="w-8 h-8" />
                     </div>
                     <div>
                       <p className="text-sm text-indigo-300/60 mb-1">មកដល់ (Checked In)</p>
                       <h3 className="text-3xl font-bold text-emerald-400">១៤២ <span className="text-lg font-light opacity-50">នាក់</span></h3>
                     </div>
                   </div>
                 </div>

                 {/* Main Table Section */}
                 <div className="bg-black/20 border border-indigo-400/10 rounded-2xl overflow-hidden flex flex-col">
                   <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                     <h2 className="font-semibold text-white">កំណត់ត្រាវត្តមានថ្មីៗ (Recent Logs)</h2>
                     <div className="flex gap-2">
                       <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs rounded-md border border-white/10 transition-colors">Filter</button>
                       <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs text-white rounded-md transition-colors shadow-lg shadow-indigo-500/20">Download CSV</button>
                     </div>
                   </div>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead className="bg-indigo-500/5 text-xs text-indigo-300/60 uppercase">
                         <tr>
                           <th className="px-6 py-4 font-medium tracking-wider">ឈ្មោះបុគ្គលិក (Staff Name)</th>
                           <th className="px-6 py-4 font-medium tracking-wider">ពេលវេលា (Time)</th>
                           <th className="px-6 py-4 font-medium tracking-wider">វិធីសាស្ត្រ (Method)</th>
                           <th className="px-6 py-4 font-medium tracking-wider">ទីតាំង (Location)</th>
                           <th className="px-6 py-4 font-medium tracking-wider">សុពលភាព (Status)</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5 text-sm">
                         {logs.map((log, i) => (
                           <tr key={i} className="hover:bg-white/5 transition-colors">
                             <td className="px-6 py-4 flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-indigo-200/20 flex items-center justify-center text-[10px] font-bold text-indigo-300">{log.name.substring(0, 1)}</div>
                               <div>
                                 <p className="font-medium text-white">{log.name}</p>
                                 <p className="text-[10px] text-indigo-300/40">ID: {log.id}</p>
                               </div>
                             </td>
                             <td className="px-6 py-4">{log.time}</td>
                             <td className="px-6 py-4">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-200">{log.method}</span>
                             </td>
                             <td className="px-6 py-4 text-xs text-indigo-300/60 flex items-center gap-1">
                               <MapPin className="w-3 h-3" />
                               Inside Geofence
                             </td>
                             <td className="px-6 py-4 font-mono">
                               <span className={log.status === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}>{log.status}</span>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                   <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-indigo-300/40">
                     <span>Showing {logs.length} of 142 records today</span>
                     <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-white/5 rounded text-indigo-300/60 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                        <span className="w-6 h-6 flex items-center justify-center bg-indigo-600 rounded text-white font-medium">1</span>
                        <button className="w-6 h-6 flex items-center justify-center hover:bg-white/5 rounded text-indigo-300/60 transition-colors">2</button>
                        <button className="p-1 hover:bg-white/5 rounded text-indigo-300/60 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          ) : (
            <LeaveManagement />
          )}
        </div>
      </main>
    </div>
  );
}

function LeaveManagement() {
  const [role, setRole] = useState<'employee' | 'manager'>('employee');
  const [leaveRequests, setLeaveRequests] = useState<any[]>([
    { id: 1, name: 'ចាន់ តុលា', type: 'Annual Leave', start: '2024-04-20', end: '2024-04-22', reason: 'Family trip', status: 'PENDING' },
    { id: 2, name: 'សុខ វិសាល', type: 'Sick Leave', start: '2024-04-18', end: '2024-04-18', reason: 'Fever', status: 'APPROVED' },
    { id: 3, name: 'គង់ ស្រីនី', type: 'Unpaid Leave', start: '2024-04-25', end: '2024-04-26', reason: 'Personal matters', status: 'REJECTED' }
  ]);
  
  const [form, setForm] = useState({ type: 'Annual Leave', start: '', end: '', reason: '' });

  const submitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start || !form.end || !form.reason) return;
    setLeaveRequests([{
      id: Date.now(),
      name: 'សុខ វិសាល', // Mock current user
      type: form.type,
      start: form.start,
      end: form.end,
      reason: form.reason,
      status: 'PENDING'
    }, ...leaveRequests]);
    setForm({ type: 'Annual Leave', start: '', end: '', reason: '' });
  };

  const handleAction = (id: number, action: 'APPROVED' | 'REJECTED') => {
    setLeaveRequests(leaveRequests.map(r => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Role Toggle for demo purposes */}
      <div className="lg:col-span-3 flex justify-end">
        <div className="bg-black/20 p-1 rounded-lg border border-indigo-500/20 flex text-sm">
          <button onClick={() => setRole('employee')} className={`px-4 py-1.5 rounded-md transition-colors ${role === 'employee' ? 'bg-indigo-600 text-white' : 'text-indigo-300/60 hover:text-white'}`}>Employee View</button>
          <button onClick={() => setRole('manager')} className={`px-4 py-1.5 rounded-md transition-colors ${role === 'manager' ? 'bg-indigo-600 text-white' : 'text-indigo-300/60 hover:text-white'}`}>Manager View <Bell className="w-3 h-3 inline ml-1"/></button>
        </div>
      </div>

      {role === 'employee' && (
        <div className="lg:col-span-1 bg-indigo-900/20 border border-indigo-400/10 p-6 rounded-2xl h-fit">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-400" />
            ដាក់ច្បាប់ឈប់សម្រាក (Request Leave)
          </h2>
          <form onSubmit={submitLeave} className="space-y-4">
            <div>
              <label className="block text-xs text-indigo-300/60 mb-1">ប្រភេទច្បាប់ (Leave Type)</label>
              <select 
                value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="w-full bg-black/20 border border-indigo-500/20 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 form-select"
              >
                <option value="Annual Leave" className="bg-[#1a1642]">Annual Leave (ច្បាប់ប្រចាំឆ្នាំ)</option>
                <option value="Sick Leave" className="bg-[#1a1642]">Sick Leave (ច្បាប់ឈឺ)</option>
                <option value="Unpaid Leave" className="bg-[#1a1642]">Unpaid Leave (ឈប់អត់ប្រាក់ខែ)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-indigo-300/60 mb-1">ចាប់ពីថ្ងៃបរិច្ឆេទ (Start)</label>
                <input 
                  type="date" value={form.start} onChange={e => setForm({...form, start: e.target.value})}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500" 
                  style={{colorScheme: 'dark'}}
                />
              </div>
              <div>
                <label className="block text-xs text-indigo-300/60 mb-1">ដល់ថ្ងៃបរិច្ឆេទ (End)</label>
                <input 
                  type="date" value={form.end} onChange={e => setForm({...form, end: e.target.value})}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  style={{colorScheme: 'dark'}}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-indigo-300/60 mb-1">មូលហេតុ (Reason)</label>
              <textarea 
                value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
                className="w-full bg-black/20 border border-indigo-500/20 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"
                placeholder="Enter details here..."
              ></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
              បញ្ជូនសំណើ (Submit Request)
            </button>
          </form>
        </div>
      )}

      <div className={`bg-black/20 border border-indigo-400/10 rounded-2xl overflow-hidden flex flex-col ${role === 'employee' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
        <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold text-white">{role === 'manager' ? 'ការស្នើសុំកំពុងរង់ចាំ (Pending Requests)' : 'ប្រវត្តិច្បាប់ឈប់ (Leave History)'}</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs rounded-md border border-white/10 transition-colors">Filter</button>
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-indigo-500/5 text-xs text-indigo-300/60 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">បុគ្គលិក (Staff)</th>
                <th className="px-6 py-4 font-medium tracking-wider">ប្រភេទ (Type)</th>
                <th className="px-6 py-4 font-medium tracking-wider">កាលបរិច្ឆេទ (Dates)</th>
                <th className="px-6 py-4 font-medium tracking-wider">មូលហេតុ (Reason)</th>
                <th className="px-6 py-4 font-medium tracking-wider min-w-[120px]">ស្ថានភាព (Status)</th>
                {role === 'manager' && <th className="px-6 py-4 font-medium tracking-wider text-right">សកម្មភាព (Actions)</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {(role === 'manager' ? leaveRequests.filter(r => r.status === 'PENDING') : leaveRequests).map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{req.name}</p>
                  </td>
                  <td className="px-6 py-4 text-indigo-200">{req.type}</td>
                  <td className="px-6 py-4 font-mono text-xs">{req.start} to {req.end}</td>
                  <td className="px-6 py-4 text-xs text-indigo-300/80">{req.reason}</td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {req.status === 'PENDING' && <span className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded">PENDING</span>}
                    {req.status === 'APPROVED' && <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">APPROVED</span>}
                    {req.status === 'REJECTED' && <span className="text-rose-400 bg-rose-400/10 px-2 py-1 rounded">REJECTED</span>}
                  </td>
                  {role === 'manager' && (
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                       <button onClick={() => handleAction(req.id, 'APPROVED')} className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors" title="Approve">
                          <Check className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleAction(req.id, 'REJECTED')} className="p-1.5 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/30 transition-colors" title="Reject">
                          <X className="w-4 h-4" />
                       </button>
                    </td>
                  )}
                </tr>
              ))}
              {role === 'manager' && leaveRequests.filter(r => r.status === 'PENDING').length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-indigo-300/60 text-sm">
                      គ្មានសំណើកំពុងរង់ចាំទេ (No pending requests)
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
