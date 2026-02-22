import { supabase } from '../lib/supabaseClient'

function sanitizeInput(input) {
	if (typeof input !== 'string') return ''
	return input.trim().replace(/[<>"'&]/g, (char) => {
		const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' }
		return entities[char]
	}).slice(0, 300)
}

const pad2 = (value) => String(value).padStart(2, '0')

function getMonthYear(goalData) {
	if (Number.isInteger(goalData?.month) && Number.isInteger(goalData?.year)) {
		return { month: goalData.month, year: goalData.year }
	}

	if (typeof goalData?.monthKey === 'string') {
		const [yearString, monthString] = goalData.monthKey.split('-')
		const year = Number.parseInt(yearString, 10)
		const month = Number.parseInt(monthString, 10)

		if (Number.isInteger(month) && Number.isInteger(year)) {
			return { month, year }
		}
	}

	return { month: null, year: null }
}

export const goalService = {
	async getGoals(userId) {
		const { data, error } = await supabase
			.from('goals')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false })

		if (error) {
			return { data: null, error: error.message }
		}

		const goals = data.map(goal => ({
			id: goal.id,
			userId: goal.user_id,
			month: goal.month,
			year: goal.year,
			monthKey: `${goal.year}-${pad2(goal.month)}`,
			text: goal.description,
			context: goal.context,
			completed: goal.completed ?? false,
			createdAt: goal.created_at
		}))

		return { data: goals, error: null }
	},

	async add(goalData) {
		if (!goalData.text || goalData.text.trim().length === 0) {
			return { data: null, error: 'Texto da meta é obrigatório.' }
		}

		const { month, year } = getMonthYear(goalData)
		if (!month || !year) {
			return { data: null, error: 'Mês e ano da meta são obrigatórios.' }
		}

		const { data, error } = await supabase
			.from('goals')
			.insert([{
				user_id: goalData.userId,
				month,
				year,
				description: sanitizeInput(goalData.text)
			}])
			.select()
			.single()

		if (error) {
			return { data: null, error: error.message }
		}

		const goal = {
			id: data.id,
			userId: data.user_id,
			month: data.month,
			year: data.year,
			monthKey: `${data.year}-${pad2(data.month)}`,
			text: data.description,
			context: data.context ?? goalData.context,
			completed: data.completed ?? false,
			createdAt: data.created_at
		}

		return { data: goal, error: null }
	},

	async updateStatus(id, completed) {
		return { data: true, error: null }
	},

	async delete(id) {
		const { error } = await supabase
			.from('goals')
			.delete()
			.eq('id', id)

		if (error) {
			return { data: null, error: error.message }
		}

		return { data: true, error: null }
	},
}
