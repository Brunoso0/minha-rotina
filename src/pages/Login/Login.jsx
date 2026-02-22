import { useState } from 'react'
import {
	AlertCircle,
	ArrowRight,
	LayoutDashboard,
	Lock,
	Mail,
	Moon,
	Sun,
	User,
	UserPlus,
} from 'lucide-react'

function LoginPage({ onLogin, onRegister, darkMode, onToggleDarkMode }) {
	const [registerMode, setRegisterMode] = useState(false)
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = async (event) => {
		event.preventDefault()
		setSubmitting(true)
		setError('')

		try {
			if (registerMode) {
				if (password !== confirmPassword) {
					setError('As palavras-passe não coincidem.')
					return
				}
				const result = await onRegister(name, email, password)
				if (result?.error) {
					setError(result.error)
				}
			} else {
				const result = await onLogin(email, password)
				if (result?.error) {
					setError(result.error)
				}
			}
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className={`planner-login-page ${darkMode ? 'theme-dark' : 'theme-light'}`}>
			<div className="planner-login-theme-switch">
				<button type="button" className="planner-icon-button" onClick={onToggleDarkMode}>
					{darkMode ? <Sun size={20} /> : <Moon size={20} />}
				</button>
			</div>

			<div className="planner-login-wrap">
				<div className="planner-login-branding">
					<div className="planner-login-badge">
						{registerMode ? <UserPlus size={40} /> : <LayoutDashboard size={40} />}
					</div>
					<h1>{registerMode ? 'CRIAR CONTA' : 'PLANNER PRO'}</h1>
					<p className="planner-muted">
						{registerMode
							? 'Crie sua conta para começar.'
							: 'Acesse sua conta.'}
					</p>
				</div>

				<div className="planner-login-card">
					{error && (
						<div className="planner-alert-danger">
							<AlertCircle size={16} />
							<span>{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="planner-form-stack">
						{registerMode && (
							<div>
								<label className="planner-label">Nome Completo</label>
								<div className="planner-input-icon-wrap">
									<User className="planner-input-icon" size={18} />
									<input
										type="text"
										value={name}
										onChange={(event) => setName(event.target.value)}
										placeholder="Seu Nome Completo"
										required={registerMode}
									/>
								</div>
							</div>
						)}

						<div>
							<label className="planner-label">E-mail</label>
							<div className="planner-input-icon-wrap">
								<Mail className="planner-input-icon" size={18} />
							<input
									type="email"
									value={email}
									onChange={(event) => {
										setEmail(event.target.value)
										setError('')
									}}
									placeholder="seu.email@exemplo.com"
									required
								/>
							</div>
						</div>

						<div>
							<label className="planner-label">Palavra-passe</label>
							<div className="planner-input-icon-wrap">
								<Lock className="planner-input-icon" size={18} />
								<input
									type="password"
									value={password}
									onChange={(event) => {
										setPassword(event.target.value)
										setError('')
									}}
									placeholder="••••••••"
									required
								/>
							</div>
						</div>

						{registerMode && (
							<div>
								<label className="planner-label">Confirmar Palavra-passe</label>
								<div className="planner-input-icon-wrap">
									<Lock className="planner-input-icon" size={18} />
									<input
										type="password"
										value={confirmPassword}
										onChange={(event) => setConfirmPassword(event.target.value)}
										placeholder="••••••••"
										required={registerMode}
									/>
								</div>
							</div>
						)}

						<button
							disabled={submitting}
							type="submit"
							className={`planner-submit-button ${registerMode ? 'register' : 'login'}`}
						>
							{submitting ? (
								<div className="planner-button-spinner" />
							) : (
								<>
									{registerMode ? 'FINALIZAR REGISTO' : 'ACEDER AO PLANNER'}
									<ArrowRight size={18} />
								</>
							)}
						</button>
					</form>

					{!registerMode && (
						<div className="planner-test-data">
							<p>Dados de acesso: admin@example.com / 123456</p>
						</div>
					)}

					<div className="planner-login-footer">
						<button
							type="button"
							className="planner-mode-button"
							onClick={() => {
								setRegisterMode((prev) => !prev)
								setError('')
							}}
						>
							{registerMode ? 'Já tem conta? Inicie sessão' : 'Não tem conta? Registe-se aqui'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LoginPage
