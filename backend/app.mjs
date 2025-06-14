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
	try {
		const query = "SELECT * FROM posts"
		const { rows }  = await pool.query(query)
		res.json(rows)
	} catch (error) {
		res.status(500).send(error)
	}
})

app.post('/posts', async (req, res) => {
	try {
		const query = 'INSERT INTO posts VALUES(DEFAULT, $1, $2, $3, 0)'
		const { titulo, url, descripcion } = req.body
	
		if (!titulo || !url || !descripcion) {
			return res.status(400).json({error: 'Todos los campos son obligatorios'})
		}
	
		const values = [titulo, url, descripcion]
		const result = await pool.query(query, values)
		res.send(result)
	} catch (error) {
		res.status(500).send(error)
	}
})

app.put('/posts/like/:id', async(req, res) => {
	try {
		const { id } = req.params
		const query = 'UPDATE posts SET likes = likes + 1 WHERE id = $1'
		const values = [id]
		const result = await pool.query(query, values)
		res.json(result)
	} catch (error) {
		res.status(500).send(error)
	}
})

app.delete('/posts/:id', async(req, res) => {
	try {
		const { id } = req.params
		const query = 'DELETE FROM posts WHERE id = $1'
		const values = [id]
		const result = await pool.query(query, values)
		res.json(result)
	} catch (error) {
		res.status(500).send(error)
	}
})

app.listen(3000, () => {
	console.log('Servidor corriendo en puerto 3000')
})