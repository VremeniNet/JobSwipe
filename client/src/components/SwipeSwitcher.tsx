import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Box, Typography } from '@mui/material'

type SwitchProps = {
	isLogin: boolean
	setIsLogin: (val: boolean) => void
	disabled?: boolean
	label?: string // текст в центре (например, "Продолжить")
	customSwipe?: boolean // если true — используется как кнопка продолжения
}

export default function SwipeSwitcher({
	isLogin,
	setIsLogin,
	disabled = false,
	label,
	customSwipe = false,
}: SwitchProps) {
	const x = useMotionValue(customSwipe ? 0 : isLogin ? 0 : 204)
	const background = useTransform(x, [0, 204], ['#4db5ff', '#4db5ff'])

	const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
		if (disabled) return

		if (customSwipe) {
			if (info.offset.x > 50) setIsLogin(false) // используем setIsLogin как "onContinue"
		} else {
			if (info.offset.x > 50) setIsLogin(false)
			else if (info.offset.x < -50) setIsLogin(true)
		}
	}

	return (
		<Box
			sx={{
				width: 220,
				margin: '0 auto',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: '24px',
				bgcolor: '#fff',
				position: 'relative',
				height: 48,
				px: 2,
				opacity: disabled ? 0.5 : 1,
				pointerEvents: disabled ? 'none' : 'auto',
			}}
		>
			<Typography
				variant='body2'
				sx={{
					flexGrow: 1,
					textAlign: 'center',
					fontWeight: 500,
				}}
			>
				{label ?? (isLogin ? 'Регистрация' : 'Вход')}
			</Typography>

			<motion.div
				drag='x'
				dragConstraints={{ left: 0, right: 204 }}
				style={{
					x,
					width: 36,
					height: 36,
					borderRadius: '50%',
					backgroundColor: background,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					left: 6,
					cursor: 'grab',
				}}
				onDragEnd={handleDragEnd}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
			>
				<span style={{ fontSize: '18px' }}>
					{customSwipe ? '➡️' : isLogin ? '➡️' : '⬅️'}
				</span>
			</motion.div>
		</Box>
	)
}
