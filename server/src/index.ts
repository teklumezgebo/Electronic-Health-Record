import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth'
import patientRouter from './routes/patients'
import { authenticateToken } from './middleware/auth'

dotenv.config() // Load env variables into process.env

export const app = express() // Express API creation 

const PORT = process.env.PORT || 3001

// Config: parse request bodies as JSON, and allow client PORT 5173 to make requests
app.use((cors({ origin: 'http://localhost:5173' })))
app.use(express.json()) 

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'EHR server is running' })
})

app.use('/api/auth', authRouter)
app.use('/api/patients', patientRouter)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})