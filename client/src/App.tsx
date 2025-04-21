import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import JobSeekerPage from './pages/JobseekerPage'
import EmployerPage from './pages/EmployerPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

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
				<Route path='/login' element={<LoginPage setToken={setToken} />} />
				<Route path='/register' element={<RegisterPage />} />

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
				<Route path='*' element={<Navigate to='/login' />} />
			</Routes>
		</Router>
	)
}

export default App
