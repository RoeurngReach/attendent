"use client";

import { useState, useEffect } from 'react';
import { Settings, Users, QrCode, MessageCircle, Lock, LayoutDashboard, Plus, Trash2, Edit2, CheckCircle2, Save, MapPin, CalendarDays, DollarSign, Download, Send, Clock, Upload, IdCard, Printer, Fingerprint, ScanLine } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard'|'leave'|'employees'|'qr'|'telegram'|'system'|'attendance'|'payroll'|'timesheet'|'cards'>('dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
       const urlParams = new URLSearchParams(window.location.search);
       const org = urlParams.get('org');
       if (org) {
         document.cookie = `org=${org}; path=/; max-age=31536000`;
       }
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('adminToken', 'true');
        setIsAuthenticated(true);
      } else {
        alert('Invalid password');
      }
    } catch(err) {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#11122a] flex items-center justify-center p-4 font-sans text-slate-100">
        <form onSubmit={handleLogin} className="bg-[#1a1b3b] p-8 rounded-3xl shadow-2xl border border-indigo-500/20 max-w-sm w-full flex flex-col gap-6">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-indigo-200/70 text-sm">Sign in to access SecureAttend</p>
          </div>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-[#11122a] border border-indigo-500/30 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md">
            Login
          </button>
        </form>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', khmer: 'ផ្ទាំងគ្រប់គ្រង', english: '(Dashboard)', icon: LayoutDashboard },
    { id: 'leave', khmer: 'ច្បាប់ឈប់សម្រាក', english: '(Leave)', icon: CalendarDays },
    { id: 'employees', khmer: 'បុគ្គលិក', english: '(Employees)', icon: Users },
    { id: 'attendance', khmer: 'វត្តមាន', english: '(Attendance)', icon: Clock },
    { id: 'payroll', khmer: 'ប្រាក់បៀវត្សរ៍', english: '(Payroll)', icon: DollarSign },
    { id: 'system', khmer: 'ការកំណត់', english: '(Settings)', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#11122a] text-slate-200 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-[280px] bg-[#151630] border-r border-[#26274d] flex flex-col shrink-0 rounded-tr-3xl rounded-br-3xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-1">
             <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
               <Fingerprint className="w-6 h-6" />
             </div>
             <h1 className="font-bold text-2xl text-white tracking-tight">SecureAttend</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${
                  isActive 
                  ? 'bg-[#2a2b5e] text-indigo-300 shadow-sm border-l-4 border-indigo-500 rounded-l-none -ml-4 pl-8' 
                  : 'text-slate-400 hover:bg-[#1a1b3b] hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white">{item.khmer}</span>
                  <span className="text-[10px] opacity-70">{item.english}</span>
                </div>
              </button>
            )
          })}
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="bg-[#1a1b3b] rounded-2xl p-4 border border-[#2a2b5e]">
            <p className="text-[10px] text-indigo-300/70 mb-1">សាលារៀនដែលបានជ្រើសរើស (Current Tenant)</p>
            <p className="text-sm font-bold text-white leading-tight">Northbridge International<br/>School</p>
          </div>
          <button onClick={handleLogout} className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-sm font-bold transition-colors">
            <Lock className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:px-8 md:py-6 overflow-y-auto">
         <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'employees' && <EmployeesTab />}
            {activeTab === 'attendance' && <AttendanceTab />}
            {activeTab === 'timesheet' && <TimesheetTab />}
            {activeTab === 'payroll' && <PayrollTab />}
            {activeTab === 'cards' && <CardsTab />}
            {activeTab === 'qr' && <QRTab />}
            {activeTab === 'telegram' && <TelegramTab />}
            {activeTab === 'system' && <SystemTab />}
         </div>
      </main>
    </div>
  );
}

