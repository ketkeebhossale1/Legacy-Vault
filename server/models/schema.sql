CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS digital_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  category VARCHAR(80) NOT NULL,
  nominee_name VARCHAR(160),
  access_level VARCHAR(10) NOT NULL DEFAULT 'view' CHECK (access_level IN ('view', 'full')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
