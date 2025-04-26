import axios from './axios'

// Регистрация профиля работодателя
export const registerEmployerProfile = async (data: FormData) => {
	return axios.post('/profiles/employer', data, {
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})
}

// Создание вакансии
export const createJob = async (data: FormData) => {
	return axios.post('/employer/vacancies', data, {
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})
}
