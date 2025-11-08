// Skrypt importu wszystkich firm do Supabase
// Uruchom: npx tsx import-companies.ts

import { createClient } from '@supabase/supabase-js'
import { companiesData } from './src/data/companiesData'

// Wczytaj zmienne środowiskowe
const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function importCompanies() {
  console.log(`🚀 Importuję ${companiesData.length} firm do Supabase...`)

  try {
    // Usuń wszystkie istniejące firmy (opcjonalnie)
    // const { error: deleteError } = await supabase.from('companies').delete().neq('id', 0)
    // if (deleteError) console.error('Błąd usuwania:', deleteError)

    // Wstaw firmy partiami (Supabase ma limit ~1000 rekordów na raz)
    const batchSize = 100
    let imported = 0

    for (let i = 0; i < companiesData.length; i += batchSize) {
      const batch = companiesData.slice(i, i + batchSize)

      const { data, error } = await supabase
        .from('companies')
        .upsert(batch, { onConflict: 'id' })

      if (error) {
        console.error(`❌ Błąd w partii ${i}-${i + batch.length}:`, error)
      } else {
        imported += batch.length
        console.log(`✅ Zaimportowano ${imported}/${companiesData.length} firm`)
      }
    }

    console.log(`\n🎉 Import zakończony! Zaimportowano ${imported} firm.`)

    // Sprawdź ile firm jest w bazie
    const { count } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Łącznie firm w bazie: ${count}`)

  } catch (error) {
    console.error('💥 Błąd importu:', error)
  }
}

// Uruchom import
importCompanies()
