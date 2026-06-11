export const globalOrgs: Record<string, any> = {
  'default': {
    slug: 'default',
    name: 'Default Organization',
    admin_password: 'admin',
    geofence: { lat: 11.562108, lng: 104.888535, radius: 200 },
    payroll: { workStart: "08:00", workEnd: "17:00", timezone: "Asia/Phnom_Penh" },
    qr_secret: 'default_secret',
    attendance_methods: { face_match: true, qr: true, gps: true, pin: true, manual: true }
  }
};

export const globalDb: Record<string, any> = {
  'SC-042': { org_id: 'default', name: 'ចាន់ តុលា (Chan Tola)', department: 'IT', role: 'employee', telegram_id: null, payrollType: 'fixed', rate: 500, nfc_uid: null },
  'SC-089': { org_id: 'default', name: 'លីម សុគន្ធ (Lim Sokun)', department: 'HR', role: 'employee', telegram_id: null, payrollType: 'hourly', rate: 4.5, nfc_uid: null },
  'SC-102': { org_id: 'default', name: 'គង់ ស្រីនី (Kong Sreyny)', department: 'Sales', role: 'employee', telegram_id: null, payrollType: 'fixed', rate: 400, nfc_uid: null },
  'ADMIN': { org_id: 'default', name: 'Reach Roeurng', department: 'Management', role: 'admin', telegram_id: null, payrollType: 'fixed', rate: 1000, nfc_uid: null }
};

export const globalAttendance: any[] = [
  { org_id: 'default', id: '1', userId: 'SC-042', name: 'ចាន់ តុលា (Chan Tola)', method: 'Office QR', isoTime: new Date(Date.now() - 86400000 * 2).toISOString(), timestamp: '2 days ago' },
  { org_id: 'default', id: '2', userId: 'SC-089', name: 'លីម សុគន្ធ (Lim Sokun)', method: 'GPS Manual', isoTime: new Date(Date.now() - 86400000).toISOString(), timestamp: '1 day ago' },
  { org_id: 'default', id: '3', userId: 'SC-102', name: 'គង់ ស្រីនី (Kong Sreyny)', method: 'Face Match', isoTime: new Date().toISOString(), timestamp: 'Today' },
];

export const globalTimesheets: Record<string, Record<string, any>> = {};
export const globalSchedules: Record<string, Record<string, any>> = {};

// We can keep these as fallback or remove them if we use org config everywhere.
export const payrollConfig = {
  workStart: "08:00",
  workEnd: "17:00",
  timezone: "Asia/Phnom_Penh"
};

export function getOrgId(req: Request) {
  const match = req.headers.get('cookie')?.match(/org=([^;]+)/);
  return match ? match[1] : 'default';
}

export function getOrgConfig(org_id: string) {
  return globalOrgs[org_id] || globalOrgs['default'];
}