function DashboardTab() {
  const [logs, setLogs] = useState<any[]>([
    { id: 1, name: "ចាន់ តុលា", engName: "Chan Tola", eid: "SC-042", time: "07:52 AM", method: "AI FACE MATCH", location: "Inside Geofence", status: "VERIFIED" },
    { id: 2, name: "លឹម សុគន្ធ", engName: "Lim Sokun", eid: "SC-089", time: "08:15 AM", method: "NFC SCAN", location: "Inside Geofence", status: "LATE" },
    { id: 3, name: "គង់ ស្រីនី", engName: "Kong Sreyny", eid: "SC-102", time: "07:45 AM", method: "QR CODE", location: "Inside Geofence", status: "VERIFIED" },
  ]);

  return (
    <div className="flex flex-col gap-8 pb-10">
       <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#2a2b5e] pb-6">
         <div>
            <h1 className="text-3xl font-bold text-white mb-1">របាយការណ៍សង្ខេប</h1>
            <p className="text-slate-400 text-sm">ថ្ងៃព្រហស្បតិ៍, ១៨ មេសា ២០២៤ (Thursday, April 18, 2024)</p>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-emerald-400 text-xs font-bold tracking-widest">LIVE SYNC</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="text-right">
                 <div className="font-bold text-white text-sm">សុខ វិសាល (Visal Sok)</div>
                 <div className="text-[10px] text-indigo-400 tracking-wider">ADMINISTRATOR</div>
               </div>
               <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                 <Users className="w-5 h-5 text-indigo-300" />
               </div>
            </div>
         </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-4">
             <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
               <Clock className="w-5 h-5 text-indigo-400" /> ជម្រើសបញ្ចូលវត្តមាន
             </h2>
             
             <div className="bg-[#1a1b3b] border border-[#2a2b5e] p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-500/50 cursor-pointer transition-colors">
               <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                 <MapPin className="w-6 h-6" />
               </div>
               <div>
                 <div className="font-bold text-white">GPS Check-In</div>
                 <div className="text-xs text-slate-400">Check in with location</div>
               </div>
             </div>

             <div className="bg-[#1a1b3b] border border-[#2a2b5e] p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-500/50 cursor-pointer transition-colors">
               <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                 <ScanLine className="w-6 h-6" />
               </div>
               <div>
                 <div className="font-bold text-white">Face Match AI</div>
                 <div className="text-xs text-slate-400">Selfie verification</div>
               </div>
             </div>

             <div className="bg-[#1a1b3b] border border-[#2a2b5e] p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-500/50 cursor-pointer transition-colors">
               <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                 <Fingerprint className="w-6 h-6" />
               </div>
               <div>
                 <div className="font-bold text-white">NFC Tap</div>
                 <div className="text-xs text-slate-400">Tap your employee card</div>
               </div>
             </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1e1f42] rounded-3xl p-6 border border-[#2a2b5e] flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#2a2b5e] flex items-center justify-center text-indigo-300">
                    <CalendarDays className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold mb-1">សរុប (Total Staff)</div>
                    <div className="text-3xl font-bold text-white">១៥៥ <span className="text-sm font-normal text-slate-400">នាក់</span></div>
                  </div>
                </div>
                <div className="bg-[#1e1f42] rounded-3xl p-6 border border-[#2a2b5e] flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold mb-1">មកដល់ (Checked In)</div>
                    <div className="text-3xl font-bold text-teal-400">១៤២ <span className="text-sm font-normal text-slate-400">នាក់</span></div>
                  </div>
                </div>
             </div>

             <div className="bg-[#1a1b3b] rounded-3xl border border-[#2a2b5e] overflow-hidden">
                <div className="p-5 border-b border-[#2a2b5e] flex items-center justify-between bg-[#1e1f42]">
                   <h3 className="font-bold text-white">កំណត់ត្រាវត្តមានថ្មីៗ (Recent Logs)</h3>
                   <div className="flex gap-2">
                     <button className="px-4 py-2 border border-[#2a2b5e] rounded-xl text-xs font-bold text-slate-300 hover:bg-[#2a2b5e] transition">Filter</button>
                     <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white shadow-sm transition">Download CSV</button>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#151630]">
                         <tr>
                            <th className="px-5 py-4 text-xs font-bold tracking-wider text-slate-400">ឈ្មោះបុគ្គលិក (STAFF NAME)</th>
                            <th className="px-5 py-4 text-xs font-bold tracking-wider text-slate-400">ពេលវេលា (TIME)</th>
                            <th className="px-5 py-4 text-xs font-bold tracking-wider text-slate-400">វិធីសាស្ត្រ (METHOD)</th>
                            <th className="px-5 py-4 text-xs font-bold tracking-wider text-slate-400">ទីតាំង (LOCATION)</th>
                            <th className="px-5 py-4 text-xs font-bold tracking-wider text-slate-400">ស្ថានភាព (STATUS)</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2a2b5e]">
                         {logs.map((log) => (
                           <tr key={log.id} className="hover:bg-[#1e1f42] transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[#2a2b5e] text-indigo-300 flex items-center justify-center font-bold text-xs uppercase">
                                    {log.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white">{log.name}</div>
                                    <div className="text-xs text-slate-400">({log.engName}) <br/><span className="text-indigo-400">ID: {log.eid}</span></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 font-mono font-medium text-white">{log.time}</td>
                              <td className="px-5 py-4">
                                <span className={`text-[10px] px-2 py-1 rounded font-bold tracking-wider ${log.method.includes('FACE') ? 'bg-indigo-500/20 text-indigo-300' : log.method.includes('QR') ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-700 text-slate-300'}`}>
                                  {log.method}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-xs text-slate-400 flex items-center gap-1.5 pt-6">
                                <MapPin className="w-3.5 h-3.5" /> {log.location}
                              </td>
                              <td className="px-5 py-4">
                                <span className={`text-xs font-bold ${log.status === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  {log.status}
                                </span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}


function EmployeesTab() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEmp, setNewEmp] = useState({ code: '', name: '', department: '' });

  const fetchEmployees = async () => {
    setIsLoading(true);
    const res = await fetch('/api/admin/employees');
    const data = await res.json();
    if (data.employees) setEmployees(data.employees);
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const xlsx = await import('xlsx');
      const reader = new FileReader();
      reader.onload = async (evt) => {
         const bstr = evt.target?.result;
         const wb = xlsx.read(bstr, { type: 'binary' });
         const wsname = wb.SheetNames[0];
         const ws = wb.Sheets[wsname];
         const data = xlsx.utils.sheet_to_json(ws);
         
         const newEmployees = data.map((row: any) => ({
            code: row['Code'] || row['code'],
            name: row['Name'] || row['name'],
            department: row['Department'] || row['department'],
            role: row['Role'] || row['role'] || 'employee',
            payrollType: row['PayrollType'] || row['payrollType'] || 'fixed',
            rate: row['Rate'] || row['rate'] || 0
         }));

         await fetch('/api/admin/employees/bulk', { 
           method: 'POST', 
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ employees: newEmployees }) 
         });
         fetchEmployees();
         alert('Import successful!');
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      alert('Failed to parse excel file.');
    }
  };

  const downloadTemplate = async () => {
    const xlsx = await import('xlsx');
    const ws = xlsx.utils.json_to_sheet([{ Code: 'SC-100', Name: 'John Doe', Department: 'IT', Role: 'employee', PayrollType: 'hourly', Rate: 5 }]);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Employees");
    xlsx.writeFile(wb, "employee_template.xlsx");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployees();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/employees', {
      method: 'POST',
      body: JSON.stringify(newEmp)
    });
    setNewEmp({ code: '', name: '', department: '' });
    fetchEmployees();
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/admin/employees?code=${code}`, { method: 'DELETE' });
    fetchEmployees();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
           <Plus className="w-5 h-5 text-indigo-500" /> Add Employee
        </h2>
        <div className="flex gap-4 mb-4">
          <label className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 cursor-pointer transition-colors shadow-sm">
             <Upload className="w-4 h-4" /> Import Excel
             <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
          </label>
          <button type="button" onClick={downloadTemplate} className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-sm border border-slate-200">
             <Download className="w-4 h-4" /> Download Template
          </button>
        </div>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <input className="flex-1 p-3 bg-slate-50 border rounded-xl" placeholder="Code (e.g. SC-001)" value={newEmp.code} onChange={e=>setNewEmp({...newEmp, code: e.target.value})} required />
          <input className="flex-1 p-3 bg-slate-50 border rounded-xl" placeholder="Name" value={newEmp.name} onChange={e=>setNewEmp({...newEmp, name: e.target.value})} required />
          <input className="flex-1 p-3 bg-slate-50 border rounded-xl" placeholder="Department" value={newEmp.department} onChange={e=>setNewEmp({...newEmp, department: e.target.value})} required />
          <button type="submit" className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700">Add</button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <h2 className="text-xl font-bold text-slate-800">Employee Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-sm text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Dept</th>
                <th className="p-4 font-medium">Telegram</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => (
                <tr key={emp.code} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono text-sm text-slate-600">{emp.code}</td>
                  <td className="p-4 font-medium text-slate-900">{emp.name}</td>
                  <td className="p-4 text-slate-600 text-sm">{emp.department}</td>
                  <td className="p-4 text-slate-400 text-sm">
                    {emp.telegram_id ? (
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-semibold">Linked</span>
                    ) : 'None'}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(emp.code)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                   <td colSpan={5} className="p-8 text-center text-slate-500">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CardsTab() {
  const [cards, setCards] = useState<any[]>([]);
  const [bindingCode, setBindingCode] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/admin/cards');
      const data = await res.json();
      setCards(data.cards || []);
    } catch(err) {}
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCards();
  }, []);

  const bindNfc = async (code: string) => {
    let uid = '';
    
    // Attempt Web NFC first
    if ('NDEFReader' in window) {
      try {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        setMessage(`Tap NFC for ${code}...`);
        
        return new Promise<void>((resolve) => {
           ndef.onreading = async (event: any) => {
             uid = event.serialNumber;
             setMessage('');
             await submitNfc(code, uid);
             resolve();
           };
           ndef.onreadingerror = () => {
             setMessage('NFC read error.');
             resolve();
           };
        });
      } catch (e: any) {
         setMessage('NFC scan failed, falling back to prompt: ' + e.message);
      }
    }
    
    // Fallback to prompt for USB readers (which act as keyboards)
    if (!uid) {
      uid = prompt(`Enter or scan NFC UID for ${code}:`) || '';
      if (uid) {
         await submitNfc(code, uid);
      }
    }
  };

  const submitNfc = async (code: string, nfc_uid: string) => {
    try {
      await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bind_nfc', code, nfc_uid })
      });
      fetchCards();
    } catch(e) {}
  };

  const printCards = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200 print:hidden">
         <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <IdCard className="w-5 h-5 text-indigo-500" /> Employee ID Cards
         </h2>
         <div className="flex items-center gap-4">
            {message && <div className="text-sm font-bold text-amber-600 animate-pulse">{message}</div>}
            <button onClick={printCards} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:bg-indigo-700 transition-colors">
               <Printer className="w-4 h-4" /> Print All Cards
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {cards.map(card => (
            <div key={card.code} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center gap-4 text-center print:break-inside-avoid print:shadow-none print:border-2 print:border-black">
               {/* ID Card Design */}
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-xl overflow-hidden border-4 border-white shadow-sm">
                 <Users className="w-10 h-10 text-slate-300" />
               </div>
               
               <div>
                 <h3 className="text-lg font-bold text-slate-800">{card.name}</h3>
                 <div className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block mt-1">{card.code}</div>
                 <div className="text-sm text-slate-500 mt-1">{card.department}</div>
               </div>

               <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                 <QRCode value={`SECATT-EMP:${card.code}:${card.token}`} size={120} />
               </div>

               <div className="text-xs text-slate-400 mt-2 font-mono">
                 {card.nfc_uid ? `NFC: ${card.nfc_uid}` : 'No NFC assigned'}
               </div>

               <button 
                 onClick={() => bindNfc(card.code)} 
                 className="mt-2 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2 rounded-xl text-sm transition-colors print:hidden"
               >
                 {card.nfc_uid ? 'Update NFC' : 'Bind NFC'}
               </button>
            </div>
         ))}
      </div>
    </div>
  );
}

