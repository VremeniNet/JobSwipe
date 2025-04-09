const express = require('express')
const router = express.Router()
const pool = require('../db.js') // Пул подключения к базе данных
const authenticateToken = require('../middleware/authenticateToken')

// Middleware для проверки роли соискателя
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
			// Можно добавить фильтрацию вакансий, которые уже лайкнул пользователь, если потребуется
			const result = await pool.query(
				'SELECT * FROM vacancies ORDER BY created_at DESC'
			)
			res.json(result.rows)
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

		// Добавляем запись в таблицу лайков соискателя
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
 *
 * Здесь можно интегрировать модель SVD для формирования рекомендаций.
 * Пока что для примера возвращается список всех вакансий.
 */
router.get(
	'/recommendations',
	authenticateToken,
	checkJobSeeker,
	async (req, res) => {
		try {
			// Заготовка для интеграции алгоритма рекомендаций
			const result = await pool.query(
				'SELECT * FROM vacancies ORDER BY created_at DESC'
			)
			res.json(result.rows)
		} catch (error) {
			console.error('Ошибка при получении рекомендаций:', error)
			res.status(500).json({ error: 'Ошибка при получении рекомендаций' })
		}
	}
)

module.exports = router
