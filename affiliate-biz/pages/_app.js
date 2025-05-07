// pages/_app.js
import { useState, useEffect, createContext } from 'react'
import { supabase } from '../supabaseClient'
import Link from 'next/link'
import '../styles/globals.css'

// Share user + supabase across the app
export const UserContext = createContext({ user: null, supabase })

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Load initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    // Listen for changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  // Handlers
  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: 'google' })
  const signOut = () =>
    supabase.auth.signOut()

  return (
    <UserContext.Provider value={{ user, supabase }}>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <Link href="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link href="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>{user.email}</span>
            <button onClick={signOut}>Sign Out</button>
          </>
        ) : (
          <button
            onClick={signInWithGoogle}
            style={{
              background: '#4285F4',
              color: '#fff',
              border: 'none',
              padding: '.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Continue with Google
          </button>
        )}
      </nav>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

