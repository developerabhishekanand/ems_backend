// index.js
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import expenseRoutes from './routes/expenseRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)

app.listen(5000, () => console.log('Server running on port 5000'))
