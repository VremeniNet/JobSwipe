const { Pool } = require('pg')

const pool = new Pool({
	user: 'postgres', // Замените на своего пользователя
	host: 'localhost', // Хост базы данных
	database: 'job_service', // Имя базы данных
	password: 'qweasd2376',
	port: 5432, // Порт PostgreSQL
})

module.exports = pool
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJqb2Jfc2Vla2VyIiwiaWF0IjoxNzQxNTM3NTY3LCJleHAiOjE3NDE1NDExNjd9.ggeUs25acIUCFQfTeXHl8PVzXWV7cLe0T1Tyr1p5uJc
