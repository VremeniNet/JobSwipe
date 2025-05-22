import MainLayout from '../components/MainLayout'
import EmployerVacanciesList from '../components/EmployerVacanciesList'
import { Box } from '@mui/material'
import { IconButton, Tooltip } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

export default function EmployerPage() {
	return (
		<MainLayout>
			<Box sx={{ position: 'absolute', top: 16, right: 16 }}>
				<Tooltip title='Профиль'>
					<IconButton color='primary' size='large'>
						<AccountCircleIcon sx={{ fontSize: 40 }} />
					</IconButton>
				</Tooltip>
			</Box>
			<EmployerVacanciesList />
		</MainLayout>
	)
}
