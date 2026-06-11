CREATE TABLE IF NOT EXISTS payroll_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL,
    base_salary NUMERIC(10, 2),
    hourly_rate NUMERIC(10, 2),
    allowance NUMERIC(10, 2) DEFAULT 0,
    deduction_per_late NUMERIC(10, 2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payroll_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL,
    adjustment_type TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    reason TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
