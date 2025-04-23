import { Box, Button, TextField, Typography, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'

type Props = {
	onBack: () => void
	onFinish: () => void
}

export default function EmployerJobFormStep({ onBack, onFinish }: Props) {
	const [step, setStep] = useState(1)

	const [formData, setFormData] = useState({
		jobTitle: '',
		specialty: '',
		salaryFrom: '',
		salaryTo: '',
		requirements: '',
		description: '',
		photos: [] as File[],
	})

	const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files)
			setFormData(prev => ({
				...prev,
				photos: [...prev.photos, ...filesArray],
			}))
			const newPreviews = filesArray.map(file => URL.createObjectURL(file))
			setPhotoPreviews(prev => [...prev, ...newPreviews])
			e.target.value = ''
		}
	}

	const handlePhotoDelete = (index: number) => {
		const updatedPhotos = [...formData.photos]
		const updatedPreviews = [...photoPreviews]
		updatedPhotos.splice(index, 1)
		updatedPreviews.splice(index, 1)
		setFormData(prev => ({ ...prev, photos: updatedPhotos }))
		setPhotoPreviews(updatedPreviews)
	}

	return (
		<Box display='flex' flexDirection='column' gap={2}>
			<Typography variant='h6'>Добавление вакансии</Typography>

			{step === 1 && (
				<>
					<TextField
						label='Название вакансии'
						name='jobTitle'
						value={formData.jobTitle}
						onChange={handleChange}
						fullWidth
						sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
					/>
					<TextField
						label='Специальность'
						name='specialty'
						value={formData.specialty}
						onChange={handleChange}
						fullWidth
						sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
					/>
					<Box display='flex' gap={1}>
						<TextField
							label='Зарплата от'
							name='salaryFrom'
							value={formData.salaryFrom}
							onChange={handleChange}
							fullWidth
							sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
						/>
						<TextField
							label='Зарплата до'
							name='salaryTo'
							value={formData.salaryTo}
							onChange={handleChange}
							fullWidth
							sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
						/>
					</Box>
					<Box display='flex' justifyContent='space-between'>
						<Button onClick={onBack}>⬅️ Назад</Button>
						<Button variant='contained' onClick={() => setStep(2)}>
							Далее ➡️
						</Button>
					</Box>
				</>
			)}

			{step === 2 && (
				<>
					<TextField
						label='Требования'
						name='requirements'
						value={formData.requirements}
						onChange={handleChange}
						fullWidth
						multiline
						sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
					/>
					<TextField
						label='Описание'
						name='description'
						value={formData.description}
						onChange={handleChange}
						fullWidth
						multiline
						sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
					/>

					<Button variant='outlined' component='label'>
						Добавить фото
						<input
							type='file'
							hidden
							accept='image/*'
							multiple
							onChange={handlePhotoUpload}
						/>
					</Button>

					<Box display='flex' flexWrap='wrap' gap={1}>
						{photoPreviews.map((src, i) => (
							<Box key={i} position='relative' sx={{ width: 100, height: 100 }}>
								<img
									src={src}
									alt='preview'
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										borderRadius: 8,
									}}
								/>
								<IconButton
									size='small'
									sx={{
										position: 'absolute',
										top: -10,
										right: -10,
										bgcolor: 'white',
									}}
									onClick={() => handlePhotoDelete(i)}
								>
									<DeleteIcon fontSize='small' />
								</IconButton>
							</Box>
						))}
					</Box>

					<Box display='flex' justifyContent='space-between'>
						<Button onClick={() => setStep(1)}>⬅️ Назад</Button>
						<Button variant='contained' onClick={onFinish}>
							Завершить
						</Button>
					</Box>
				</>
			)}
		</Box>
	)
}
