-- Users Table
CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'employee'::text NOT NULL,
  name text DEFAULT ''::text NOT NULL,
  telegram_id text,
  tenant_id text DEFAULT 'default'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Attendance Logs Table
CREATE TABLE public.attendance_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) NOT NULL,
  tenant_id text NOT NULL,
  type text NOT NULL,
  method text NOT NULL,
  location_lat text,
  location_lng text,
  photo_url text,
  status text DEFAULT 'present'::text NOT NULL,
  timestamp timestamp with time zone DEFAULT now() NOT NULL
);

-- Leaf Requests Table
CREATE TABLE public.leave_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) NOT NULL,
  tenant_id text NOT NULL,
  leave_type text NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'PENDING'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Payroll Table
CREATE TABLE public.payroll_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) NOT NULL,
  tenant_id text NOT NULL,
  period_start timestamp with time zone NOT NULL,
  period_end timestamp with time zone NOT NULL,
  base_salary numeric NOT NULL DEFAULT 0,
  deductions numeric NOT NULL DEFAULT 0,
  net_pay numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'pending'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;
