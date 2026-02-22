import { useEffect, useMemo, useState } from 'react'
import { Briefcase, LayoutDashboard, LogOut, Moon, Sun, User } from 'lucide-react'
import CalendarGrid from '../../components/Calendar/CalendarGrid'
import DayTasksModal from '../../components/Modal/DayTasksModal'
import GoalsPanel from '../../components/Sidebar/GoalsPanel'
import PerformanceCard from '../../components/Sidebar/PerformanceCard'
import { goalService } from '../../services/goalService'
import { taskService } from '../../services/taskService'
import { toDateKey, toMonthKey } from '../../utils/dateHelpers'

function DashboardPage({ user, darkMode, onToggleDarkMode, onLogout }) {
  const [context, setContext] = useState('pessoal')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [goals, setGoals] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)

  const loadData = async () => {
    if (!user?.id) return

    const [tasksResult, goalsResult] = await Promise.all([
      taskService.getTasks(user.id),
      goalService.getGoals(user.id),
    ])

    setTasks(tasksResult.data ?? [])
    setGoals(goalsResult.data ?? [])
  }

  useEffect(() => {
    loadData()
  }, [user?.id])

  const monthKey = toMonthKey(currentDate)

  const filteredGoals = useMemo(
    () => goals.filter((goal) => goal.monthKey === monthKey && goal.context === context),
    [goals, monthKey, context],
  )

  const tasksForDay = (day) => {
    const dateKey = toDateKey(currentDate, day)
    return tasks.filter((task) => task.dateKey === dateKey && task.context === context)
  }

  const selectedDayTasks = selectedDay ? tasksForDay(selectedDay) : []

  const addTask = async (text) => {
    await taskService.add({
      userId: user.id,
      text,
      completed: false,
      context,
      dateKey: toDateKey(currentDate, selectedDay),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    await loadData()
  }

  const addGoal = async (text) => {
    await goalService.add({
      userId: user.id,
      text,
      completed: false,
      context,
      monthKey,
    })
    await loadData()
  }

  const toggleTask = async (id, currentStatus) => {
    await taskService.updateStatus(id, !currentStatus)
    await loadData()
  }

  const deleteTask = async (id) => {
    await taskService.delete(id)
    await loadData()
  }

  const toggleGoal = async (id, currentStatus) => {
    await goalService.updateStatus(id, !currentStatus)
    await loadData()
  }

  const deleteGoal = async (id) => {
    await goalService.delete(id)
    await loadData()
  }

  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <div className={`planner-app-page ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <header className="planner-header">
        <div className="planner-header-content">
          <div className="planner-brand-block">
            <div className={`planner-brand-icon ${context === 'pessoal' ? 'personal' : 'professional'}`}>
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1>Planner Pro</h1>
              <p>Área de Trabalho</p>
            </div>
          </div>

          <div className="planner-header-controls">
            <button type="button" onClick={onToggleDarkMode} className="planner-icon-button">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="planner-context-switch">
              <button
                className={`planner-context-button ${context === 'pessoal' ? 'active personal' : ''}`}
                type="button"
                onClick={() => setContext('pessoal')}
              >
                <User size={14} /> Pessoal
              </button>
              <button
                className={`planner-context-button ${context === 'profissional' ? 'active professional' : ''}`}
                type="button"
                onClick={() => setContext('profissional')}
              >
                <Briefcase size={14} /> Profissional
              </button>
            </div>

            <div className="planner-user-pill">
              <div className="planner-online-dot" />
              <span>{(user?.id ?? 'user').slice(0, 8)}</span>
              <button type="button" onClick={onLogout}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="planner-main-grid">
        <aside className="planner-sidebar">
          <GoalsPanel
            darkMode={darkMode}
            context={context}
            goals={filteredGoals}
            onAddGoal={addGoal}
            onToggleGoal={toggleGoal}
            onDeleteGoal={deleteGoal}
          />
          <PerformanceCard darkMode={darkMode} completed={completedCount} total={tasks.length} />
        </aside>

        <CalendarGrid
          currentDate={currentDate}
          darkMode={darkMode}
          context={context}
          tasksForDay={tasksForDay}
          onSelectDay={(day) => {
            setSelectedDay(day)
            setModalOpen(true)
          }}
          onPrevMonth={() =>
            setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
          }
          onNextMonth={() =>
            setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
          }
        />
      </main>

      <DayTasksModal
        open={modalOpen}
        selectedDay={selectedDay}
        currentDate={currentDate}
        darkMode={darkMode}
        context={context}
        tasks={selectedDayTasks}
        onClose={() => setModalOpen(false)}
        onAddTask={addTask}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
      />
    </div>
  )
}

export default DashboardPage
