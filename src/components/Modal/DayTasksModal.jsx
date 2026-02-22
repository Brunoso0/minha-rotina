import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Clock, Plus, Trash2 } from 'lucide-react'
import { MONTH_NAMES } from '../../utils/dateHelpers'

function DayTasksModal({
  open,
  selectedDay,
  currentDate,
  darkMode,
  context,
  tasks,
  onClose,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (open) {
      setText('')
    }
  }, [open, selectedDay])

  if (!open || !selectedDay) return null

  const handleAdd = async () => {
    if (!text.trim()) return
    await onAddTask(text)
    setText('')
  }

  const done = tasks.filter((task) => task.completed).length
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="planner-modal-overlay" role="dialog" aria-modal="true">
      <div className={`planner-modal-panel ${darkMode ? 'theme-dark' : 'theme-light'}`}>
        <div className="planner-modal-header">
          <div>
            <h3>
              {selectedDay} {MONTH_NAMES[currentDate.getMonth()]}
            </h3>
            <p>{context} Checklist</p>
          </div>
          <button type="button" className="planner-modal-close" onClick={onClose}>
            <Plus size={24} />
          </button>
        </div>

        <div className="planner-modal-body">
          <div className="planner-task-input-wrap">
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleAdd()
              }}
              placeholder="O que planejou para hoje?"
            />
            <button
              type="button"
              className={`planner-task-add-button ${context === 'pessoal' ? 'personal' : 'professional'}`}
              onClick={handleAdd}
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="planner-modal-list-wrap">
            <h4>Lista de Tarefas</h4>
            <ul className="planner-task-list">
            {tasks.map((task) => (
              <li key={task.id} className={`planner-task-item ${task.completed ? 'done' : ''}`}>
                <div className="planner-task-main">
                  <button type="button" onClick={() => onToggleTask(task.id, task.completed)}>
                    {task.completed ? <CheckCircle2 size={26} /> : <Circle size={26} />}
                  </button>
                  <div>
                    <p className={task.completed ? 'done' : ''}>{task.text}</p>
                    <span>
                      <Clock size={10} /> {task.time}
                    </span>
                  </div>
                </div>

                <button type="button" className="planner-task-delete" onClick={() => onDeleteTask(task.id)}>
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
            </ul>
          </div>
        </div>

        <div className="planner-modal-footer">
          <div className="planner-progress-wrap">
            <div className="planner-progress-track">
              <div
                className={`planner-progress-bar ${context === 'pessoal' ? 'personal' : 'professional'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="planner-progress-label" style={{ left: `${progress}%` }}>
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DayTasksModal
