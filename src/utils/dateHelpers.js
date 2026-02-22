export const MONTH_NAMES = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
]

export const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const pad2 = (value) => String(value).padStart(2, '0')

export function toDateKey(currentDate, day) {
	const year = currentDate.getFullYear()
	const month = currentDate.getMonth() + 1
	return `${year}-${pad2(month)}-${pad2(day)}`
}

export function toMonthKey(currentDate) {
	const year = currentDate.getFullYear()
	const month = currentDate.getMonth() + 1
	return `${year}-${pad2(month)}`
}

export function getDaysInMonth(year, month) {
	return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
	return new Date(year, month, 1).getDay()
}

export function buildMonthGrid(currentDate) {
	const year = currentDate.getFullYear()
	const month = currentDate.getMonth()
	const firstDay = getFirstDayOfMonth(year, month)
	const totalDays = getDaysInMonth(year, month)

	const grid = []
	for (let i = 0; i < firstDay; i += 1) {
		grid.push(null)
	}
	for (let day = 1; day <= totalDays; day += 1) {
		grid.push(day)
	}

	return grid
}

export function isToday(currentDate, day) {
	const now = new Date()
	return (
		now.getDate() === day &&
		now.getMonth() === currentDate.getMonth() &&
		now.getFullYear() === currentDate.getFullYear()
	)
}

