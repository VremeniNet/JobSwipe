const express = require('express')
const router = express.Router()
const pool = require('../db.js')
const authenticateToken = require('../middleware/authenticateToken')

// Middleware для роли соискателя
function checkJobSeeker(req, res, next) {
	if (req.user.role !== 'job_seeker') {
		return res
			.status(403)
			.json({ error: 'Нет доступа. Требуется роль соискателя.' })
	}
	next()
}

/**
 * Получить список всех вакансий
 * GET /api/jobseeker/vacancies
 */
router.get(
	'/vacancies',
	authenticateToken,
	checkJobSeeker,
	async (req, res) => {
		try {
			const result = await pool.query(
				`SELECT 
				v.id,
				v.position_name,
				v.salary,
				v.description,
				v.requirements,
				v.photo,
				pf.name AS profession_name,
				ps.name AS position_title
			FROM vacancies v
			LEFT JOIN professions pf ON v.profession_id = pf.id
			LEFT JOIN positions ps ON v.position_id = ps.id
			ORDER BY v.created_at DESC`
			)

			const vacancies = result.rows.map(vacancy => ({
				...vacancy,
				photo: vacancy.photo
					? `data:image/jpeg;base64,${vacancy.photo.toString('base64')}`
					: null,
			}))

			res.json(vacancies)
		} catch (error) {
			console.error('Ошибка при получении вакансий:', error)
			res.status(500).json({ error: 'Ошибка при получении вакансий' })
		}
	}
)

/**
 * Соискатель лайкает вакансию
 * POST /api/jobseeker/like
 * Тело запроса: { vacancy_id }
 */
router.post('/like', authenticateToken, checkJobSeeker, async (req, res) => {
	try {
		const jobSeekerId = req.user.userId
		const { vacancy_id } = req.body

		const result = await pool.query(
			`INSERT INTO job_seeker_likes (job_seeker_id, vacancy_id)
			 VALUES ($1, $2)
			 RETURNING *`,
			[jobSeekerId, vacancy_id]
		)

		res.status(201).json(result.rows[0])
	} catch (error) {
		console.error('Ошибка при лайке вакансии:', error)
		res.status(500).json({ error: 'Ошибка при лайке вакансии' })
	}
})

/**
 * Получить список чатов для соискателя
 * GET /api/jobseeker/chats
 */
router.get('/chats', authenticateToken, checkJobSeeker, async (req, res) => {
	try {
		const jobSeekerId = req.user.userId
		const result = await pool.query(
			'SELECT * FROM chats WHERE job_seeker_id = $1 ORDER BY created_at DESC',
			[jobSeekerId]
		)
		res.json(result.rows)
	} catch (error) {
		console.error('Ошибка при получении чатов:', error)
		res.status(500).json({ error: 'Ошибка при получении чатов' })
	}
})

/**
 * Получить рекомендованные вакансии для соискателя
 * GET /api/jobseeker/recommendations
 */
router.get(
	'/recommendations',
	authenticateToken,
	checkJobSeeker,
	async (req, res) => {
		try {
			// Пока просто все вакансии, позже сюда можно вставить рекомендательную логику
			const result = await pool.query(
				`SELECT 
		v.id,
		v.position_name,
		v.salary,
		v.description,
		v.requirements,
		v.photo,
		pf.name AS profession_name,
		ps.name AS position_title,
		ep.company_name,
		ep.website
	FROM vacancies v
	LEFT JOIN professions pf ON v.profession_id = pf.id
	LEFT JOIN positions ps ON v.position_id = ps.id
	LEFT JOIN employer_profiles ep ON v.employer_id = ep.user_id
	ORDER BY v.created_at DESC`
			)

			const vacancies = result.rows.map(vacancy => ({
				...vacancy,
				photo: vacancy.photo
					? `data:image/jpeg;base64,${vacancy.photo.toString('base64')}`
					: null,
			}))

			res.json(vacancies)
		} catch (error) {
			console.error('Ошибка при получении рекомендаций:', error)
			res.status(500).json({ error: 'Ошибка при получении рекомендаций' })
		}
	}
)

module.exports = router
