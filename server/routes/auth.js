const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const pool = require('../db.js')

require('dotenv').config()

const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET // Импортируем пул подключения

// Регистрация пользователя
router.post('/register', async (req, res) => {
	const { login, password, role } = req.body
	try {
		// Хэширование пароля
		const hashedPassword = await bcrypt.hash(password, 10)
		const result = await pool.query(
			'INSERT INTO users (login, password_hash, role) VALUES ($1, $2, $3) RETURNING id, login, role',
			[login, hashedPassword, role]
		)
		res.status(201).json(result.rows[0])
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Ошибка регистрации' })
	}
})

// Вход пользователя
router.post('/login', async (req, res) => {
	const { login, password } = req.body
	try {
		const result = await pool.query('SELECT * FROM users WHERE login = $1', [
			login,
		])
		if (result.rows.length === 0) {
			return res.status(401).json({ error: 'Неверный логин или пароль' })
		}
		const user = result.rows[0]
		const match = await bcrypt.compare(password, user.password_hash)
		if (!match) {
			return res.status(401).json({ error: 'Неверный логин или пароль' })
		}
		// Генерация JWT-токена (секрет нужно хранить в переменных окружения)
		const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
			expiresIn: '1h',
		})
		res.json({ token })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Ошибка входа' })
	}
})

module.exports = router
