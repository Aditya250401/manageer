import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined')
	}

	try {
		//connect to mongoDb locally
		await mongoose.connect(process.env.MONGO_URI!)
		console.log('Connected to MongoDb')
	} catch (err) {
		console.error(err)
	}

	app.listen(3001, () => {
		;('lets go and Listen on port 3000!!!!!!!!')
	})
}

start()
