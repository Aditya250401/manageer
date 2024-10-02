import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middlewares/validate-request'
import { BadRequestError } from '../errors/bad-request-error'
import { TaskList } from '../models/user' // Importing the TaskList model
import { Task } from '../models/task' // Importing the Task model
import { requireAuth } from '../middlewares/require-auth'
import { NotFoundError } from '../errors/not-found-error'
import { TaskDoc } from '../models/task'

const router = express.Router()

import mongoose from 'mongoose'

// Create a new Task
router.post(
	'/api/tasks',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('status')
			.isIn(['To Do', 'In Progress', 'Completed'])
			.withMessage('Status must be To Do, In Progress, or Completed'),
		body('priority')
			.isIn(['Low', 'Medium', 'High'])
			.withMessage('Priority must be Low, Medium, or High'),
		body('taskListId').not().isEmpty().withMessage('Task list ID is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, description, status, priority, dueDate, taskListId } =
			req.body

		// Verify that the TaskList exists and belongs to the current user
		const taskList = await TaskList.findOne({
			_id: taskListId,
			userId: req.currentUser!.id,
		})

		if (!taskList) {
			throw new BadRequestError(
				'Task list not found or does not belong to the user'
			)
		}

		const task = Task.build({
			title,
			description,
			status,
			priority,
			dueDate,
			userId: req.currentUser!.id,
			taskListId,
		})

		await task.save()

		// Add the task to the TaskList's tasks array
		taskList.tasks.push(task)
		await taskList.save()

		res.status(201).send(task)
	}
)

// Get all Tasks for a user in a specific TaskList
router.get('/api/tasks', requireAuth, async (req: Request, res: Response) => {
	const { taskListId } = req.query

	// Validate taskListId
	if (!taskListId || !mongoose.Types.ObjectId.isValid(taskListId as string)) {
		throw new BadRequestError('Task list ID must be provided and valid')
	}

	const tasks = await Task.find({ taskListId, userId: req.currentUser!.id })

	res.send(tasks)
})

// Get a specific Task by ID
router.get(
	'/api/tasks/:id',
	requireAuth,
	async (req: Request, res: Response) => {


		const task = await Task.findOne({
			_id: req.params.id,
			userId: req.currentUser!.id,
		})


		if (!task) {
			throw new NotFoundError()
		}

		res.send(task)
	}
)

// Update a Task
router.put(
	'/api/tasks/:id',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('status')
			.isIn(['To Do', 'In Progress', 'Completed'])
			.withMessage('Status must be To Do, In Progress, or Completed'),
		body('priority')
			.isIn(['Low', 'Medium', 'High'])
			.withMessage('Priority must be Low, Medium, or High'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, description, status, priority, dueDate } = req.body

		const task = await Task.findOne({
			_id: req.params.id,
			userId: req.currentUser!.id,
		})

		if (!task) {
			throw new NotFoundError()
		}

		task.set({
			title,
			description,
			status,
			priority,
			dueDate,
		})

		await task.save()

		res.send(task)
	}
)

// Delete a Task
router.delete(
	'/api/tasks/:id',
	requireAuth,
	async (req: Request, res: Response) => {
		const task = (await Task.findByIdAndDelete({
			_id: req.params.id,
			userId: req.currentUser!.id,
		})) as TaskDoc | null // Assert the type here if needed

		if (!task) {
			throw new NotFoundError()
		}

		// Remove the task from the associated TaskList's tasks array
		await TaskList.updateOne(
			{ _id: task.taskListId, userId: req.currentUser!.id },
			{ $pull: { tasks: task._id } }
		)

		res.status(204).send() // 204 No Content, usually you don't send any body
	}
)

export { router as taskRouter }
