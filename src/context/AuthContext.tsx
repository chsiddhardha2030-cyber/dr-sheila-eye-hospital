import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ADMIN_STORAGE_KEY = 'sheila_admin_auth_session'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active Supabase session
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (currentSession) {
          setSession(currentSession)
          setUser(currentSession.user)
        } else {
          // Check local persisted session fallback for temporary development admin
          const saved = localStorage.getItem(ADMIN_STORAGE_KEY)
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              if (parsed && parsed.email) {
                setUser({ id: 'admin-temp-id', email: parsed.email } as User)
                setSession({ access_token: 'valid', user: { id: 'admin-temp-id', email: parsed.email } } as Session)
              }
            } catch {
              localStorage.removeItem(ADMIN_STORAGE_KEY)
            }
          }
        }
      } catch (err) {
        console.error('Error getting auth session:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession) {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({ email: newSession.user.email }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Normalize username if entered 'admin' or variations
      const trimmedInput = usernameOrEmail.trim()
      const isEmail = trimmedInput.includes('@')
      const email = isEmail ? trimmedInput : `${trimmedInput.toLowerCase()}@sheilaeyehospital.com`

      // 1. Try Supabase Auth signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email: isEmail ? email : 'admin.sheilaeye@gmail.com',
        password,
      })

      if (!error && data.user && data.session) {
        setUser(data.user)
        setSession(data.session)
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({ email: data.user.email }))
        return { success: true }
      }

      // 2. Fallback for temporary dev credentials if Supabase email confirmation is required or password '123'
      if (
        (trimmedInput.toLowerCase() === 'admin' || trimmedInput.toLowerCase() === 'admin.sheilaeye@gmail.com' || trimmedInput.toLowerCase() === 'admin@hospital.com') &&
        (password === '123' || password === 'admin_password_123')
      ) {
        const dummyUser = { id: 'admin-dev-01', email: 'admin@sheilaeyehospital.com' } as User
        const dummySession = { access_token: 'admin-session-token', user: dummyUser } as Session
        setUser(dummyUser)
        setSession(dummySession)
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({ email: dummyUser.email }))
        return { success: true }
      }

      return { success: false, error: error?.message || 'Invalid username or password' }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      return { success: false, error: msg }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error signing out:', err)
    } finally {
      localStorage.removeItem(ADMIN_STORAGE_KEY)
      setUser(null)
      setSession(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
