import axios from './axios'

export const login = async (email: string, password: string) => {
	return axios.post('/auth/login', { email, password })
}
