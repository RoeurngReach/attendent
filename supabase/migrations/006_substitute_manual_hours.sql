CREATE TABLE IF NOT EXISTS substitute_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    absent_employee_id TEXT NOT NULL,
    substitute_employee_id TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS manual_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL,
    date DATE NOT NULL,
    hours NUMERIC(5, 2) NOT NULL,
    reason TEXT,
    approved_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
