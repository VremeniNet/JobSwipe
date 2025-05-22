import { CardContent, Typography, Box, Divider } from '@mui/material'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState } from 'react'

type Props = {
	vacancy: {
		position_name: string
		profession_name: string
		position_title: string
		salary: string
		description: string
		requirements: string
		photo?: string // URL или base64
		company_name: string
		website: string
	}
	onSwipe: (direction: 'left' | 'right') => void
}

export default function VacancyCard({ vacancy, onSwipe }: Props) {
	const [flipped, setFlipped] = useState(false)

	const x = useMotionValue(0)
	const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10])
	const likeOpacity = useTransform(x, [50, 150], [0, 1])
	const nopeOpacity = useTransform(x, [-150, -50], [1, 0])

	const handleDragEnd = (_: any, info: any) => {
		if (info.offset.x > 100) onSwipe('right')
		else if (info.offset.x < -100) onSwipe('left')
	}

	const handleFlip = () => {
		setFlipped(prev => !prev)
	}

	const imageUrl = vacancy.photo || '/default.jpg'

	return (
		<Box sx={{ position: 'relative', width: 360, height: 500 }}>
			{/* Индикаторы лайка и отказа */}
			<motion.div
				style={{
					position: 'absolute',
					top: 40,
					left: 20,
					fontSize: 32,
					fontWeight: 700,
					color: '#37a2ff',
					opacity: likeOpacity,
					pointerEvents: 'none',
					zIndex: 1,
				}}
			>
				❤️
			</motion.div>

			<motion.div
				style={{
					position: 'absolute',
					top: 40,
					right: 20,
					fontSize: 32,
					fontWeight: 700,
					color: '#e74c3c',
					opacity: nopeOpacity,
					pointerEvents: 'none',
					zIndex: 1,
				}}
			>
				❌
			</motion.div>

			{/* Карточка */}
			<motion.div
				drag='x'
				style={{ x, rotate, height: '100%', perspective: 1000 }}
				dragConstraints={{ left: 0, right: 0 }}
				onDragEnd={handleDragEnd}
				whileTap={{ scale: 1.03 }}
				onClick={handleFlip}
			>
				<motion.div
					animate={{ rotateY: flipped ? 180 : 0 }}
					transition={{ duration: 0.6 }}
					style={{
						width: '100%',
						height: '100%',
						transformStyle: 'preserve-3d',
						borderRadius: 16,
						backgroundColor: '#fff',
						border: '3px solid #37a2ff',
						boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
						position: 'relative',
					}}
				>
					{/* Передняя сторона */}
					<Box
						sx={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							backfaceVisibility: 'hidden',
							display: 'flex',
							flexDirection: 'column',
							overflow: 'hidden',
						}}
					>
						<Box
							sx={{
								height: '50%',
								backgroundImage: `url(${imageUrl})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								borderTopLeftRadius: 12,
								borderTopRightRadius: 12,
							}}
						/>
						<CardContent sx={{ flexGrow: 1, p: 2 }}>
							<Typography
								variant='h5'
								align='center'
								sx={{ fontWeight: 'bold', mb: 1 }}
							>
								{vacancy.position_name}
							</Typography>
							<Typography
								variant='subtitle2'
								align='center'
								sx={{ mt: 1, fontWeight: 500 }}
							>
								{vacancy.company_name}
							</Typography>
							<Typography
								variant='body2'
								align='center'
								color='text.secondary'
								sx={{ wordBreak: 'break-word' }}
							>
								{vacancy.website}
							</Typography>
							<Typography variant='body1' align='center'>
								{vacancy.profession_name}
							</Typography>
							<Typography variant='body2' align='center'>
								{vacancy.position_title}
							</Typography>
							<Typography
								variant='h6'
								align='center'
								sx={{ mt: 2, color: '#37a2ff' }}
							>
								💰 {vacancy.salary} ₽
							</Typography>
							<Typography
								variant='caption'
								align='center'
								display='block'
								sx={{ mt: 1, color: 'gray' }}
							>
								Нажмите, чтобы посмотреть подробнее
							</Typography>
						</CardContent>
					</Box>

					{/* Задняя сторона */}
					<Box
						sx={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							backfaceVisibility: 'hidden',
							transform: 'rotateY(180deg)',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-start',
							p: 2,
							boxSizing: 'border-box',
							borderRadius: 2,
							bgcolor: '#fff',
							overflowY: 'auto',
						}}
					>
						<Typography variant='subtitle1' fontWeight={600} gutterBottom>
							📄 Описание
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{vacancy.description}
						</Typography>

						<Divider sx={{ my: 2 }} />

						<Typography variant='subtitle1' fontWeight={600} gutterBottom>
							📌 Требования
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{vacancy.requirements}
						</Typography>

						<Typography
							variant='caption'
							align='center'
							display='block'
							sx={{ mt: 2, color: '#999' }}
						>
							Нажмите, чтобы вернуться
						</Typography>
					</Box>
				</motion.div>
			</motion.div>
		</Box>
	)
}
