import { Box, Typography } from '@mui/material'
import { IconButton, Tooltip } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MainLayout from '../components/MainLayout'
import { useEffect, useState } from 'react'
import { fetchVacancies } from '../api/jobSeeker'

import VacancyCard from '../components/VacancyCard'

export default function JobSeekerPage() {
	const [vacancies, setVacancies] = useState<any[]>([])
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		const loadVacancies = async () => {
			try {
				const response = await fetchVacancies()
				setVacancies(response.data)
			} catch (error) {
				console.error('Ошибка загрузки вакансий:', error)
			}
		}

		loadVacancies()
	}, [])

	const handleSwipe = (direction: 'left' | 'right') => {
		console.log(`Пользователь свайпнул ${direction}`)
		setCurrentIndex(prev => prev + 1)
	}

	const currentVacancy = vacancies[currentIndex]

	return (
		<MainLayout>
			<Box sx={{ position: 'absolute', top: 16, right: 16 }}>
				<Tooltip title='Профиль'>
					<IconButton color='primary' size='large'>
						<AccountCircleIcon sx={{ fontSize: 40 }} />
					</IconButton>
				</Tooltip>
			</Box>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
				}}
			>
				{currentVacancy ? (
					<VacancyCard vacancy={currentVacancy} onSwipe={handleSwipe} />
				) : (
					<Typography variant='h6' align='center'>
						Больше нет вакансий
					</Typography>
				)}
			</Box>
		</MainLayout>
	)
}