function QRTab() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
         <QrCode className="w-5 h-5 text-indigo-500" /> External QR Management
      </h2>
      <p className="text-slate-500 mb-6">Manage the Office QR code for direct scan check-ins.</p>
      {/* We can embed the components/AdminQR but it's a modal format, let's just use it conceptually or build a flat one. */}
      {/* Here we will just tell the user to use the main dashboard QR generator for now, or we can copy/paste the generator code here. */}
      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
         <QrCode className="w-8 h-8 text-slate-400" />
         <div>
            <h3 className="font-semibold text-slate-700">Office QR</h3>
            <p className="text-sm text-slate-500">You can use your main dashboard quick action to generate the daily QR code.</p>
         </div>
      </div>
    </div>
  );
}

function TelegramTab() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
         <MessageCircle className="w-5 h-5 text-indigo-500" /> Telegram Integration
      </h2>
      <p className="text-slate-500 mb-6">Configure the automated Bot notifications.</p>
      
      <div className="space-y-4 max-w-xl">
         <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-semibold text-sm mb-1 text-slate-700">Bot Token</h3>
            <p className="font-mono text-xs text-slate-500 break-all bg-slate-200/50 p-2 rounded">
               {process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || 'Not configured in environment'}
            </p>
         </div>
         <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-semibold text-sm mb-1 text-slate-700">Admin Group ID</h3>
            <p className="font-mono text-xs text-slate-500 bg-slate-200/50 p-2 rounded">
               {process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_GROUP_ID || 'Not configured in environment'}
            </p>
         </div>
         <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-800">
            The webhook is statically pointed to <strong>/api/bot</strong>.
         </div>
      </div>
    </div>
  );
}

