import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { User } from '../models/user' // Importing the User model
import { validateRequest } from '../middlewares/validate-request'
import { BadRequestError } from '../errors/bad-request-error'
import { Password } from '../models/user' // Importing the Password service
import { currentUser } from '../middlewares/current-user'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, async (req, res) => {
	const user = await User.findOne({ email: req.currentUser?.email })
	res.send({ currentUser: user ? user : null })
})

router.post(
	'/api/users/signup',
	[
		body('username').trim().notEmpty().withMessage('Username is required'),
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { username, email, password } = req.body // Include username

		const existingUser = await User.findOne({ email })

		if (existingUser) {
			throw new BadRequestError('Email in use')
		}

		const user = User.build({ username, email, password }) // Include username
		await user.save()

		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
				username: user.username, // Include username in JWT if needed
			},
			process.env.JWT_KEY!
		)

		req.session = {
			jwt: userJwt,
		}

		res.status(201).send(user)
	}
)

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.notEmpty()
			.withMessage('You must supply a password'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body
		const existingUser = await User.findOne({ email })

		if (!existingUser) {
			throw new BadRequestError('Invalid credentials')
		}

		const passwordsMatch = await Password.compare(
			existingUser.password,
			password
		)

		if (!passwordsMatch) {
			throw new BadRequestError('Invalid credentials')
		}

		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
				username: existingUser.username, // Include username in JWT if needed
			},
			process.env.JWT_KEY!
		)

		req.session = {
			jwt: userJwt,
		}

		res.status(200).send(existingUser)
	}
)

router.post('/api/users/signout', (req: Request, res: Response) => {
	req.session = null
	res.send({})
})

export { router as userRoutes }
