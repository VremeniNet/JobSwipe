const express = require('express')
const router = express.Router()
const pool = require('../db.js') // Пул подключения к PostgreSQL
const authenticateToken = require('../middleware/authenticateToken')
// ↑ Это middleware для проверки JWT (пример ниже, в разделе "Middleware")

/* 
  =======================
  Маршруты для соискателей
  =======================
*/

/**
 * Получить профиль соискателя (GET /api/profiles/jobSeeker)
 */
router.get('/jobSeeker', authenticateToken, async (req, res) => {
	try {
		// Проверяем, что пользователь – соискатель
		if (req.user.role !== 'job_seeker') {
			return res.status(403).json({ error: 'Нет доступа' })
		}

		const userId = req.user.userId
		const { rows } = await pool.query(
			`SELECT user_id, last_name, first_name, gender, age, city, education,
              about, profession, job_position, skills, resume
         FROM job_seeker_profiles
        WHERE user_id = $1`,
			[userId]
		)

		// Если профиль не найден, вернём пустой объект или 404
		if (rows.length === 0) {
			return res.json(null)
		}

		res.json(rows[0])
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Ошибка при получении профиля' })
	}
})

/**
 * Создать (или обновить) профиль соискателя (POST /api/profiles/jobSeeker)
 * Вариант: можно разделить на POST (создать) и PUT (обновить),
 * но для простоты сделаем единый эндпоинт.
 */
router.post('/jobSeeker', authenticateToken, async (req, res) => {
	try {
		if (req.user.role !== 'job_seeker') {
			return res.status(403).json({ error: 'Нет доступа' })
		}

		const userId = req.user.userId
		const {
			last_name,
			first_name,
			gender,
			age,
			city,
			education,
			about,
			profession,
			job_position,
			skills,
			resume,
		} = req.body

		// Проверим, существует ли уже профиль
		const existing = await pool.query(
			'SELECT user_id FROM job_seeker_profiles WHERE user_id = $1',
			[userId]
		)

		if (existing.rows.length === 0) {
			// Если профиля нет — создаём
			const insertQuery = `
        INSERT INTO job_seeker_profiles (
          user_id, last_name, first_name, gender, age, city, education,
          about, profession, job_position, skills, resume
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
      `
			const { rows } = await pool.query(insertQuery, [
				userId,
				last_name,
				first_name,
				gender,
				age,
				city,
				education,
				about,
				profession,
				job_position,
				skills,
				resume,
			])
			return res.status(201).json(rows[0])
		} else {
			// Если профиль есть — обновляем
			const updateQuery = `
        UPDATE job_seeker_profiles
           SET last_name = $2,
               first_name = $3,
               gender = $4,
               age = $5,
               city = $6,
               education = $7,
               about = $8,
               profession = $9,
               job_position = $10,
               skills = $11,
               resume = $12
         WHERE user_id = $1
        RETURNING *;
      `
			const { rows } = await pool.query(updateQuery, [
				userId,
				last_name,
				first_name,
				gender,
				age,
				city,
				education,
				about,
				profession,
				job_position,
				skills,
				resume,
			])
			return res.json(rows[0])
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Ошибка при сохранении профиля' })
	}
})

/* 
  ========================
  Маршруты для работодателей
  ========================
*/

/**
 * Получить профиль работодателя (GET /api/profiles/employer)
 */
router.get('/employer', authenticateToken, async (req, res) => {
	try {
		if (req.user.role !== 'employer') {
			return res.status(403).json({ error: 'Нет доступа' })
		}

		const userId = req.user.userId
		const { rows } = await pool.query(
			`SELECT user_id, company_name, website, photo
         FROM employer_profiles
        WHERE user_id = $1`,
			[userId]
		)

		if (rows.length === 0) {
			return res.json(null)
		}

		res.json(rows[0])
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Ошибка при получении профиля работодателя' })
	}
})

/**
 * Создать (или обновить) профиль работодателя (POST /api/profiles/employer)
 */
router.post('/employer', authenticateToken, async (req, res) => {
	try {
		if (req.user.role !== 'employer') {
			return res.status(403).json({ error: 'Нет доступа' })
		}

		const userId = req.user.userId
		const { company_name, website, photo } = req.body

		// Проверим, существует ли уже профиль
		const existing = await pool.query(
			'SELECT user_id FROM employer_profiles WHERE user_id = $1',
			[userId]
		)

		if (existing.rows.length === 0) {
			// Создаём профиль
			const insertQuery = `
        INSERT INTO employer_profiles (user_id, company_name, website, photo)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `
			const { rows } = await pool.query(insertQuery, [
				userId,
				company_name,
				website,
				photo,
			])
			return res.status(201).json(rows[0])
		} else {
			// Обновляем профиль
			const updateQuery = `
        UPDATE employer_profiles
           SET company_name = $2,
               website = $3,
               photo = $4
         WHERE user_id = $1
        RETURNING *;
      `
			const { rows } = await pool.query(updateQuery, [
				userId,
				company_name,
				website,
				photo,
			])
			return res.json(rows[0])
		}
	} catch (error) {
		console.error(error)
		res
			.status(500)
			.json({ error: 'Ошибка при сохранении профиля работодателя' })
	}
})

module.exports = router
