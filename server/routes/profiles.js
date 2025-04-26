const express = require('express')
const router = express.Router()
const pool = require('../db.js') // Пул подключения к PostgreSQL
const authenticateToken = require('../middleware/authenticateToken')
// ↑ Это middleware для проверки JWT
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() }) // или на диск, если хочешь

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
		if (req.user.role !== 'job_seeker') {
			return res.status(403).json({ error: 'Нет доступа' })
		}

		const userId = req.user.userId
		const { rows } = await pool.query(
			`SELECT user_id, last_name, first_name, birth_date, city, education,
              about, profession, job_position, skills, resume, photo
         FROM job_seeker_profiles
        WHERE user_id = $1`,
			[userId]
		)

		if (rows.length === 0) return res.json(null)
		res.json(rows[0])
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Ошибка при получении профиля' })
	}
})

/**
 * Создать (или обновить) профиль соискателя (POST /api/profiles/jobSeeker)
 */
router.post(
	'/jobSeeker',
	authenticateToken,
	upload.fields([
		{ name: 'photo', maxCount: 1 },
		{ name: 'resume', maxCount: 1 },
	]),
	async (req, res) => {
		try {
			if (req.user.role !== 'job_seeker') {
				return res.status(403).json({ error: 'Нет доступа' })
			}

			const userId = req.user.userId
			const {
				last_name,
				first_name,
				birth_date,
				city,
				education,
				about,
				profession,
				job_position,
				skills,
				experience,
			} = req.body

			const resumeFile = req.files?.resume?.[0] || null
			const photoFile = req.files?.photo?.[0] || null

			const existing = await pool.query(
				'SELECT user_id FROM job_seeker_profiles WHERE user_id = $1',
				[userId]
			)

			if (existing.rows.length === 0) {
				const insertQuery = `
        INSERT INTO job_seeker_profiles (
          user_id, last_name, first_name, birth_date, city, education,
          about, profession, job_position, skills, experience, resume, photo
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *;
      `
				const { rows } = await pool.query(insertQuery, [
					userId,
					last_name,
					first_name,
					birth_date,
					city,
					education,
					about,
					profession,
					job_position,
					skills,
					experience,
					resumeFile ? resumeFile.buffer : null,
					photoFile ? photoFile.buffer : null,
				])
				return res.status(201).json(rows[0])
			} else {
				const updateQuery = `
        UPDATE job_seeker_profiles
           SET last_name = $2,
               first_name = $3,
               birth_date = $4,
               city = $5,
               education = $6,
               about = $7,
               profession = $8,
               job_position = $9,
               skills = $10,
               experience = $11,
               resume = $12,
               photo = $13
         WHERE user_id = $1
        RETURNING *;
      `
				const { rows } = await pool.query(updateQuery, [
					userId,
					last_name,
					first_name,
					birth_date,
					city,
					education,
					about,
					profession,
					job_position,
					skills,
					experience,
					resumeFile ? resumeFile.buffer : null,
					photoFile ? photoFile.buffer : null,
				])
				return res.json(rows[0])
			}
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Ошибка при сохранении профиля' })
		}
	}
)
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

		if (rows.length === 0) return res.json(null)
		res.json(rows[0])
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Ошибка при получении профиля работодателя' })
	}
})

/**
 * Создать (или обновить) профиль работодателя (POST /api/profiles/employer)
 */

router.post(
	'/employer',
	authenticateToken,
	upload.fields([{ name: 'photo', maxCount: 1 }]), // <-- исправляем на fields
	async (req, res) => {
		try {
			if (req.user.role !== 'employer') {
				return res.status(403).json({ error: 'Нет доступа' })
			}

			const userId = req.user.userId
			const { company_name, website } = req.body
			const photoBuffer = req.files.photo ? req.files.photo[0].buffer : null

			// Проверка: обязательно должно быть company_name
			if (!company_name || !company_name.trim()) {
				return res.status(400).json({ error: 'Название компании обязательно' })
			}

			const existing = await pool.query(
				'SELECT user_id FROM employer_profiles WHERE user_id = $1',
				[userId]
			)

			if (existing.rows.length === 0) {
				const insertQuery = `
					INSERT INTO employer_profiles (user_id, company_name, website, photo)
					VALUES ($1, $2, $3, $4)
					RETURNING *;
				`
				const { rows } = await pool.query(insertQuery, [
					userId,
					company_name,
					website,
					photoBuffer,
				])
				return res.status(201).json(rows[0])
			} else {
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
					photoBuffer,
				])
				return res.json(rows[0])
			}
		} catch (error) {
			console.error('Ошибка при сохранении профиля работодателя:', error)
			res
				.status(500)
				.json({ error: 'Ошибка при сохранении профиля работодателя' })
		}
	}
)

module.exports = router
