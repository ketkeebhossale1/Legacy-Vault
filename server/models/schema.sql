-- Schema
CREATE SCHEMA IF NOT EXISTS legacy_vault;

-- Users
CREATE TABLE IF NOT EXISTS legacy_vault.users (
  user_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(200) NOT NULL,
  email             VARCHAR(320) NOT NULL UNIQUE,
  phone             VARCHAR(30),
  password_hash     TEXT NOT NULL,
  role              VARCHAR(30) NOT NULL DEFAULT 'testator',
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  plan              VARCHAR(30) DEFAULT 'free',
  plan_expires_at   TIMESTAMPTZ,
  reset_token       TEXT,
  reset_token_expires TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wills (one per testator)
CREATE TABLE IF NOT EXISTS legacy_vault.wills (
  will_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  testator_id UUID NOT NULL REFERENCES legacy_vault.users(user_id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assets (linked to a will)
CREATE TABLE IF NOT EXISTS legacy_vault.assets (
  item_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  will_id     UUID NOT NULL REFERENCES legacy_vault.wills(will_id) ON DELETE CASCADE,
  asset_name  VARCHAR(300) NOT NULL,
  asset_type  VARCHAR(100),
  disposition VARCHAR(50),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Nominees / Executors
CREATE TABLE IF NOT EXISTS legacy_vault.nominee (
  nominee_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES legacy_vault.users(user_id) ON DELETE CASCADE,
  first_name       VARCHAR(150) NOT NULL,
  last_name        VARCHAR(150) NOT NULL,
  email            VARCHAR(320),
  address          TEXT,
  asset_name       VARCHAR(300),
  asset_percentage NUMERIC(5,2),
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  is_executor      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ
);

-- Digital Will (one per user, upserted)
CREATE TABLE IF NOT EXISTS legacy_vault.digital_will (
  user_id                 UUID PRIMARY KEY REFERENCES legacy_vault.users(user_id) ON DELETE CASCADE,
  text                    TEXT,
  saved                   BOOLEAN NOT NULL DEFAULT FALSE,
  shared_with             TEXT[] DEFAULT '{}',
  certificate_file        TEXT,
  certificate_uploaded_at TIMESTAMPTZ,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment Sessions (idempotency guard)
CREATE TABLE IF NOT EXISTS legacy_vault.payment_sessions (
  session_id  TEXT PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES legacy_vault.users(user_id) ON DELETE CASCADE,
  plan        VARCHAR(30) NOT NULL,
  used_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Advocates (users who the will is shared with)
CREATE TABLE IF NOT EXISTS legacy_vault.advocate (
  advocate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES legacy_vault.users(user_id) ON DELETE CASCADE,
  email       VARCHAR(320) NOT NULL,
  shared_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, email)
);
