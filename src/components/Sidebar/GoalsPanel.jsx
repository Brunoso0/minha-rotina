import { useState } from 'react'
import { CheckCircle2, Circle, Plus, Target, Trash2 } from 'lucide-react'

function GoalsPanel({ goals, context, onAddGoal, onToggleGoal, onDeleteGoal }) {
  const [text, setText] = useState('')

  const handleAdd = async () => {
    if (!text.trim()) return
    await onAddGoal(text)
    setText('')
  }

  return (
    <section className="planner-goals-card">
      <div className="planner-goals-title-row">
        <Target className={`planner-goal-target ${context === 'pessoal' ? 'personal' : 'professional'}`} size={20} />
        <h3>Metas do Mês</h3>
      </div>

      <ul className="planner-goals-list">
        {goals.map((goal) => (
          <li key={goal.id} className="planner-goal-item">
            <button type="button" onClick={() => onToggleGoal(goal.id, goal.completed)} className="planner-icon-action">
              {goal.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </button>
            <span className={`planner-goal-text ${goal.completed ? 'done' : ''}`}>{goal.text}</span>
            <button type="button" className="planner-goal-delete" onClick={() => onDeleteGoal(goal.id)}>
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>

      <div className="planner-goal-input-wrap">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleAdd()
          }}
          placeholder="Nova meta..."
        />
        <button type="button" className="planner-goal-add" onClick={handleAdd}>
          <Plus size={20} />
        </button>
      </div>
    </section>
  )
}

export default GoalsPanel
