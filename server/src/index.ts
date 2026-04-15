import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth'

dotenv.config()

export const app = express()

const PORT = process.env.PORT || 3001

app.use((cors({ origin: 'http://localhost:5173' })))
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'EHR server is running' })
})

app.use('/api/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})