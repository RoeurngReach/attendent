ALTER TABLE employees ADD COLUMN IF NOT EXISTS nfc_uid TEXT;

CREATE TABLE IF NOT EXISTS employee_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL,
    org_id UUID REFERENCES organizations(id),
    card_type TEXT DEFAULT 'NFC',
    card_serial TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);
