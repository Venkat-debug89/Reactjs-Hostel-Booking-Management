import { createContext, useMemo, useState } from 'react'
import { useHostel } from '../hooks/useHostel'
import { getData, setData, removeData } from '../utils/storage'

export const AuthContext = createContext(null)
const withoutPassword = (user) => {
  const sessionUser = { ...user }
  delete sessionUser.password
  return sessionUser
}

export function AuthProvider({ children }) {
  const { users, addUser, updateUser } = useHostel()
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = getData('currentUser', null)
    return stored ? withoutPassword(stored) : null
  })
  const value = useMemo(() => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    userRole: currentUser?.role,
    login: (email, password) => {
      const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
      if (!user) throw new Error('Email or password is incorrect.')
      const sessionUser = withoutPassword(user)
      setCurrentUser(sessionUser)
      setData('currentUser', sessionUser)
      return sessionUser
    },
    register: (details) => {
      if (users.some((user) => user.email.toLowerCase() === details.email.toLowerCase())) throw new Error('An account already uses that email.')
      const user = { ...details, id: `STU-${Date.now().toString().slice(-6)}`, role: 'student' }
      addUser(user)
      const sessionUser = withoutPassword(user)
      setCurrentUser(sessionUser)
      setData('currentUser', sessionUser)
      return sessionUser
    },
    resetPassword: (email, userId, password) => {
      const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.id.toLowerCase() === userId.toLowerCase())
      if (!user) throw new Error('No account matches that email and ID.')
      updateUser(user.id, { password })
    },
    logout: () => { setCurrentUser(null); removeData('currentUser') },
    refreshUser: (user) => { setCurrentUser(user); setData('currentUser', user) },
  }), [currentUser, users, addUser, updateUser])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}