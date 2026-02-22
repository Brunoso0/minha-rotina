import { useAuth } from './hooks/useAuth'
import { useDarkMode } from './hooks/useDarkMode'
import LoginPage from './pages/Login/Login'
import DashboardPage from './pages/Dashboard/Dashboard'

function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()

  if (loading) {
    return (
      <div className={`screen-center ${darkMode ? 'theme-dark' : 'theme-light'}`}>
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <LoginPage
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onLogin={signIn}
        onRegister={signUp}
      />
    )
  }

  return (
    <DashboardPage
      user={user}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
      onLogout={signOut}
    />
  )
}

export default App
