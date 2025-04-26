import {
	Box,
	Button,
	TextField,
	Typography,
	IconButton,
	MenuItem,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from 'react'
import { createJob } from '../api/employer'
import { fetchProfessions, fetchPositionsByProfession } from '../api/profession'
import { useNavigate } from 'react-router-dom'

type Props = {
	onFinish: () => void
}

export default function EmployerJobFormStep({ onFinish }: Props) {
	const navigate = useNavigate()

	const [step, setStep] = useState(1)

	const [formData, setFormData] = useState({
		positionName: '',
		professionId: '',
		positionId: '',
		salary: '',
		description: '',
		requirements: '',
		photo: null as File | null,
	})

	const [photoPreview, setPhotoPreview] = useState<string | null>(null)
	const [professions, setProfessions] = useState<
		{ id: number; name: string }[]
	>([])
	const [positions, setPositions] = useState<{ id: number; name: string }[]>([])

	// Загрузка профессий при загрузке компонента
	useEffect(() => {
		const loadProfessions = async () => {
			try {
				const response = await fetchProfessions()
				setProfessions(response.data)
			} catch (error) {
				console.error('Ошибка загрузки профессий:', error)
			}
		}
		loadProfessions()
	}, [])

	// Загрузка должностей при выборе профессии
	useEffect(() => {
		const loadPositions = async () => {
			if (!formData.professionId) return
			try {
				const response = await fetchPositionsByProfession(
					Number(formData.professionId)
				)
				setPositions(response.data)
			} catch (error) {
				console.error('Ошибка загрузки должностей:', error)
			}
		}
		loadPositions()
	}, [formData.professionId])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setFormData(prev => ({ ...prev, photo: file }))
			setPhotoPreview(URL.createObjectURL(file))
			e.target.value = ''
		}
	}

	const handlePhotoDelete = () => {
		setFormData(prev => ({ ...prev, photo: null }))
		setPhotoPreview(null)
	}

	const handleSubmit = async () => {
		try {
			const data = new FormData()
			data.append('position_name', formData.positionName)
			data.append('profession_id', formData.professionId)
			data.append('position_id', formData.positionId)
			data.append('salary', formData.salary)
			data.append('description', formData.description)
			data.append('requirements', formData.requirements)
			if (formData.photo) {
				data.append('photo', formData.photo)
			}

			await createJob(data)

			console.log('Вакансия успешно создана!')
			onFinish()
		} catch (error) {
			console.error('Ошибка при создании вакансии:', error)
		}
	}

	return (
		<Box display='flex' flexDirection='column' gap={2}>
			<Typography variant='h6' textAlign='center'>
				Добавление вакансии
			</Typography>

			{step === 1 && (
				<>
					<TextField
						label='Название вакансии'
						name='positionName'
						value={formData.positionName}
						onChange={handleChange}
						fullWidth
						sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
					/>

					<TextField
						select
						label='Выберите профессию'
						name='professionId'
						value={formData.professionId}
						onChange={handleChange}
						fullWidth
						sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
					>
						{professions.map(prof => (
							<MenuItem key={prof.id} value={prof.id}>
								{prof.name}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label='Выберите должность'
						name='positionId'
						value={formData.positionId}
						onChange={handleChange}
						fullWidth
						sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
						disabled={!formData.professionId}
					>
						{positions.map(pos => (
							<MenuItem key={pos.id} value={pos.id}>
								{pos.name}
							</MenuItem>
						))}
					</TextField>

					<TextField
						label='Зарплата'
						name='salary'
						type='number'
						value={formData.salary}
						onChange={handleChange}
						fullWidth
						sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
					/>

					<Box display='flex' justifyContent='flex-end'>
						<Button variant='contained' onClick={() => setStep(2)}>
							Далее ➡️
						</Button>
					</Box>
				</>
			)}

			{step === 2 && (
				<>
					<TextField
						label='Описание'
						name='description'
						value={formData.description}
						onChange={handleChange}
						fullWidth
						multiline
						minRows={4}
						sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
					/>

					<TextField
						label='Требования'
						name='requirements'
						value={formData.requirements}
						onChange={handleChange}
						fullWidth
						multiline
						minRows={4}
						sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
					/>

					<Box display='flex' justifyContent='space-between'>
						<Button variant='outlined' onClick={() => setStep(1)}>
							⬅️ Назад
						</Button>
						<Button variant='contained' onClick={() => setStep(3)}>
							Далее ➡️
						</Button>
					</Box>
				</>
			)}

			{step === 3 && (
				<>
					<Button variant='outlined' component='label'>
						Добавить фото
						<input
							type='file'
							hidden
							accept='image/*'
							onChange={handlePhotoUpload}
						/>
					</Button>

					{photoPreview && (
						<Box position='relative' sx={{ width: 120, height: 120 }}>
							<img
								src={photoPreview}
								alt='Фото вакансии'
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									borderRadius: 8,
								}}
							/>
							<IconButton
								size='small'
								onClick={handlePhotoDelete}
								sx={{
									position: 'absolute',
									top: -10,
									right: -10,
									bgcolor: 'white',
								}}
							>
								<DeleteIcon fontSize='small' />
							</IconButton>
						</Box>
					)}

					<Box display='flex' justifyContent='space-between'>
						<Button variant='outlined' onClick={() => setStep(2)}>
							⬅️ Назад
						</Button>
						<Button variant='contained' onClick={handleSubmit}>
							Завершить
						</Button>
					</Box>
				</>
			)}
		</Box>
	)
}
