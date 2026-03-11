'use client'

import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

interface PasswordGateProps {
  children: React.ReactNode
}

const ADMIN_PASSWORD = 'pingjiang2024' // 管理员密码

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查本地存储
    const auth = localStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('密码错误，请重试')
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
    setPassword('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
        <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0] px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8e4de]">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#0a0a0a] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#c9a962]" />
              </div>
              <h1 className="font-display text-2xl text-[#1A1A1A] mb-2">管理员登录</h1>
              <p className="text-sm text-[#8A8A8A]">请输入密码访问管理后台</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full px-4 py-3.5 pr-12 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#1A1A1A]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-[#2C2C2C] transition-colors"
              >
                进入管理后台
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-[#8A8A8A] hover:text-[#c9a962] transition-colors">
                ← 返回首页
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-[#8A8A8A] mt-6">
            默认密码：pingjiang2024
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="text-xs text-[#8A8A8A] hover:text-red-600 transition-colors px-3 py-1.5 bg-white/80 backdrop-blur rounded-full border border-[#e8e4de]"
        >
          退出登录
        </button>
      </div>
      {children}
    </>
  )
}
