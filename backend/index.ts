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
		await mongoose.connect(
			'mongodb+srv://adi25:gevdoz-buskyd-xecKa5@cluster1.joivn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'
		)
		console.log('Connected to MongoDb')
	} catch (err) {
		console.error(err)
	}

	app.listen(3001, () => {
		;('lets go and Listen on port 3000!!!!!!!!')
	})
}

start()
