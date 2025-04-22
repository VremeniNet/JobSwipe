import { Box, Button, Chip, TextField, Typography } from '@mui/material'
import { useState } from 'react'

type Props = {
	selectedSkills: string[]
	setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>
}

export default function JobSeekerSkillsStep({
	selectedSkills,
	setSelectedSkills,
}: Props) {
	const [skills, setSkills] = useState(['JavaScript', 'React', 'HTML', 'CSS'])
	const [customSkill, setCustomSkill] = useState('')

	const toggleSkill = (skill: string) => {
		setSelectedSkills(prev =>
			prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
		)
	}

	const addCustomSkill = () => {
		if (customSkill.trim() && !skills.includes(customSkill)) {
			setSkills(prev => [...prev, customSkill])
			setSelectedSkills(prev => [...prev, customSkill])
			setCustomSkill('')
		}
	}

	return (
		<>
			<Typography sx={{ mb: 1 }}>Выберите навыки</Typography>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
				{skills.map(skill => (
					<Chip
						key={skill}
						label={skill}
						clickable
						color={selectedSkills.includes(skill) ? 'primary' : 'default'}
						onClick={() => toggleSkill(skill)}
					/>
				))}
			</Box>

			<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
				<TextField
					variant='outlined'
					size='small'
					label='Добавить навык'
					value={customSkill}
					onChange={e => setCustomSkill(e.target.value)}
					fullWidth
				/>
				<Button variant='contained' onClick={addCustomSkill}>
					+
				</Button>
			</Box>
		</>
	)
}
