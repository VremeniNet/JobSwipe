import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	CircularProgress,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getEmployerVacancies } from '../api/getEmployerVacancies.ts'

type Vacancy = {
	id: number
	position_name: string
	description: string
	responses_count: number
}

export default function EmployerVacanciesList() {
	const [vacancies, setVacancies] = useState<Vacancy[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchVacancies = async () => {
			try {
				const response = await getEmployerVacancies()
				setVacancies(response.data)
			} catch (error) {
				console.error('Ошибка при загрузке вакансий:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchVacancies()
	}, [])

	if (loading) {
		return (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				height='100%'
			>
				<CircularProgress />
			</Box>
		)
	}

	if (vacancies.length === 0) {
		return (
			<Typography textAlign='center' mt={4}>
				У вас пока нет созданных вакансий
			</Typography>
		)
	}

	return (
		<Box display='flex' flexDirection='column' gap={2}>
			{vacancies.map(vacancy => (
				<Card
					sx={{ border: '2px solid #37a2ff', borderRadius: 4, p: 2, mb: 2 }}
				>
					<Typography variant='h6' gutterBottom>
						{vacancy.position_name}
					</Typography>

					<Typography variant='body1' color='text.secondary'>
						💰 {vacancy.salary} ₽
					</Typography>

					<Typography variant='body2' sx={{ mt: 1 }}>
						📨 Откликов: {vacancy.responses_count ?? 0}
					</Typography>

					<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
						<Button
							variant='outlined'
							color='primary'
							onClick={() => handleViewCandidates(vacancy.id)}
						>
							Посмотреть кандидатов
						</Button>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Button
								variant='outlined'
								color='secondary'
								onClick={() => handleEdit(vacancy)}
							>
								Редактировать
							</Button>

							<Button
								variant='outlined'
								color='error'
								onClick={() => handleDelete(vacancy.id)}
							>
								Удалить
							</Button>
						</Box>
					</Box>
				</Card>
			))}
		</Box>
	)
}
