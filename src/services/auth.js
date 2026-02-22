import { supabase } from '../lib/supabaseClient'

const listeners = new Set()

function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  return input.trim().replace(/[<>"'&]/g, (char) => {
    const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' }
    return entities[char]
  })
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function notify(user) {
  listeners.forEach((listener) => listener(user))
}

async function getSessionUser() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.user_metadata?.name || session.user.email.split('@')[0]
  }
}

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    const user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.name || session.user.email.split('@')[0]
    }
    notify(user)
  } else {
    notify(null)
  }
})

export const authService = {
  subscribeAuth(callback) {
    listeners.add(callback)
    getSessionUser().then(callback)
    return () => listeners.delete(callback)
  },

  async signIn(email, password) {
    if (!email || !password) {
      return { data: null, error: 'Credenciais inválidas.' }
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase())
    if (!validateEmail(sanitizedEmail)) {
      return { data: null, error: 'Formato de e-mail inválido.' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password
    })

    if (error) {
      return { data: null, error: 'Credenciais incorretas.' }
    }

    const user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email.split('@')[0]
    }

    notify(user)
    return { data: user, error: null }
  },

  async signUp(name, email, password) {
    if (!name || !email || !password) {
      return { data: null, error: 'Todos os campos são obrigatórios.' }
    }

    if (password.length < 6) {
      return { data: null, error: 'A senha deve ter pelo menos 6 caracteres.' }
    }

    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = sanitizeInput(email.toLowerCase())

    if (!validateEmail(sanitizedEmail)) {
      return { data: null, error: 'Formato de e-mail inválido.' }
    }

    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        data: {
          name: sanitizedName
        }
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return { data: null, error: 'Este e-mail já está em uso.' }
      }
      return { data: null, error: error.message }
    }

    const user = {
      id: data.user.id,
      email: data.user.email,
      name: sanitizedName
    }

    notify(user)
    return { data: user, error: null }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { data: null, error: 'Não foi possível sair da conta.' }
    }

    notify(null)
    return { data: true, error: null }
  },
}