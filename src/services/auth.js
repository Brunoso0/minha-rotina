const AUTH_KEY = 'minha-rotina:auth'
const USERS_KEY = 'minha-rotina:users'

const listeners = new Set()

const defaultUser = {
  id: 'admin-user',
  name: 'Admin',
  email: 'admin@example.com',
  passwordHash: hashPassword('123456'),
}

function hashPassword(password) {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

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

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getUsers() {
  const existing = readJSON(USERS_KEY, [])
  if (existing.length > 0) {
    return existing
  }

  const seeded = [defaultUser]
  writeJSON(USERS_KEY, seeded)
  return seeded
}

function getSessionUser() {
  return readJSON(AUTH_KEY, null)
}

function notify(user) {
  listeners.forEach((listener) => listener(user))
}

function safeUser(user) {
  if (!user) return null
  const { passwordHash: _, ...withoutPassword } = user
  return withoutPassword
}

export const authService = {
  subscribeAuth(callback) {
    listeners.add(callback)
    callback(getSessionUser())
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

    const users = getUsers()
    const passwordHash = hashPassword(password)
    const foundUser = users.find(
      (user) => user.email === sanitizedEmail && user.passwordHash === passwordHash
    )

    if (!foundUser) {
      return { data: null, error: 'Credenciais incorretas.' }
    }

    const user = safeUser(foundUser)
    writeJSON(AUTH_KEY, user)
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

    const users = getUsers()
    const exists = users.some((user) => user.email === sanitizedEmail)
    if (exists) {
      return { data: null, error: 'Este e-mail já está em uso.' }
    }

    const newUser = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      name: sanitizedName,
      email: sanitizedEmail,
      passwordHash: hashPassword(password),
    }

    const updatedUsers = [...users, newUser]
    writeJSON(USERS_KEY, updatedUsers)

    const sessionUser = safeUser(newUser)
    writeJSON(AUTH_KEY, sessionUser)
    notify(sessionUser)
    return { data: sessionUser, error: null }
  },

  async signOut() {
    localStorage.removeItem(AUTH_KEY)
    notify(null)
  },
}