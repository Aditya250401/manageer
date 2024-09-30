import * as z from 'zod'

export const UserValidation = z.object({
	name: z
		.string()
		.min(3, 'Minimum 3 characters.')
		.max(30, 'Maximum 30 characters.'),
	email: z.string().email('Invalid email').min(1, 'Email is required'),

	password: z.string().min(4).optional(),
})

export const UserLoginValidation = z.object({
	email: z.string().email('Invalid email').min(1, 'Email is required'),
	password: z.string().min(4),
})
