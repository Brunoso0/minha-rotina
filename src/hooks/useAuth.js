import { useEffect, useState } from 'react'
import { authService } from '../services/auth'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.subscribeAuth((nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email, password) => authService.signIn(email, password)
  const signUp = async (name, email, password) => authService.signUp(name, email, password)
  const signOut = async () => authService.signOut()

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
