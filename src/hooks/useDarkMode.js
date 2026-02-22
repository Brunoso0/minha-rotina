import { useEffect, useState } from 'react'

const DARK_MODE_KEY = 'flowroutine:dark-mode'

function getInitialTheme() {
  const saved = localStorage.getItem(DARK_MODE_KEY)
  if (saved !== null) {
    return saved === 'true'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(getInitialTheme)

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, String(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  return { darkMode, toggleDarkMode }
}
