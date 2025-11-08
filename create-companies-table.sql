-- SQL do stworzenia tabeli companies w Supabase
-- Wklej to w: Dashboard → SQL Editor → New query → Run

CREATE TABLE IF NOT EXISTS companies (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT,
  city TEXT,
  industry TEXT,
  employees TEXT,
  revenue TEXT,
  potential TEXT,
  type TEXT DEFAULT 'klient',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  address TEXT,
  phone TEXT,
  website TEXT,
  email TEXT,
  description TEXT,
  status TEXT DEFAULT 'potential',
  owner_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy dla szybszego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_companies_region ON companies(region);
CREATE INDEX IF NOT EXISTS idx_companies_type ON companies(type);
CREATE INDEX IF NOT EXISTS idx_companies_potential ON companies(potential);
CREATE INDEX IF NOT EXISTS idx_companies_lat_lng ON companies(lat, lng);

-- Włącz Row Level Security (opcjonalnie)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Policy: wszyscy mogą czytać
CREATE POLICY "Anyone can read companies" ON companies
  FOR SELECT USING (true);

-- Policy: tylko zalogowani mogą dodawać/edytować
CREATE POLICY "Authenticated users can insert" ON companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON companies
  FOR UPDATE USING (auth.role() = 'authenticated');
