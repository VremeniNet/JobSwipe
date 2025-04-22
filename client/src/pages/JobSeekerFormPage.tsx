import {
	Box,
	Button,
	Container,
	Paper,
	TextField,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import JobSeekerSkillsStep from '../components/JobSeekerSkillsStep'

export default function JobSeekerProfileForm() {
	const [photo, setPhoto] = useState<File | null>(null)
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		birthDate: '',
		city: '',
		education: '',
		about: '',
		profession: '',
		position: '',
		experience: '',
		resume: null as File | null,
	})

	const [step, setStep] = useState(1)
	const [selectedSkills, setSelectedSkills] = useState<string[]>([])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setPhoto(e.target.files[0])
		}
	}

	const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFormData(prev => ({ ...prev, resume: e.target.files![0] }))
		}
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
						Создайте свою карточку
					</Typography>

					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						{step === 1 ? (
							<>
								<Button
									variant='outlined'
									component='label'
									sx={{
										borderRadius: '50%',
										width: 100,
										height: 100,
										alignSelf: 'center',
									}}
								>
									{photo ? '📷' : 'Фото'}
									<input
										type='file'
										hidden
										accept='image/*'
										onChange={handlePhotoChange}
									/>
								</Button>

								<Box sx={{ display: 'flex', gap: 1 }}>
									<TextField
										name='lastName'
										label='Фамилия'
										variant='outlined'
										fullWidth
										value={formData.lastName}
										onChange={handleChange}
										sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
									/>
									<TextField
										name='firstName'
										label='Имя'
										variant='outlined'
										fullWidth
										value={formData.firstName}
										onChange={handleChange}
										sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
									/>
								</Box>

								<TextField
									name='birthDate'
									label='Дата рождения'
									type='date'
									InputLabelProps={{ shrink: true }}
									value={formData.birthDate}
									onChange={handleChange}
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								/>
								<TextField
									name='city'
									label='Город'
									value={formData.city}
									onChange={handleChange}
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								/>
								<TextField
									name='education'
									label='Образование'
									value={formData.education}
									onChange={handleChange}
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								/>
								<TextField
									name='about'
									label='О себе'
									multiline
									rows={3}
									value={formData.about}
									onChange={handleChange}
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								/>
								<Button
									variant='contained'
									endIcon={<span>➡️</span>}
									sx={{ alignSelf: 'flex-end', mt: 2 }}
									onClick={() => setStep(2)}
								>
									Продолжить
								</Button>
							</>
						) : step === 2 ? (
							<>
								<TextField
									name='profession'
									label='Выберите профессию'
									value={formData.profession}
									onChange={handleChange}
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								/>
								<TextField
									name='position'
									label='Выберите должность'
									value={formData.position}
									onChange={handleChange}
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								/>
								<TextField
									name='experience'
									label='Опыт работы'
									value={formData.experience}
									onChange={handleChange}
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								/>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									<Button
										variant='outlined'
										component='label'
										sx={{ whiteSpace: 'nowrap' }}
									>
										Загрузите резюме
										<input
											type='file'
											hidden
											accept='.pdf,.doc,.docx'
											onChange={handleResumeUpload}
										/>
									</Button>

									{formData.resume && (
										<Typography variant='body2' sx={{ fontStyle: 'italic' }}>
											{formData.resume.name}
										</Typography>
									)}
								</Box>

								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										mt: 2,
									}}
								>
									<Button onClick={() => setStep(1)}>⬅️ Назад</Button>
									<Button
										variant='contained'
										onClick={() => setStep(3)}
										endIcon={<span>➡️</span>}
									>
										Продолжить
									</Button>
								</Box>
							</>
						) : (
							<>
								<JobSeekerSkillsStep
									selectedSkills={selectedSkills}
									setSelectedSkills={setSelectedSkills}
								/>

								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										mt: 2,
									}}
								>
									<Button onClick={() => setStep(2)}>⬅️ Назад</Button>
									<Button variant='contained' endIcon={<span>✅</span>}>
										Завершить
									</Button>
								</Box>
							</>
						)}
					</Box>
				</Paper>
			</Paper>
		</Container>
	)
}
