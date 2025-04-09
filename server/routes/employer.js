const express = require('express')
const router = express.Router()
const pool = require('../db.js') // Пул подключения к базе данных
const authenticateToken = require('../middleware/authenticateToken')

// Middleware для проверки роли работодателя
function checkEmployer(req, res, next) {
	if (req.user.role !== 'employer') {
		return res
			.status(403)
			.json({ error: 'Нет доступа. Требуется роль работодателя.' })
	}
	next()
}

/**
 * Создать новую вакансию
 * POST /api/employer/vacancies
 * Тело запроса: { title, description, requirements, location }
 */
router.post(
	'/vacancies',
	authenticateToken,
	checkEmployer,
	async (req, res) => {
		try {
			const employerId = req.user.userId
			const { title, description, requirements, location } = req.body
			const result = await pool.query(
				`INSERT INTO vacancies (employer_id, title, description, requirements, location)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
				[employerId, title, description, requirements, location]
			)
			res.status(201).json(result.rows[0])
		} catch (error) {
			console.error('Ошибка при создании вакансии:', error)
			res.status(500).json({ error: 'Ошибка при создании вакансии' })
		}
	}
)

/**
 * Получить список всех вакансий работодателя
 * GET /api/employer/vacancies
 */
router.get('/vacancies', authenticateToken, checkEmployer, async (req, res) => {
	try {
		const employerId = req.user.userId
		const result = await pool.query(
			`SELECT * FROM vacancies WHERE employer_id = $1 ORDER BY created_at DESC`,
			[employerId]
		)
		res.json(result.rows)
	} catch (error) {
		console.error('Ошибка при получении вакансий:', error)
		res.status(500).json({ error: 'Ошибка при получении вакансий' })
	}
})

/**
 * Получить информацию о конкретной вакансии
 * GET /api/employer/vacancies/:id
 */
router.get(
	'/vacancies/:id',
	authenticateToken,
	checkEmployer,
	async (req, res) => {
		try {
			const employerId = req.user.userId
			const vacancyId = req.params.id
			const result = await pool.query(
				`SELECT * FROM vacancies WHERE id = $1 AND employer_id = $2`,
				[vacancyId, employerId]
			)
			if (result.rows.length === 0) {
				return res.status(404).json({ error: 'Вакансия не найдена' })
			}
			res.json(result.rows[0])
		} catch (error) {
			console.error('Ошибка при получении вакансии:', error)
			res.status(500).json({ error: 'Ошибка при получении вакансии' })
		}
	}
)

/**
 * Обновить вакансию
 * PUT /api/employer/vacancies/:id
 * Тело запроса: { title, description, requirements, location }
 */
router.put(
	'/vacancies/:id',
	authenticateToken,
	checkEmployer,
	async (req, res) => {
		try {
			const employerId = req.user.userId
			const vacancyId = req.params.id
			const { title, description, requirements, location } = req.body
			const result = await pool.query(
				`UPDATE vacancies
       SET title = $1,
           description = $2,
           requirements = $3,
           location = $4,
           updated_at = NOW()
       WHERE id = $5 AND employer_id = $6
       RETURNING *`,
				[title, description, requirements, location, vacancyId, employerId]
			)
			if (result.rows.length === 0) {
				return res
					.status(404)
					.json({ error: 'Вакансия не найдена или нет доступа' })
			}
			res.json(result.rows[0])
		} catch (error) {
			console.error('Ошибка при обновлении вакансии:', error)
			res.status(500).json({ error: 'Ошибка при обновлении вакансии' })
		}
	}
)

/**
 * Удалить вакансию
 * DELETE /api/employer/vacancies/:id
 */
router.delete(
	'/vacancies/:id',
	authenticateToken,
	checkEmployer,
	async (req, res) => {
		try {
			const employerId = req.user.userId
			const vacancyId = req.params.id
			const result = await pool.query(
				`DELETE FROM vacancies WHERE id = $1 AND employer_id = $2 RETURNING *`,
				[vacancyId, employerId]
			)
			if (result.rows.length === 0) {
				return res
					.status(404)
					.json({ error: 'Вакансия не найдена или нет доступа' })
			}
			res.json({ message: 'Вакансия удалена' })
		} catch (error) {
			console.error('Ошибка при удалении вакансии:', error)
			res.status(500).json({ error: 'Ошибка при удалении вакансии' })
		}
	}
)

/**
 * Работодатель ставит "лайк" карточке кандидата
 * POST /api/employer/like
 * Тело запроса: { job_seeker_id, vacancy_id }
 */
router.post('/like', authenticateToken, checkEmployer, async (req, res) => {
	try {
		const employerId = req.user.userId
		const { job_seeker_id, vacancy_id } = req.body

		// Проверяем, что вакансия принадлежит работодателю
		const vacancyResult = await pool.query(
			`SELECT * FROM vacancies WHERE id = $1 AND employer_id = $2`,
			[vacancy_id, employerId]
		)
		if (vacancyResult.rows.length === 0) {
			return res
				.status(403)
				.json({ error: 'Вакансия не принадлежит работодателю' })
		}

		// Добавляем запись в таблицу лайков работодателя
		const result = await pool.query(
			`INSERT INTO employer_likes (employer_id, job_seeker_id, vacancy_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
			[employerId, job_seeker_id, vacancy_id]
		)

		// Дополнительно можно проверить взаимный лайк и создать чат

		res.status(201).json(result.rows[0])
	} catch (error) {
		console.error('Ошибка при лайке карточки кандидата:', error)
		res.status(500).json({ error: 'Ошибка при лайке карточки кандидата' })
	}
})

/**
 * Получить список чатов для работодателя
 * GET /api/employer/chats
 */
router.get('/chats', authenticateToken, checkEmployer, async (req, res) => {
	try {
		const employerId = req.user.userId
		const result = await pool.query(
			`SELECT * FROM chats WHERE employer_id = $1 ORDER BY created_at DESC`,
			[employerId]
		)
		res.json(result.rows)
	} catch (error) {
		console.error('Ошибка при получении чатов:', error)
		res.status(500).json({ error: 'Ошибка при получении чатов' })
	}
})

module.exports = router
