const express = require('express')
const router = express.Router()
const pool = require('../db.js') // Пул подключения к базе данных
const authenticateToken = require('../middleware/authenticateToken')

/**
 * Получить список сообщений для конкретного чата
 * GET /api/chats/:chatId/messages
 */
router.get('/:chatId/messages', authenticateToken, async (req, res) => {
	const chatId = req.params.chatId
	const userId = req.user.userId

	try {
		// Проверяем, что чат существует и пользователь в нём участвует
		const chatResult = await pool.query('SELECT * FROM chats WHERE id = $1', [
			chatId,
		])

		if (chatResult.rows.length === 0) {
			return res.status(404).json({ error: 'Чат не найден' })
		}

		const chat = chatResult.rows[0]
		// Проверяем, что пользователь является участником чата (либо соискатель, либо работодатель)
		if (chat.job_seeker_id !== userId && chat.employer_id !== userId) {
			return res.status(403).json({ error: 'Нет доступа к данному чату' })
		}

		// Получаем сообщения, отсортированные по дате
		const messagesResult = await pool.query(
			'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
			[chatId]
		)
		res.json(messagesResult.rows)
	} catch (error) {
		console.error('Ошибка при получении сообщений чата:', error)
		res.status(500).json({ error: 'Ошибка при получении сообщений' })
	}
})

/**
 * Отправить сообщение в чат
 * POST /api/chats/:chatId/messages
 * Тело запроса: { message }
 */
router.post('/:chatId/messages', authenticateToken, async (req, res) => {
	const chatId = req.params.chatId
	const userId = req.user.userId
	const { message } = req.body

	try {
		// Проверяем, что чат существует и пользователь в нём участвует
		const chatResult = await pool.query('SELECT * FROM chats WHERE id = $1', [
			chatId,
		])

		if (chatResult.rows.length === 0) {
			return res.status(404).json({ error: 'Чат не найден' })
		}

		const chat = chatResult.rows[0]
		if (chat.job_seeker_id !== userId && chat.employer_id !== userId) {
			return res.status(403).json({ error: 'Нет доступа к данному чату' })
		}

		// Вставляем новое сообщение в таблицу messages
		const insertResult = await pool.query(
			`INSERT INTO messages (chat_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
			[chatId, userId, message]
		)
		res.status(201).json(insertResult.rows[0])
	} catch (error) {
		console.error('Ошибка при отправке сообщения:', error)
		res.status(500).json({ error: 'Ошибка при отправке сообщения' })
	}
})

module.exports = router
