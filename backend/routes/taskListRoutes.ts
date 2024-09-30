import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth } from '../middlewares/require-auth'
import { validateRequest } from '../middlewares/validate-request'
import { NotFoundError } from '../errors/not-found-error'
import { TaskList } from '../models/user'
import mongoose from 'mongoose'

const router = express.Router()

// Create a new TaskList
router.post(
	'/api/task-lists',
	requireAuth,
	[body('name').not().isEmpty().withMessage('Task list name is required')],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name } = req.body

		const taskList = TaskList.build({
			name,
			userId: req.currentUser!.id,
		})

		await taskList.save()

		res.status(201).send(taskList)
	}
)

// Get all TaskLists for a user
router.get(
	'/api/task-lists',
	requireAuth,
	async (req: Request, res: Response) => {
		const taskLists = await TaskList.find({
			userId: req.currentUser!.id,
		})

		res.send(taskLists)
	}
)

// Get a specific TaskList by ID
router.get(
	'/api/task-lists/:id',
	requireAuth,
	async (req: Request, res: Response) => {
		const taskList = await TaskList.findOne({
			_id: req.params.id,
			userId: req.currentUser!.id,
		}).populate('tasks')

		if (!taskList) {
			throw new NotFoundError()
		}

		res.send(taskList)
	}
)

// Delete a TaskList
router.delete(
	'/api/task-lists/:id',
	requireAuth,
	async (req: Request, res: Response) => {
		const taskList = await TaskList.findOneAndDelete({
			_id: req.params.id,
			userId: req.currentUser!.id,
		})

		if (!taskList) {
			throw new NotFoundError()
		}

		res.status(204).send(taskList)
	}
)

export { router as taskListRouter }
