import { supabase } from '../lib/supabaseClient'

function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  return input.trim().replace(/[<>"'&]/g, (char) => {
    const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' }
    return entities[char]
  }).slice(0, 500)
}

function normalizeTaskDate(taskData) {
  if (typeof taskData?.date === 'string' && taskData.date.trim()) {
    return taskData.date.trim()
  }

  if (typeof taskData?.dateKey === 'string' && taskData.dateKey.trim()) {
    return taskData.dateKey.trim()
  }

  return ''
}

function formatTimeFromCreatedAt(createdAt, fallbackTime = '--:--') {
  if (!createdAt) return fallbackTime
  const parsed = new Date(createdAt)
  if (Number.isNaN(parsed.getTime())) return fallbackTime

  return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const taskService = {
  async getTasks(userId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('task_date', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    const tasks = data.map(task => ({
      id: task.id,
      userId: task.user_id,
      date: task.task_date,
      dateKey: task.task_date,
      text: task.text,
      completed: task.completed,
      context: task.context ?? 'pessoal',
      time: task.time ?? formatTimeFromCreatedAt(task.created_at),
      createdAt: task.created_at
    }))

    return { data: tasks, error: null }
  },

  async add(taskData) {
    if (!taskData.text || taskData.text.trim().length === 0) {
      return { data: null, error: 'Texto da tarefa é obrigatório.' }
    }

    const taskDate = normalizeTaskDate(taskData)
    if (!taskDate) {
      return { data: null, error: 'Data da tarefa é obrigatória.' }
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: taskData.userId,
        task_date: taskDate,
        text: sanitizeInput(taskData.text),
        completed: taskData.completed || false
      }])
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    const task = {
      id: data.id,
      userId: data.user_id,
      date: data.task_date,
      dateKey: data.task_date,
      text: data.text,
      completed: data.completed,
      context: data.context ?? taskData.context ?? 'pessoal',
      time: data.time ?? taskData.time ?? formatTimeFromCreatedAt(data.created_at),
      createdAt: data.created_at
    }

    return { data: task, error: null }
  },

  async updateStatus(id, completed) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id)

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: true, error: null }
  },

  async delete(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: true, error: null }
  },
}