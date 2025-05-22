import { Container, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import EmployerJobFormStep from '../components/EmployerJobFormStep'

export default function EmployerJobCreatePage() {
	const navigate = useNavigate()

	const handleFinish = () => {
		console.log('Вакансия успешно создана! 🎉')
		navigate('/employer') // Редирект после успешного создания
	}

	return (
		<Container
			maxWidth='sm'
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Paper sx={{ borderRadius: 4, width: '100%', padding: 2 }}>
				<Paper
					sx={{
						borderRadius: 4,
						padding: 3,
						width: '87%',
						bgcolor: '#C7DCF4',
						border: '4px solid #37a2ff',
						mx: 'auto',
					}}
				>
					<EmployerJobFormStep onFinish={handleFinish} />
				</Paper>
			</Paper>
		</Container>
	)
}
