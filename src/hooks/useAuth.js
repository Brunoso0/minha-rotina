import { useEffect, useState } from 'react'
import { authService } from '../services/auth'
import { toast } from 'react-toastify'

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

  const signIn = async (email, password) => {
    const result = await authService.signIn(email, password)

    if (result?.error) {
      toast.error(result.error)
      return result
    }

    toast.success('Login realizado com sucesso!')
    return result
  }

  const signUp = async (name, email, password) => {
    const result = await authService.signUp(name, email, password)

    if (result?.error) {
      toast.error(result.error)
      return result
    }

    toast.success('Conta criada com sucesso!')
    return result
  }

  const signOut = async () => {
    const result = await authService.signOut()

    if (result?.error) {
      toast.error(result.error)
      return result
    }

    toast.info('Você saiu da conta.')
    return result
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
