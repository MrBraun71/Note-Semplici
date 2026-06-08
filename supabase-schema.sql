CREATE TABLE notes (
  id        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title     TEXT        NOT NULL DEFAULT 'Nuova nota',
  content   TEXT        NOT NULL DEFAULT '',
  color     TEXT        NOT NULL DEFAULT '#B388DD',
  category  TEXT        NOT NULL DEFAULT 'ideas',
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Abilita Row Level Security (opzionale, consigliato)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy per accesso pubblico anonimo (solo se vuoi accesso senza autenticazione)
CREATE POLICY "Accesso pubblico" ON notes
  FOR ALL USING (true) WITH CHECK (true);
