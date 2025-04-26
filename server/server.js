const express = require('express')
const cors = require('cors')
const pool = require('./db.js')

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Пример простого маршрута
app.get('/', (req, res) => {
	res.send('Сервер работает!')
})

// Подключение роутов (будем добавлять позже)
app.use('/api/auth', require('./routes/auth'))
app.use('/api/profiles', require('./routes/profiles'))
app.use('/api/employer', require('./routes/employer'))
app.use('/api/jobseeker', require('./routes/jobSeeker'))
app.use('/api/chats', require('./routes/chatMessages'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/professions', require('./routes/professions'))

app.listen(port, () => {
	console.log(`Сервер запущен на порту ${port}`)
})

// Экспорт пула для использования в других модулях
module.exports = pool
