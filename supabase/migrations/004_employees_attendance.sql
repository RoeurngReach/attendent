CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department TEXT,
    role TEXT DEFAULT 'employee',
    telegram_id BIGINT,
    payroll_type TEXT DEFAULT 'fixed',
    rate NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL,
    action TEXT NOT NULL,
    method TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    location_lat NUMERIC(10, 8),
    location_lng NUMERIC(11, 8),
    is_late BOOLEAN DEFAULT FALSE,
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
