const express = require('express')
const router = express.Router()
const pool = require('../db.js')

// Получить все профессии
router.get('/', async (req, res) => {
	try {
		const result = await pool.query(
			'SELECT * FROM professions ORDER BY name ASC'
		)
		res.json(result.rows)
	} catch (error) {
		console.error('Ошибка при получении профессий:', error)
		res.status(500).json({ error: 'Ошибка при получении профессий' })
	}
})

// Получить должности для конкретной профессии
router.get('/:id/positions', async (req, res) => {
	const professionId = req.params.id
	try {
		const result = await pool.query(
			'SELECT * FROM positions WHERE profession_id = $1 ORDER BY name ASC',
			[professionId]
		)
		res.json(result.rows)
	} catch (error) {
		console.error('Ошибка при получении должностей:', error)
		res.status(500).json({ error: 'Ошибка при получении должностей' })
	}
})

// Получить навыки для конкретной профессии
router.get('/:id/skills', async (req, res) => {
	const professionId = req.params.id
	try {
		const result = await pool.query(
			'SELECT * FROM skills WHERE profession_id = $1 ORDER BY name ASC',
			[professionId]
		)
		res.json(result.rows)
	} catch (error) {
		console.error('Ошибка при получении навыков:', error)
		res.status(500).json({ error: 'Ошибка при получении навыков' })
	}
})

module.exports = router
