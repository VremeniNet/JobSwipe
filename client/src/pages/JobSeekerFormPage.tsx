import {
	Box,
	Button,
	Container,
	Paper,
	TextField,
	Typography,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState, useRef, useEffect } from 'react'
import JobSeekerSkillsStep from '../components/JobSeekerSkillsStep'
import { registerJobSeeker } from '../api/jobSeeker'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'

export default function JobSeekerProfileForm() {
	const navigate = useNavigate()
	const [photo, setPhoto] = useState<File | null>(null)
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		birth_date: '',
		city: '',
		education: '',
		about: '',
		profession: '',
		job_position: '',
		experience: '',
		resume: null as File | null,
	})
	const [professions, setProfessions] = useState<
		{ id: number; name: string }[]
	>([])
	const [positions, setPositions] = useState<{ id: number; name: string }[]>([])
	const [skillsOptions, setSkillsOptions] = useState<
		{ id: number; name: string }[]
	>([])
	const [selectedProfession, setSelectedProfession] = useState<number | null>(
		null
	)
	const [selectedPosition, setSelectedPosition] = useState<number | null>(null)

	useEffect(() => {
		const fetchProfessions = async () => {
			try {
				const res = await axios.get('/professions')
				setProfessions(res.data)
			} catch (error) {
				console.error('Ошибка при загрузке профессий:', error)
			}
		}
		fetchProfessions()
	}, [])

	useEffect(() => {
		const fetchPositionsAndSkills = async () => {
			if (selectedProfession) {
				try {
					const [positionsRes, skillsRes] = await Promise.all([
						axios.get(`/professions/${selectedProfession}/positions`),
						axios.get(`/professions/${selectedProfession}/skills`),
					])
					setPositions(positionsRes.data)
					setSkillsOptions(skillsRes.data)
				} catch (error) {
					console.error('Ошибка при загрузке должностей или навыков:', error)
				}
			}
		}
		fetchPositionsAndSkills()
	}, [selectedProfession])

	const fileInputRef = useRef<HTMLInputElement | null>(null)
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

	const handlePhotoClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFormData(prev => ({ ...prev, resume: e.target.files![0] }))
		}
	}

	const handleFinish = async () => {
		const data = new FormData()
		data.append('first_name', formData.first_name)
		data.append('last_name', formData.last_name)
		data.append('birth_date', formData.birth_date)
		data.append('city', formData.city)
		data.append('education', formData.education)
		data.append('about', formData.about)
		data.append('profession', formData.profession)
		data.append('job_position', formData.job_position)
		data.append('experience', formData.experience)
		data.append('skills', JSON.stringify(selectedSkills))
		if (formData.resume) data.append('resume', formData.resume)
		if (photo) data.append('photo', photo)

		try {
			const res = await registerJobSeeker(data)
			console.log('Успешная регистрация!', res.data)
			navigate('/jobseeker')
		} catch (err) {
			console.error('Ошибка при регистрации:', err)
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
									sx={{
										borderRadius: '50%',
										width: 100,
										height: 100,
										alignSelf: 'center',
										overflow: 'hidden',
										position: 'relative',
										p: 0,
										cursor: 'pointer',
									}}
									onClick={handlePhotoClick}
								>
									{photo ? (
										<img
											src={URL.createObjectURL(photo)}
											alt='Фото профиля'
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
											}}
										/>
									) : (
										'Фото'
									)}
								</Button>

								{/* Скрытый input */}
								<input
									type='file'
									hidden
									accept='image/*'
									ref={fileInputRef}
									onChange={handlePhotoChange}
								/>

								<Box sx={{ display: 'flex', gap: 1 }}>
									<TextField
										name='last_name'
										label='Фамилия'
										value={formData.last_name}
										onChange={handleChange}
										fullWidth
										sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
									/>
									<TextField
										name='first_name'
										label='Имя'
										value={formData.first_name}
										onChange={handleChange}
										fullWidth
										sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
									/>
								</Box>

								<TextField
									name='birth_date'
									label='Дата рождения'
									type='date'
									InputLabelProps={{ shrink: true }}
									value={formData.birth_date}
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
									onClick={() => setStep(2)}
									sx={{ alignSelf: 'flex-end', mt: 2 }}
								>
									Продолжить
								</Button>
							</>
						) : step === 2 ? (
							<>
								<FormControl
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								>
									<InputLabel id='profession-label'>Профессия</InputLabel>
									<Select
										labelId='profession-label'
										value={selectedProfession || ''}
										label='Профессия'
										onChange={e => {
											const professionId = Number(e.target.value)
											setSelectedProfession(professionId)
											setSelectedPosition(null) // сбрасываем выбранную должность
											setSelectedSkills([]) // и навыки
										}}
									>
										{professions.map(prof => (
											<MenuItem key={prof.id} value={prof.id}>
												{prof.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl
									fullWidth
									sx={{ bgcolor: '#E4EAEF', borderRadius: 1 }}
								>
									<InputLabel id='position-label'>Должность</InputLabel>
									<Select
										labelId='position-label'
										value={selectedPosition || ''}
										label='Должность'
										onChange={e => setSelectedPosition(Number(e.target.value))}
										disabled={!positions.length}
									>
										{positions.map(pos => (
											<MenuItem key={pos.id} value={pos.id}>
												{pos.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<TextField
									name='experience'
									label='Опыт работы(количество лет)'
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
											ref={fileInputRef}
											type='file'
											hidden
											accept='.pdf,.doc,.docx'
											onChange={handleResumeUpload}
										/>
									</Button>

									{formData.resume && (
										<>
											<Typography variant='body2' sx={{ fontStyle: 'italic' }}>
												{formData.resume.name}
											</Typography>
											<DeleteIcon
												onClick={() => {
													setFormData(prev => ({ ...prev, resume: null }))
													if (fileInputRef.current)
														fileInputRef.current.value = ''
												}}
												sx={{
													color: '#888',
													cursor: 'pointer',
													'&:hover': { color: '#555' },
												}}
											/>
										</>
									)}
								</Box>

								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
									skillsOptions={skillsOptions}
								/>

								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Button onClick={() => setStep(2)}>⬅️ Назад</Button>
									<Button
										variant='contained'
										endIcon={<span>✅</span>}
										onClick={handleFinish}
									>
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
