import { Box, Button, Chip, TextField, Typography } from '@mui/material'
import { useState } from 'react'

type Skill = {
	id: number
	name: string
}

type Props = {
	selectedSkills: string[]
	setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>
	skillsOptions: Skill[]
}

export default function JobSeekerSkillsStep({
	selectedSkills,
	setSelectedSkills,
	skillsOptions,
}: Props) {
	const [customSkill, setCustomSkill] = useState('')

	const toggleSkill = (skillName: string) => {
		setSelectedSkills(prev =>
			prev.includes(skillName)
				? prev.filter(s => s !== skillName)
				: [...prev, skillName]
		)
	}

	const addCustomSkill = () => {
		const trimmed = customSkill.trim()
		if (trimmed && !selectedSkills.includes(trimmed)) {
			setSelectedSkills(prev => [...prev, trimmed])
			setCustomSkill('')
		}
	}

	return (
		<>
			<Typography sx={{ mb: 1 }}>Выберите навыки</Typography>

			{/* Навыки из БД */}
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
				{skillsOptions
					.filter(
						(skill): skill is Skill =>
							typeof skill?.id === 'number' && typeof skill?.name === 'string'
					)
					.map(skill => (
						<Chip
							key={`skill-${skill.id}`}
							label={skill.name}
							clickable
							sx={{ fontSize: '0.9rem' }}
							color={
								selectedSkills.includes(skill.name) ? 'primary' : 'default'
							}
							onClick={() => toggleSkill(skill.name)}
						/>
					))}
				{selectedSkills
					.filter(skillName => !skillsOptions.some(s => s.name === skillName))
					.map(skillName => (
						<Chip
							key={`custom-${skillName}`}
							label={skillName}
							clickable
							color='primary'
							onClick={() => toggleSkill(skillName)}
						/>
					))}
			</Box>

			{/* Добавить свой навык */}
			<Box sx={{ display: 'flex', gap: 1 }}>
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
