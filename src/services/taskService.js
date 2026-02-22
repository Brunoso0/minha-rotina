const TASKS_KEY = 'minha-rotina:tasks'

function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  return input.trim().replace(/[<>"'&]/g, (char) => {
    const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' }
    return entities[char]
  }).slice(0, 500)
}

function readTasks() {
  try {
    const value = localStorage.getItem(TASKS_KEY)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

function writeTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export const taskService = {
  async getTasks(userId) {
    const allTasks = readTasks()
    const tasks = allTasks.filter((task) => task.userId === userId)
    return { data: tasks, error: null }
  },

  async add(taskData) {
    if (!taskData.text || taskData.text.trim().length === 0) {
      return { data: null, error: 'Texto da tarefa é obrigatório.' }
    }

    const allTasks = readTasks()
    const task = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      ...taskData,
      text: sanitizeInput(taskData.text),
      createdAt: new Date().toISOString(),
    }
    allTasks.push(task)
    writeTasks(allTasks)
    return { data: task, error: null }
  },

  async updateStatus(id, completed) {
    const allTasks = readTasks()
    const updated = allTasks.map((task) => (task.id === id ? { ...task, completed } : task))
    writeTasks(updated)
    return { data: true, error: null }
  },

  async delete(id) {
    const allTasks = readTasks()
    const updated = allTasks.filter((task) => task.id !== id)
    writeTasks(updated)
    return { data: true, error: null }
  },
}