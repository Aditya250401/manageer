import mongoose from 'mongoose'

// Task Schema
interface TaskAttrs {
	title: string
	description?: string
	status: 'To Do' | 'In Progress' | 'Completed'
	priority: 'Low' | 'Medium' | 'High'
	dueDate?: Date
	userId: String // Reference to the User
	taskListId: mongoose.Schema.Types.ObjectId // Reference to the Task List
}

interface TaskDoc extends mongoose.Document {
	title: string
	description?: string
	status: 'To Do' | 'In Progress' | 'Completed'
	priority: 'Low' | 'Medium' | 'High'
	dueDate?: Date
	userId: String
	taskListId: mongoose.Schema.Types.ObjectId
}

interface TaskModel extends mongoose.Model<TaskDoc> {
	build(attrs: TaskAttrs): TaskDoc
}

const taskSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		status: {
			type: String,
			enum: ['To Do', 'In Progress', 'Completed'],
			required: true,
		},
		priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
		dueDate: { type: Date },
		userId: {
			type: String,
			ref: 'User',
			required: true,
		},
		taskListId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'TaskList',
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.__v
			},
		},
	}
)

taskSchema.statics.build = (attrs: TaskAttrs) => {
	return new Task(attrs)
}

const Task = mongoose.model<TaskDoc, TaskModel>('Task', taskSchema)

export { Task, TaskDoc, TaskAttrs }
