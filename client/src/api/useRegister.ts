import api from './axios'

export const registerUser = async (
	email: string,
	password: string,
	role: string
) => {
	const response = await api.post('/auth/register', {
		email,
		password,
		role,
	})

	const { token } = response.data

	localStorage.setItem('token', token)

	return response.data
}
