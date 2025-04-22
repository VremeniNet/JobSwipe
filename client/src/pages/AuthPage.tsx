import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	Paper,
} from '@mui/material'
import SwipeSwitcher from '../components/SwipeSwitcher'

export default function AuthPage() {
	const [isLogin, setIsLogin] = useState(true)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!email || !password) {
			alert('Пожалуйста, заполните все поля')
			return
		}

		if (!isLogin) {
			// переход к выбору роли
			navigate('/select-role', { state: { email, password } })
		} else {
			// TODO: логика входа будет позже
			alert('Вход пока не реализован')
		}
	}

	return (
		<Container
			maxWidth='sm'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
			}}
		>
			<Box
				sx={{
					width: 100,
					height: 112,
					backgroundColor: '#fff',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					mb: 3,
					borderRadius: 4,
				}}
			>
				<img
					src='/logo.png'
					alt='Логотип'
					style={{ maxWidth: '100%', maxHeight: '100%' }}
				/>
			</Box>
			<Paper sx={{ borderRadius: 4, width: '100%', padding: 2 }}>
				<Paper
					elevation={4}
					sx={{
						borderRadius: 4,
						padding: 3,
						border: '4px solid #37a2ff',
						width: '90%',
						bgcolor: '#C7DCF4',
						margin: '0 auto',
					}}
				>
					<Typography variant='h6' align='center' gutterBottom>
						{isLogin ? 'Вход' : 'Регистрация'}
					</Typography>

					<Box
						component='form'
						onSubmit={handleSubmit}
						sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
					>
						<TextField
							label='Почта'
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							variant='outlined'
							fullWidth
							sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
						/>
						<TextField
							label='Пароль'
							type='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							variant='outlined'
							fullWidth
							sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
						/>

						<Button
							variant='contained'
							type='submit'
							sx={{
								alignSelf: 'center',
								width: 'fit-content',
								padding: '10px 30px',
							}}
						>
							{isLogin ? 'Войти' : 'Зарегистрироваться'}
						</Button>

						<SwipeSwitcher isLogin={isLogin} setIsLogin={setIsLogin} />
					</Box>
				</Paper>
			</Paper>
		</Container>
	)
}
