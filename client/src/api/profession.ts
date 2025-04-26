import axios from './axios'

// Получить все профессии
export const fetchProfessions = async () => {
	return axios.get('/professions')
}

// Получить должности по профессии
export const fetchPositionsByProfession = async (professionId: number) => {
	return axios.get(`/professions/${professionId}/positions`)
}
