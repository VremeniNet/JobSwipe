const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const pool = require('../db.js')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

// Регистрация пользователя
router.post('/register', async (req, res) => {
	const { email, password, role } = req.body

	try {
		const hashedPassword = await bcrypt.hash(password, 10)

		// Создание пользователя
		const result = await pool.query(
			'INSERT INTO users (login, password_hash, role) VALUES ($1, $2, $3) RETURNING id, login, role',
			[email, hashedPassword, role]
		)

		const newUser = result.rows[0]

		// Генерация токена
		const token = jwt.sign(
			{ userId: newUser.id, role: newUser.role },
			JWT_SECRET,
			{ expiresIn: '1h' }
		)

		res.status(201).json({ token, user: newUser })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Ошибка регистрации' })
	}
})

// Вход пользователя
router.post('/login', async (req, res) => {
	const { email, password } = req.body

	try {
		const result = await pool.query('SELECT * FROM users WHERE login = $1', [
			email,
		])

		if (result.rows.length === 0) {
			return res.status(401).json({ error: 'Неверный логин или пароль' })
		}

		const user = result.rows[0]
		const match = await bcrypt.compare(password, user.password_hash)

		if (!match) {
			return res.status(401).json({ error: 'Неверный логин или пароль' })
		}

		const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
			expiresIn: '1h',
		})

		res.json({
			token,
			user: { id: user.id, login: user.login, role: user.role },
		})
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Ошибка входа' })
	}
})

module.exports = router
