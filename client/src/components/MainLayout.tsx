import { Box, Button, Paper } from '@mui/material'
import ChatSidebar from './ChatSidebar'
import { useNavigate, useLocation } from 'react-router-dom'

type Props = {
	children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
	const navigate = useNavigate()
	const location = useLocation()
	const role = localStorage.getItem('role') // Получаем роль пользователя из localStorage

	const isEmployerPage =
		role === 'employer' && location.pathname.startsWith('/employer')

	return (
		<Box
			sx={{
				display: 'flex',
				height: 'calc(100vh - 40px)',
				backgroundColor: '#37a2ff',
				padding: 2,
			}}
		>
			<Paper
				sx={{
					flex: 1,
					borderRadius: 4,
					backgroundColor: '#C7DCF4',
					padding: 2,
					marginRight: 2,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					overflowY: 'auto',
				}}
			>
				<Box sx={{ flex: 1 }}>{children}</Box>

				{/* Кнопка "Создать вакансию" показывается только работодателю */}
				{isEmployerPage && (
					<Button
						variant='contained'
						sx={{
							mt: 2,
							alignSelf: 'flex-end',
							bgcolor: '#37a2ff',
							':hover': { bgcolor: '#1e88e5' },
						}}
						onClick={() => navigate('/employer/job-create')}
					>
						Создать вакансию
					</Button>
				)}
			</Paper>

			<Paper
				sx={{
					width: 320,
					borderRadius: 4,
					backgroundColor: '#ffffff',
					padding: 2,
					boxShadow: 2,
				}}
			>
				<ChatSidebar />
			</Paper>
		</Box>
	)
}
