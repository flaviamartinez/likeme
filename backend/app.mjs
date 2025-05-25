import cors from 'cors'
import pg from 'pg'
import express from 'express'

const { Pool } = pg
const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool (
	{
		host: 'localhost',
		user: 'postgres',
		password: 'postgres',
		database: 'likeme',
		allowExitOnIdle: true
	}
)

app.get('/posts', async (req, res) => {
	const query = "SELECT * FROM posts"
	const { rows }  = await pool.query(query)
	res.json(rows)
})

app.post('/posts', async (req, res) => {
	const query = 'INSERT INTO posts VALUES(DEFAULT, $1, $2, $3, 0)'
	const { titulo, url, descripcion } = req.body

	if (!titulo || !url || !descripcion) {
		return res.status(400).json({error: 'Todos los campos son obligatorios'})
	}

	const values = [titulo, url, descripcion]
	const result = await pool.query(query, values)
	res.send(result)
})

app.listen(3000, () => {
	console.log('Servidor corriendo en puerto 3000')
})