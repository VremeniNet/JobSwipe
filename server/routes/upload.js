const express = require('express')
const multer = require('multer')
const router = express.Router()
const authenticateToken = require('../middleware/authenticateToken')

// Настраиваем multer для хранения файлов в папке "uploads/"
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/') // Убедитесь, что папка существует или создайте её
	},
	filename: (req, file, cb) => {
		// Формируем уникальное имя файла, используя метку времени
		cb(null, Date.now() + '-' + file.originalname)
	},
})
const upload = multer({ storage })

// Эндпоинт для загрузки резюме (только для соискателей)
// Ожидается, что файл передается под ключом "resume"
router.post(
	'/resume',
	authenticateToken,
	upload.single('resume'),
	(req, res) => {
		if (req.user.role !== 'job_seeker') {
			return res
				.status(403)
				.json({ error: 'Доступ разрешён только для соискателей.' })
		}
		// Здесь можно сохранить путь к файлу в базе данных для профиля соискателя
		res.json({ message: 'Резюме успешно загружено', file: req.file })
	}
)

// Эндпоинт для загрузки фото (только для работодателей)
// Ожидается, что файл передается под ключом "photo"
router.post('/photo', authenticateToken, upload.single('photo'), (req, res) => {
	if (req.user.role !== 'employer') {
		return res
			.status(403)
			.json({ error: 'Доступ разрешён только для работодателей.' })
	}
	// Здесь можно сохранить путь к файлу в базе данных для профиля работодателя
	res.json({ message: 'Фото успешно загружено', file: req.file })
})

module.exports = router
