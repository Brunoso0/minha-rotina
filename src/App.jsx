import { useAuth } from './hooks/useAuth'
import { useDarkMode } from './hooks/useDarkMode'
import LoginPage from './pages/Login/Login'
import DashboardPage from './pages/Dashboard/Dashboard'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()

  return (
    <>
      {loading ? (
        <div className={`screen-center ${darkMode ? 'theme-dark' : 'theme-light'}`}>
          <div className="spinner" />
        </div>
      ) : !user ? (
        <LoginPage
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogin={signIn}
          onRegister={signUp}
        />
      ) : (
        <DashboardPage
          user={user}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLogout={signOut}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={2800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={darkMode ? 'dark' : 'light'}
      />
    </>
  )
}

export default App
