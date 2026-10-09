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
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// Pre-computed SHA-256 hashes for credential verification
const TARGET_USER_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // 'admin'
const TARGET_PASS_HASH = '70264a64181db979fd4661565293ed71ff915ea16fddcf207b2ca2682a93fbd0' // '9441887261'
const TARGET_COMBO_HASH = 'bfa4e3ef43265617694d3a1ef178917450a82b516460f3cc9450f6dce158846c' // 'admin:9441887261:sheila_eye_hospital_salt_2026'

async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session on initial load / refresh
    const initAuth = async () => {
      try {
        // 1. Check Supabase Auth session
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (currentSession && currentSession.user) {
          setSession(currentSession)
          setUser(currentSession.user)
          setLoading(false)
          return
        }

        // 2. Check local authenticated admin session
        const saved = localStorage.getItem(ADMIN_STORAGE_KEY)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (
              parsed &&
              parsed.token &&
              parsed.user &&
              parsed.expiresAt &&
              Date.now() < parsed.expiresAt
            ) {
              const expectedToken = await sha256(`session:${parsed.user.id}:${parsed.createdAt}`)
              if (parsed.token === expectedToken) {
                setUser(parsed.user as User)
                setSession({
                  access_token: parsed.token,
                  user: parsed.user,
                  token_type: 'bearer',
                  expires_in: Math.floor((parsed.expiresAt - Date.now()) / 1000),
                  refresh_token: '',
                } as unknown as Session)
              } else {
                localStorage.removeItem(ADMIN_STORAGE_KEY)
              }
            } else {
              localStorage.removeItem(ADMIN_STORAGE_KEY)
            }
          } catch {
            localStorage.removeItem(ADMIN_STORAGE_KEY)
          }
        }
      } catch (err) {
        console.error('Error verifying auth session:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession) {
        setSession(newSession)
        setUser(newSession.user ?? null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const trimmedUser = usernameOrEmail.trim()
      const trimmedPass = password.trim()

      if (!trimmedUser || !trimmedPass) {
        return { success: false, error: 'Invalid username or password.' }
      }

      // 1. Check if username matches 'admin' or admin email aliases
      const normalizedUser = trimmedUser.toLowerCase()
      const isEmail = normalizedUser.includes('@')
      const targetEmail = isEmail ? normalizedUser : 'admin@sheilaeyehospital.com'

      // 2. Attempt Supabase Auth signInWithPassword if configured in Supabase Auth
      try {
        const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
          email: isEmail ? normalizedUser : 'admin.sheilaeye@gmail.com',
          password: trimmedPass,
        })

        if (!sbError && sbData.user && sbData.session) {
          setUser(sbData.user)
          setSession(sbData.session)
          const now = Date.now()
          const sessionToken = await sha256(`session:${sbData.user.id}:${now}`)
          localStorage.setItem(
            ADMIN_STORAGE_KEY,
            JSON.stringify({
              token: sessionToken,
              user: sbData.user,
              createdAt: now,
              expiresAt: now + SESSION_EXPIRY_MS,
            })
          )
          return { success: true }
        }
      } catch {
        // Fall through to secure hash verification
      }

      // 3. Secure SHA-256 verification for the authorized administrator
      const [userHash, passHash, comboHash] = await Promise.all([
        sha256(normalizedUser),
        sha256(trimmedPass),
        sha256(`${normalizedUser}:${trimmedPass}:sheila_eye_hospital_salt_2026`),
      ])

      const isUserMatch =
        userHash === TARGET_USER_HASH ||
        normalizedUser === 'admin@sheilaeyehospital.com' ||
        normalizedUser === 'admin.sheilaeye@gmail.com'

      const isPassMatch = passHash === TARGET_PASS_HASH
      const isComboMatch = comboHash === TARGET_COMBO_HASH || (isUserMatch && isPassMatch)

      if (isUserMatch && isPassMatch && isComboMatch) {
        const now = Date.now()
        const adminUser: User = {
          id: 'admin-sheila-hospital-01',
          aud: 'authenticated',
          role: 'authenticated',
          email: targetEmail,
          email_confirmed_at: new Date().toISOString(),
          app_metadata: { provider: 'email', role: 'admin' },
          user_metadata: { name: 'Hospital Administrator', role: 'admin' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as unknown as User

        const sessionToken = await sha256(`session:${adminUser.id}:${now}`)
        const adminSession: Session = {
          access_token: sessionToken,
          token_type: 'bearer',
          expires_in: Math.floor(SESSION_EXPIRY_MS / 1000),
          refresh_token: '',
          user: adminUser,
        } as unknown as Session

        setUser(adminUser)
        setSession(adminSession)

        localStorage.setItem(
          ADMIN_STORAGE_KEY,
          JSON.stringify({
            token: sessionToken,
            user: adminUser,
            createdAt: now,
            expiresAt: now + SESSION_EXPIRY_MS,
          })
        )

        return { success: true }
      }

      return { success: false, error: 'Invalid username or password.' }
    } catch (err: unknown) {
      console.error('Login error:', err)
      return { success: false, error: 'Invalid username or password.' }
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

