import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import JobSeekerPage from './pages/JobSeekerPage'
import EmployerPage from './pages/EmployerPage'
import AuthPage from './pages/AuthPage'
import SelectRolePage from './pages/SelectRolePage'
import JobSeekerFormPage from './pages/JobSeekerFormPage'
import EmployerRegisterPage from './pages/EmployerRegisterPage'
import EmployerJobCreatePage from './pages/EmployerJobCreatePage'

const App = () => {
	const [token, setToken] = useState<string | null>(null)

	useEffect(() => {
		const savedToken = localStorage.getItem('token')
		if (savedToken) {
			setToken(savedToken)
		}
	}, [])

	return (
		<Router>
			<Routes>
				{/* Публичные маршруты */}
				<Route path='/auth' element={<AuthPage setToken={setToken} />} />
				<Route path='/select-role' element={<SelectRolePage />} />
				<Route path='/register/job-seeker' element={<JobSeekerFormPage />} />
				<Route path='/register/employer' element={<EmployerRegisterPage />} />
				<Route
					path='/employer/create-job'
					element={<EmployerJobCreatePage />}
				/>

				{/* Приватные маршруты */}
				<Route
					path='/jobseeker'
					element={token ? <JobSeekerPage /> : <Navigate to='/login' />}
				/>
				<Route
					path='/employer'
					element={token ? <EmployerPage /> : <Navigate to='/login' />}
				/>

				{/* По умолчанию */}
				<Route path='*' element={<Navigate to='/auth' />} />
			</Routes>
		</Router>
	)
}

export default App
