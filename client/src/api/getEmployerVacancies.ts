import axios from './axios'

// Получение списка вакансий работодателя
export const getEmployerVacancies = async () => {
	return axios.get('/employer/vacancies', {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})
}
