const jwt = require('jsonwebtoken')

// В реальном проекте секрет лучше брать из .env
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

module.exports = function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if (!token) return res.status(401).json({ error: 'Токен не найден' })

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ error: 'Невалидный токен' })
		req.user = user
		next()
	})
}
