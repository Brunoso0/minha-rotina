import { MONTH_NAMES, WEEK_DAYS, buildMonthGrid, isToday } from '../../utils/dateHelpers'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function CalendarGrid({ currentDate, darkMode, context, tasksForDay, onSelectDay, onPrevMonth, onNextMonth }) {
  const grid = buildMonthGrid(currentDate)

  return (
    <section className="planner-calendar-section">
      <div className="planner-month-toolbar">
        <h2>
          {MONTH_NAMES[currentDate.getMonth()]} <span>{currentDate.getFullYear()}</span>
        </h2>
        <div className="planner-month-switch">
          <button className="planner-nav-button" onClick={onPrevMonth} type="button">
            <ChevronLeft size={18} />
          </button>
          <button className="planner-nav-button" onClick={onNextMonth} type="button">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="planner-calendar-board">
        {WEEK_DAYS.map((label) => (
          <div key={label} className="planner-weekday-cell">
            {label}
          </div>
        ))}

        {grid.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="planner-day-cell empty" />
          }

          const dayTasks = tasksForDay(day)
          const done = dayTasks.filter((task) => task.completed).length
          const percent = dayTasks.length ? Math.round((done / dayTasks.length) * 100) : 0

          return (
            <button
              key={day}
              className={`planner-day-cell ${isToday(currentDate, day) ? 'today' : ''}`}
              type="button"
              onClick={() => onSelectDay(day)}
            >
              <div className="planner-day-head">
                <span className="planner-day-number">{String(day).padStart(2, '0')}</span>
                {dayTasks.length > 0 && <span className="planner-day-progress">{percent}%</span>}
              </div>

              <ul className="planner-day-list">
                {dayTasks.slice(0, 2).map((task) => (
                  <li key={task.id}>
                    <span className={`planner-bullet ${task.completed ? 'done' : context}`} />
                    <span className={task.completed ? 'done' : ''}>{task.text}</span>
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CalendarGrid
