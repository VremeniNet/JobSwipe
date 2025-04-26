import api from './axios'

export const registerJobSeeker = async (formData: FormData) => {
	const token = localStorage.getItem('token')

	const response = await api.post('/profiles/jobSeeker', formData, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	return response
}
