-- Run this once in your Neon SQL editor (console.neon.tech)
-- Creates the thoughts table with all polaroid fields

CREATE TABLE IF NOT EXISTS thoughts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text        TEXT        NOT NULL,
  image_url   TEXT        NOT NULL,       -- public URL from Supabase Storage
  align_h     TEXT        NOT NULL DEFAULT 'center',
  align_v     TEXT        NOT NULL DEFAULT 'bottom',
  text_color  TEXT        NOT NULL DEFAULT '#ffffff',
  text_size   TEXT        NOT NULL DEFAULT 'sm',
  polaroid_size TEXT      NOT NULL DEFAULT 'md',
  x           NUMERIC     NOT NULL,       -- % position on canvas
  y           NUMERIC     NOT NULL,
  rotation    NUMERIC     NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Public read index (newest first)
CREATE INDEX IF NOT EXISTS thoughts_created_at_idx ON thoughts (created_at DESC);

-- ── Rants table ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT        NOT NULL,
  text       TEXT        NOT NULL,
  font       TEXT        NOT NULL DEFAULT 'gloria',
  palette    TEXT        NOT NULL DEFAULT 'parchment',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rants_created_at_idx ON rants (created_at DESC);