function SystemTab() {
  const [config, setConfig] = useState({ lat: 0, lng: 0, radius: 200 });
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch('/api/admin/config').then(res => res.json()).then(data => {
      setConfig({ lat: data.officeLocation.lat, lng: data.officeLocation.lng, radius: data.allowedRadius });
    });
  }, []);

  const handleSave = async () => {
    await fetch('/api/admin/config', {
      method: 'POST',
      body: JSON.stringify(config)
    });
    setToast('Settings saved successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  const getGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setConfig({ ...config, lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => alert('Error getting location: ' + err.message)
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
         <Settings className="w-5 h-5 text-indigo-500" /> System Settings
      </h2>
      
      <div className="max-w-md space-y-6">
        <div>
           <label className="block text-sm font-bold text-slate-700 mb-2">Office Location (Lat, Lng)</label>
           <div className="flex gap-3">
              <input 
                type="number" step="any"
                value={config.lat} 
                onChange={e=>setConfig({...config, lat: parseFloat(e.target.value)})} 
                className="w-full bg-slate-50 border p-3 rounded-xl"
              />
              <input 
                type="number" step="any"
                value={config.lng} 
                onChange={e=>setConfig({...config, lng: parseFloat(e.target.value)})} 
                className="w-full bg-slate-50 border p-3 rounded-xl"
              />
           </div>
           <button onClick={getGPS} className="mt-3 flex items-center gap-2 text-sm text-indigo-600 font-medium hover:underline">
              <MapPin className="w-4 h-4" /> Use Current GPS
           </button>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-2">Allowed Check-in Radius (meters)</label>
           <input 
              type="number" 
              value={config.radius} 
              onChange={e=>setConfig({...config, radius: parseInt(e.target.value)})} 
              className="w-full bg-slate-50 border p-3 rounded-xl"
            />
        </div>

        <button onClick={handleSave} className="flex items-center gap-2 bg-slate-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-900 transition-colors">
          <Save className="w-4 h-4" /> Save Configuration
        </button>

        {toast && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 font-medium">
             <CheckCircle2 className="w-5 h-5" /> {toast}
          </div>
        )}
      </div>
    </div>
  );
}

