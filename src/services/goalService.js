const GOALS_KEY = 'minha-rotina:goals'

function sanitizeInput(input) {
	if (typeof input !== 'string') return ''
	return input.trim().replace(/[<>"'&]/g, (char) => {
		const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' }
		return entities[char]
	}).slice(0, 300)
}

function readGoals() {
	try {
		const value = localStorage.getItem(GOALS_KEY)
		return value ? JSON.parse(value) : []
	} catch {
		return []
	}
}

function writeGoals(goals) {
	localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}

export const goalService = {
	async getGoals(userId) {
		const allGoals = readGoals()
		const goals = allGoals.filter((goal) => goal.userId === userId)
		return { data: goals, error: null }
	},

	async add(goalData) {
		if (!goalData.text || goalData.text.trim().length === 0) {
			return { data: null, error: 'Texto da meta é obrigatório.' }
		}

		const allGoals = readGoals()
		const goal = {
			id: crypto?.randomUUID?.() ?? String(Date.now()),
			...goalData,
			text: sanitizeInput(goalData.text),
			createdAt: new Date().toISOString(),
		}
		allGoals.push(goal)
		writeGoals(allGoals)
		return { data: goal, error: null }
	},

	async updateStatus(id, completed) {
		const allGoals = readGoals()
		const updated = allGoals.map((goal) => (goal.id === id ? { ...goal, completed } : goal))
		writeGoals(updated)
		return { data: true, error: null }
	},

	async delete(id) {
		const allGoals = readGoals()
		const updated = allGoals.filter((goal) => goal.id !== id)
		writeGoals(updated)
		return { data: true, error: null }
	},
}
