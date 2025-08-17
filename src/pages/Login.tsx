import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState<string | null>(null)

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setErr(error.message)
    else window.location.href = '/'
  }

  const signUp = async () => {
    setErr(null)
    const { error } = await supabase.auth.signUp({ email, password: pass })
    if (error) setErr(error.message)
    else alert('Sprawdź maila i potwierdź rejestrację, potem zaloguj się.')
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={signIn} className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-3 text-white">
        <h1 className="text-xl font-bold">Logowanie</h1>
        <input className="w-full p-2 rounded bg-gray-900 border border-gray-700" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 rounded bg-gray-900 border border-gray-700" placeholder="hasło" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        {err && <div className="text-red-400 text-sm">{err}</div>}
        <button className="w-full bg-blue-600 hover:bg-blue-700 rounded p-2">Zaloguj</button>
        <button type="button" onClick={signUp} className="w-full bg-gray-700 hover:bg-gray-600 rounded p-2">Załóż konto</button>
      </form>
    </div>
  )
}
