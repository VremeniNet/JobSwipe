import {
	Box,
	Button,
	Container,
	IconButton,
	Paper,
	TextField,
	Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import EmployerJobFormStep from '../components/EmployerJobFormStep'

export default function EmployerRegisterPage() {
	const [step, setStep] = useState(1)

	const [formData, setFormData] = useState({
		companyName: '',
		website: '',
	})

	const [photos, setPhotos] = useState<File[]>([])
	const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newPhotos = Array.from(e.target.files)
			setPhotos(prev => [...prev, ...newPhotos])
			const newPreviews = newPhotos.map(file => URL.createObjectURL(file))
			setPhotoPreviews(prev => [...prev, ...newPreviews])
		}
	}

	const handleRemovePhoto = (index: number) => {
		setPhotos(prev => prev.filter((_, i) => i !== index))
		setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
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
					<Typography variant='h6' align='center' gutterBottom>
						Регистрация работодателя
					</Typography>

					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						{step === 1 ? (
							<>
								<TextField
									name='companyName'
									label='Название компании'
									value={formData.companyName}
									onChange={handleChange}
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								/>

								<TextField
									name='website'
									label='Сайт компании (если есть)'
									value={formData.website}
									onChange={handleChange}
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								/>

								<Button
									variant='outlined'
									component='label'
									sx={{ alignSelf: 'flex-start' }}
								>
									Добавить фотографии
									<input
										type='file'
										hidden
										multiple
										accept='image/*'
										onChange={handlePhotoChange}
									/>
								</Button>

								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
									{photoPreviews.map((src, index) => (
										<Box
											key={index}
											sx={{
												position: 'relative',
												width: 100,
												height: 100,
												borderRadius: 2,
												overflow: 'hidden',
												boxShadow: 1,
											}}
										>
											<img
												src={src}
												alt={`Фото ${index + 1}`}
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'cover',
												}}
											/>
											<IconButton
												size='small'
												onClick={() => handleRemovePhoto(index)}
												sx={{
													position: 'absolute',
													top: 4,
													right: 4,
													backgroundColor: 'rgba(255,255,255,0.7)',
												}}
											>
												<DeleteIcon fontSize='small' />
											</IconButton>
										</Box>
									))}
								</Box>

								<Button
									variant='contained'
									endIcon={<span>➡️</span>}
									sx={{ alignSelf: 'flex-end', mt: 2 }}
									onClick={() => setStep(2)}
								>
									Продолжить
								</Button>
							</>
						) : (
							<EmployerJobFormStep
								onBack={() => setStep(1)}
								onFinish={() => {
									// здесь ты можешь обработать или отправить финальные данные
									console.log('Завершение регистрации работодателя')
								}}
							/>
						)}
					</Box>
				</Paper>
			</Paper>
		</Container>
	)
}
