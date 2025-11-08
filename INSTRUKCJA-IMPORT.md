# 📊 Instrukcja importu firm do Supabase

## Sposób 1: Import przez skrypt TypeScript (ZALECANY)

### Krok 1: Upewnij się że masz plik .env z danymi Supabase

Sprawdź plik `.env` w głównym katalogu projektu:

```bash
VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=twoj-klucz-anon
```

### Krok 2: Uruchom import

```bash
npx tsx import-companies.ts
```

Skrypt:
- ✅ Wczyta wszystkie firmy z `src/data/companiesData.ts`
- ✅ Wstawi je do tabeli `companies` w Supabase
- ✅ Użyje `upsert` więc nie utworzy duplikatów
- ✅ Pokaże postęp importu

### Krok 3: Sprawdź w Supabase

Otwórz dashboard Supabase → Table Editor → companies

---

## Sposób 2: Ręczny import przez SQL

### Krok 1: Stwórz SQL z danych

W pliku `create-sql-import.ts` znajdziesz generator SQL.

### Krok 2: Uruchom SQL w Supabase

Dashboard → SQL Editor → wklej i uruchom

---

## Sposób 3: Import przez interfejs Supabase

Dashboard → Table Editor → Import CSV

Wyeksportuj dane do CSV i zaimportuj przez interfejs.

---

## ⚠️ WAŻNE: Struktura tabeli companies

Upewnij się że tabela `companies` ma kolumny:

```sql
CREATE TABLE companies (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT,
  city TEXT,
  industry TEXT,
  employees TEXT,
  revenue TEXT,
  potential TEXT,
  type TEXT, -- 'klient', 'potencjalny klient', lub 'partner'
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  address TEXT,
  phone TEXT,
  website TEXT,
  email TEXT,
  description TEXT,
  status TEXT,
  owner_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🎯 Po imporcie

1. Sprawdź czy firmy się wyświetlają na mapie
2. Przetestuj filtry (region, branża, potencjał)
3. Sprawdź czy piny mają odpowiednie kolory:
   - 🔵 Niebieski = klient/potencjalny klient
   - 🟣 Fioletowy = partner

---

## 📝 Obecnie w bazie

- **45 firm** reprezentatywnych z pliku `companiesData.ts`
- Aby dodać **wszystkie 155 firm**, zaktualizuj plik lub użyj pełnej listy

