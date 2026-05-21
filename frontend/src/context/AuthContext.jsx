import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    const res = await api.post('/auth/login/', { email, password })
    const tokens = res.data
    localStorage.setItem('tokens', JSON.stringify(tokens))
    // Fetch profile
    const profileRes = await api.get('/auth/profile/')
    const userData = profileRes.data
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const signup = async (data) => {
    const res = await api.post('/auth/signup/', data)
    const { user: userData, tokens } = res.data
    localStorage.setItem('tokens', JSON.stringify(tokens))
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    const tokens = JSON.parse(localStorage.getItem('tokens') || '{}')
    if (tokens.refresh) {
      api.post('/auth/logout/', { refresh: tokens.refresh }).catch(() => {})
    }
    localStorage.removeItem('tokens')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