function AttendanceTab() {
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [manualUser, setManualUser] = useState('');
  const [manualAction, setManualAction] = useState('IN');
  const [manualStatus, setManualStatus] = useState('');

  const fetchLogs = () => {
    fetch(`/api/admin/attendance?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(d => {
        setData(d.data || []);
        setSummary(d.summary || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetch('/api/admin/employees').then(r=>r.json()).then(d=>setEmployees(d.employees||[]));
  }, []);

  const handleManualSubmit = async () => {
    if (!manualUser) {
       setManualStatus('Select an employee.');
       return;
    }
    setManualStatus('Submitting...');
    try {
      const res = await fetch('/api/admin/attendance/manual', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ userId: manualUser, action: manualAction })
      });
      const resData = await res.json();
      if (resData.success) {
         setManualStatus(`Success: Recorded ${manualAction} for ${manualUser}`);
         setManualUser('');
         fetchLogs();
      } else {
         setManualStatus(`Error: ${resData.error}`);
      }
    } catch(err: any) {
      setManualStatus(`Error: ${err.message}`);
    }
  };

  const exportCsv = () => {
    if (!summary.length) return;
    const headers = ['Employee ID', 'Name', 'Total Days', 'Late Days', 'Work Hours'];
    const rows = summary.map(s => [s.userId, `"${s.name}"`, s.totalDays, s.lateDays, s.workHours]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_summary_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
           <CalendarDays className="w-5 h-5 text-indigo-500" /> Monthly Attendance
        </h2>
        <button onClick={exportCsv} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm transition-colors">
           <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6 mb-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
           <Edit2 className="w-4 h-4 text-slate-400" /> Manual / Proxy Record
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
           <div className="flex-1">
             <select 
               value={manualUser}
               onChange={(e) => setManualUser(e.target.value)}
               className="w-full bg-slate-50 border p-3 rounded-xl disabled:opacity-50"
             >
               <option value="">-- Select Employee --</option>
               {employees.map(e => <option key={e.code} value={e.code}>{e.name} ({e.code})</option>)}
             </select>
           </div>
           <div className="w-full sm:w-32">
             <select 
               value={manualAction}
               onChange={(e) => setManualAction(e.target.value)}
               className="w-full bg-slate-50 border p-3 rounded-xl"
             >
               <option value="IN">IN</option>
               <option value="OUT">OUT</option>
             </select>
           </div>
           <button 
             onClick={handleManualSubmit}
             className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition-colors"
           >
             Record
           </button>
        </div>
        {manualStatus && (
           <div className={`mt-3 text-sm font-medium ${manualStatus.includes('Error') ? 'text-rose-600' : 'text-emerald-600'}`}>
             {manualStatus}
           </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 bg-slate-50">Summary</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4 text-center">Days Present</th>
                <th className="p-4 text-center">Late Days</th>
                <th className="p-4 text-center">Est. Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.map(s => (
                <tr key={s.userId} className="hover:bg-slate-50 text-sm">
                  <td className="p-4"><div className="font-medium text-slate-900">{s.name}</div><div className="text-slate-500 text-xs font-mono">{s.userId}</div></td>
                  <td className="p-4 text-center font-bold text-slate-700">{s.totalDays}</td>
                  <td className="p-4 text-center font-bold text-rose-600">{s.lateDays}</td>
                  <td className="p-4 text-center text-slate-600 font-medium">{s.workHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 bg-slate-50">Raw Logs (Paginated)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4">Time</th>
                <th className="p-4">Employee</th>
                <th className="p-4">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 text-sm">
                  <td className="p-4 text-slate-600">{new Date(d.isoTime).toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })}</td>
                  <td className="p-4"><div className="font-medium text-slate-900">{d.name || 'Unknown'}</div><div className="text-slate-500 text-xs font-mono">{d.userId}</div></td>
                  <td className="p-4 text-slate-600">{d.method}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                   <td colSpan={3} className="p-8 text-center text-slate-500">No attendance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-4 flex items-center justify-between bg-slate-50 border-t border-slate-100 text-sm text-slate-500">
             <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-100 disabled:opacity-50 font-medium transition-colors">Previous</button>
             <span className="font-semibold text-slate-700">Page {page}</span>
             <button disabled={data.length < limit} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-100 disabled:opacity-50 font-medium transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimesheetTab() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [timesheets, setTimesheets] = useState<any>({});
  const [schedules, setSchedules] = useState<any>({});
  const [selectedEmp, setSelectedEmp] = useState('');
  const [logDate, setLogDate] = useState('');
  const [logHours, setLogHours] = useState('');

  const fetchData = () => {
    fetch('/api/admin/timesheet')
      .then(res => res.json())
      .then(d => {
        setTimesheets(d.timesheets || {});
        setSchedules(d.schedules || {});
      });
  };

  useEffect(() => {
    fetch('/api/admin/employees').then(r=>r.json()).then(d=>setEmployees(d.employees||[]));
    fetchData();
  }, []);

  const saveLog = async () => {
    if(!selectedEmp || !logDate || !logHours) return;
    await fetch('/api/admin/timesheet', {
      method:'POST', body:JSON.stringify({ action: 'log_hours', userId: selectedEmp, date: logDate, hours: logHours })
    });
    fetchData();
    alert('Hours logged!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
           <Clock className="w-5 h-5 text-indigo-500" /> Timesheet Entry
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          <select className="flex-1 p-3 bg-slate-50 border rounded-xl" value={selectedEmp} onChange={e=>setSelectedEmp(e.target.value)}>
             <option value="">Select Employee...</option>
             {employees.map(e => <option key={e.code} value={e.code}>{e.name} ({e.code})</option>)}
          </select>
          <input type="date" className="p-3 bg-slate-50 border rounded-xl" value={logDate} onChange={e=>setLogDate(e.target.value)} />
          <input type="number" placeholder="Hours" className="w-32 p-3 bg-slate-50 border rounded-xl" value={logHours} onChange={e=>setLogHours(e.target.value)} />
          <button onClick={saveLog} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700">Save</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <h2 className="text-xl font-bold text-slate-800">Timesheets Overview</h2>
        </div>
        <div className="p-4 overflow-x-auto text-sm">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Total Logged Hours</th>
                  <th className="p-4">Recent Entries (By Date)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => {
                  const entries = timesheets[emp.code] || {};
                  const total = Object.values(entries).reduce((sum: any, h: any) => sum + h, 0) as number;
                  if(total === 0) return null;
                  return (
                    <tr key={emp.code} className="hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-900">{emp.name}</td>
                      <td className="p-4 font-bold text-indigo-600">{total}h</td>
                      <td className="p-4 text-slate-500 space-x-2">
                        {Object.entries(entries).map(([d, h]) => (
                           <span key={d} className="inline-block bg-slate-100 px-2 py-1 rounded-md text-xs">{d}: <strong className="text-slate-700">{h as any}h</strong></span>
                        ))}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}

function PayrollTab() {
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayroll = () => {
    fetch(`/api/admin/payroll`)
      .then(res => res.json())
      .then(d => {
        setPayroll(d.payroll || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const sendPayslip = async (userId: string, amount: number) => {
    if(!confirm("Send payslip via Telegram?")) return;
    
    try {
      const res = await fetch('/api/admin/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_payslip', userId, amount })
      });
      const data = await res.json();
      if (data.success) {
        alert('Payslip sent via Telegram!');
      } else {
        alert(data.error || 'Failed to send payslip.');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
         <DollarSign className="w-5 h-5 text-emerald-600" /> Payroll Management
      </h2>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 bg-slate-50">
           Current Period Processing
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4">Type/Rate</th>
                <th className="p-4 text-right">Base</th>
                <th className="p-4 text-right text-rose-500">Deduct</th>
                <th className="p-4 text-right text-emerald-500">Adjust</th>
                <th className="p-4 text-right font-bold text-slate-800">Net Pay</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {payroll.map(p => (
                <tr key={p.userId} className="hover:bg-slate-50">
                  <td className="p-4"><div className="font-medium text-slate-900">{p.name || 'Unknown'}</div><div className="text-slate-500 text-xs font-mono">{p.userId}</div></td>
                  <td className="p-4 text-slate-600">{p.payrollType === 'fixed' ? 'Fixed/mo' : 'Hourly'} <br/><span className="text-xs font-mono font-medium text-slate-800">${p.rate}</span></td>
                  <td className="p-4 text-right text-slate-600 font-medium">${p.baseSalary.toFixed(2)}</td>
                  <td className="p-4 text-right text-rose-600 font-medium">-${p.deductions.toFixed(2)}</td>
                  <td className="p-4 text-right text-emerald-600 font-medium">+${p.adjustments.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-slate-800 text-base">${p.netPay.toFixed(2)}</td>
                  <td className="p-4 text-right">
                     <button
                        onClick={() => sendPayslip(p.userId, p.netPay)}
                        className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                     >
                        <Send className="w-3 h-3" /> Payslip
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
