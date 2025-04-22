import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SwipeSwitcher from '../components/SwipeSwitcher'

export default function SelectRolePage() {
	const navigate = useNavigate()
	const [role, setRole] = useState<'job_seeker' | 'employer' | null>(null)

	const handleContinue = () => {
		if (role === 'job_seeker') {
			navigate('/register/job-seeker')
		}
		// позже добавить ветку для employer
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
					borderRadius: 2,
					overflow: 'hidden',
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
						padding: 4,
						border: '4px solid #37a2ff',
						width: '100%',
						maxWidth: 480,
						bgcolor: '#C7DCF4',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 2,
						mx: 'auto',
					}}
				>
					<Typography variant='h6' align='center'>
						Регистрация
					</Typography>
					<Typography variant='body2' color='textSecondary' sx={{ mb: 1 }}>
						Выберите:
					</Typography>

					<Button
						variant='outlined'
						fullWidth
						sx={{
							bgcolor: role === 'job_seeker' ? '#fff' : '#f0f0f0',
							color: 'black',
							border:
								role === 'job_seeker'
									? '2px solid #4db5ff'
									: '1px solid rgba(0, 0, 0, 0.23)',
						}}
						onClick={() => setRole('job_seeker')}
					>
						Я ищу работу
					</Button>

					<Button
						variant='outlined'
						fullWidth
						sx={{
							bgcolor: role === 'employer' ? '#fff' : '#f0f0f0',
							color: 'black',
							border:
								role === 'employer'
									? '2px solid #4db5ff'
									: '1px solid rgba(0, 0, 0, 0.23)',
						}}
						onClick={() => setRole('employer')}
					>
						Я работодатель
					</Button>

					<SwipeSwitcher
						isLogin={false}
						setIsLogin={() => {
							if (role === 'job_seeker') navigate('/register/job-seeker')
							if (role === 'employer') navigate('/register/employer')
						}}
						disabled={!role}
						label='Продолжить'
						customSwipe
					/>
				</Paper>
			</Paper>
		</Container>
	)
}
