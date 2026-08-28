import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface AdminLoginProps {
  onBackToPublic: () => void
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToPublic }) => {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username/email and password.')
      return
    }

    setLoading(true)
    setError(null)

    const res = await login(username, password)
    setLoading(false)

    if (!res.success) {
      setError(res.error || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C242E] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative selection:bg-rose-500/20 selection:text-[#BE185D]">
      {/* Background soft gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-stone-200/50 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Public Link */}
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 text-xs font-heading font-medium text-[#5A687A] hover:text-[#BE185D] transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Main Website</span>
        </button>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-[#E8E2D8] p-8 sm:p-10 shadow-[0_8px_30px_rgba(28,36,46,0.06)] relative overflow-hidden">
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#BE185D] via-rose-400 to-[#1C242E]" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FDF2F4] border border-[#FCE7F3] mx-auto flex items-center justify-center text-[#BE185D] mb-4 shadow-sm">
              <ShieldCheck size={28} />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-[#1C242E] tracking-tight">
              Dr. Sheila Eye Hospital
            </h1>
            <p className="text-xs font-heading font-semibold uppercase tracking-widest text-[#BE185D] mt-1">
              Administrative Control Panel
            </p>
            <p className="text-xs text-[#5A687A] mt-2">
              Sign in to manage doctor availability and hospital branches
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-semibold text-[#1C242E] mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A687A]">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoFocus
                  className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1C242E] placeholder-stone-400 focus:bg-white focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-[#1C242E] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A687A]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl pl-10 pr-11 py-3 text-sm text-[#1C242E] placeholder-stone-400 focus:bg-white focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5A687A] hover:text-[#1C242E] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 text-center">
            <span className="text-[11px] text-[#8A96A6]">
              Protected Administrative Area &bull; Dr. Sheila Eye Hospital
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
