// Sprawdzenie struktury tabel w Supabase
import { supabase } from './src/lib/supabase'

async function checkStructure() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .limit(1)
  
  console.log('Przykładowa firma:', data)
  console.log('Error:', error)
}

checkStructure()
