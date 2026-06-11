"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navigation, MapPin } from "lucide-react";

// Dynamically import the map to avoid SSR issues with Leaflet referring to `window`
const MapComponent = dynamic(() => import("./MapComponent"), { 
    ssr: false, 
    loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl text-slate-400">Loading Map...</div>
});

const FaceCheckIn = dynamic(() => import("./FaceCheckIn"), { 
    ssr: false
});

// Haversine formula to calculate distance
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // Radius of the earth in m
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in m
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}

export default function GPSAttendance({ currentUser }: { currentUser?: any }) {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [status, setStatus] = useState<"checking" | "allowed" | "denied" | "error" | "idle">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showFaceCheckIn, setShowFaceCheckIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<{name: string, time: string} | null>(null);
  
  const [officeLocation, setOfficeLocation] = useState({ lat: 11.562108, lng: 104.888535 });
  const [allowedRadius, setAllowedRadius] = useState(200);
  const [methods, setMethods] = useState<any>({});

  const [substituteFor, setSubstituteFor] = useState("");
  const [employeeList, setEmployeeList] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/employees').then(res => res.json()).then(data => {
       if (data.employees) {
          setEmployeeList(data.employees.filter((e: any) => e.code !== currentUser?.code && e.active !== false));
       }
    }).catch(err => console.error('Failed to load employees:', err));

    fetch('/api/admin/config').then(res => res.json()).then(data => {
      setOfficeLocation(data.officeLocation);
      setAllowedRadius(data.allowedRadius);
      if (data.methods) setMethods(data.methods);
    }).catch(err => console.error('Failed to load config:', err));
  }, [currentUser]);

  const checkLocation = () => {
    setStatus("checking");
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        const dist = getDistanceFromLatLonInM(
          officeLocation.lat, officeLocation.lng,
          latitude, longitude
        );
        
        setDistance(dist);
        
        if (dist <= allowedRadius) {
          setStatus("allowed");
        } else {
          setStatus("denied");
        }
      },
      (err) => {
        setStatus("error");
        setErrorMessage(`Error: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (methods.gps === false && methods.manual === false) {
    return null;
  }

  const handleFaceSuccess = async (userId: string, name: string) => {
     setLastCheckIn({ name, time: new Date().toLocaleTimeString() });
     setShowFaceCheckIn(false);
     await fetch('/api/submit-checkin', {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser?.code, method: 'Face Match' })
     });
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 mb-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Verification Status */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                 <Navigation className="w-5 h-5" />
               </div>
               <div>
                 <h2 className="text-xl font-bold text-slate-800">GPS Attendance</h2>
                 <p className="text-sm text-slate-500">Verify your location to check in or out</p>
               </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Location Status</h3>
                  {lastCheckIn && (
                     <div className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                        Last Check-In: {lastCheckIn.time} ({lastCheckIn.name})
                     </div>
                  )}
               </div>
               
               {status === "checking" && (
                  <div className="flex items-center gap-3 text-slate-500">
                      <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Checking your location...</span>
                  </div>
               )}

               {status === "error" && (
                  <div className="text-red-500 bg-red-50 p-4 rounded-xl text-sm font-medium">
                    {errorMessage}
                  </div>
               )}

               {(status === "allowed" || status === "denied") && distance !== null && (
                 <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-slate-500">Distance from Office</span>
                      <span className="font-mono font-medium text-slate-800">{distance.toFixed(0)} meters</span>
                    </div>
                    
                    {status === "allowed" ? (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                         <MapPin className="w-5 h-5" />
                         <span className="font-medium">You are within the allowed office zone.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100">
                         <MapPin className="w-5 h-5" />
                         <span className="font-medium">You are too far from the office.</span>
                      </div>
                    )}
                 </div>
               )}
            </div>

             <div className="space-y-4 mt-auto">
                {status === "allowed" && employeeList.length > 0 && (
                   <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Substitute Check-In (Optional)</label>
                      <select 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                         value={substituteFor}
                         onChange={(e) => setSubstituteFor(e.target.value)}
                      >
                         <option value="">I am checking in for myself</option>
                         {employeeList.map(e => <option key={e.code} value={e.code}>Covering for {e.name}</option>)}
                      </select>
                   </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                   <button 
                      onClick={async () => {
                         setLastCheckIn({ name: currentUser?.name || 'Self', time: new Date().toLocaleTimeString() });
                         await fetch('/api/submit-checkin', {
                            method: 'POST',
                            body: JSON.stringify({ userId: currentUser?.code, method: 'GPS Manual', substituteFor: substituteFor || undefined })
                         });
                      }}
                      disabled={status !== "allowed"}
                      className={`py-4 rounded-xl font-bold transition-all shadow-sm ${
                        status === "allowed" 
                          ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20 hover:shadow-brand-500/30' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                   >
                      Check IN
                   </button>

                   <button 
                      onClick={async () => {
                         setLastCheckIn({ name: currentUser?.name || 'Self', time: new Date().toLocaleTimeString() });
                         await fetch('/api/submit-checkin', {
                            method: 'POST',
                            body: JSON.stringify({ userId: currentUser?.code, method: 'GPS Check Out', substituteFor: substituteFor || undefined })
                         });
                      }}
                      disabled={status !== "allowed"}
                      className={`py-4 rounded-xl font-bold transition-all shadow-sm ${
                        status === "allowed" 
                          ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-800/20' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                   >
                      Check OUT
                   </button>
                </div>
             </div>
          </div>

          {/* Map View */}
          <div className="flex-1 h-[400px] md:h-auto overflow-hidden rounded-2xl border-4 border-slate-50 shadow-inner bg-slate-100 relative min-h-[300px]">
             <MapComponent 
                officeLocation={officeLocation} 
                userLocation={userLocation} 
                allowedRadius={allowedRadius} 
             />
             <button 
               onClick={checkLocation}
               className="absolute bottom-4 right-4 z-[400] bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-brand-600 transition-colors"
               title="Refresh Location"
             >
               <Navigation className="w-5 h-5" />
             </button>
          </div>

        </div>
      </div>
      
      {showFaceCheckIn && (
         <FaceCheckIn 
           onBack={() => setShowFaceCheckIn(false)} 
           onSuccess={handleFaceSuccess} 
         />
      )}
      
      <div className="text-center mt-2 flex justify-center gap-4">
          <button 
            onClick={() => setShowFaceCheckIn(true)} 
            className="text-sm font-medium text-brand-600 hover:underline flex items-center justify-center gap-2"
          >
             Use Face Recognition Check-In <MapPin className="w-4 h-4 opacity-0" />
          </button>
      </div>
    </>
  );
}
