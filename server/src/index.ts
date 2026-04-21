import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth'
import patientsRouter from './routes/patients'
import diagnosesRouter from './routes/diagnoses'
import notesRouter from './routes/notes'
import medicationsRouter from './routes/medications'
import allergiesRouter from './routes/allergies'
import summaryRouter from './routes/summary'

// Load env variables into process.env, Express API creation, and establish specific port
dotenv.config() 
export const app = express()
const PORT = process.env.PORT || 3001

// Config: parse request bodies as JSON, and allow client PORT 5173 to make requests
app.use((cors({ origin: 'http://localhost:5173' })))
app.use(express.json()) 

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EHR server is running' })
})

// Routes
app.use('/api/auth', authRouter)
app.use('/api/patients', patientsRouter)
app.use('/api/patients/:patientId/notes', notesRouter)
app.use('/api/patients/:patientId/diagnoses', diagnosesRouter)
app.use('/api/patients/:patientId/medications', medicationsRouter)
app.use('/api/patients/:patientId/allergies', allergiesRouter)
app.use('/api/patients/', summaryRouter)

// Boot up API
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})