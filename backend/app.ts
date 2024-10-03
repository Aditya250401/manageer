import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import cors from 'cors'

import { currentUser } from './middlewares/current-user'
import { userRoutes } from './routes/userRoutes'
import { taskListRouter } from './routes/taskListRoutes'
import { taskRouter } from './routes/taskRoutes'

import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
	cors({
		origin: 'https://manageer-zgig.vercel.app',
		credentials: true,
	})
)
app.use(
	cookieSession({
		signed: false,
		secure: true,
		sameSite: 'none',
	})
)
//default welcome message
app.get('/', (req, res) => {
	res.send('Welcome to Manageer API')
})
app.use(userRoutes)
app.use(currentUser)
app.use(taskListRouter)
app.use(taskRouter)

app.all('*', async (req, res) => {
	throw new NotFoundError()
})

app.use(errorHandler)

export { app }
