import mongoose from 'mongoose'
import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'
import { TaskDoc } from './task'

const scryptAsync = promisify(scrypt)

export class Password {
	static async toHash(password: string) {
		const salt = randomBytes(8).toString('hex')
		const buf = (await scryptAsync(password, salt, 64)) as Buffer

		return `${buf.toString('hex')}.${salt}`
	}

	static async compare(storedPassword: string, suppliedPassword: string) {
		const [hashedPassword, salt] = storedPassword.split('.')
		const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

		return buf.toString('hex') === hashedPassword
	}
}

// TaskList Schema
interface TaskListAttrs {
	name: string
	userId:String
	tasks?: TaskDoc[]
}

interface TaskListDoc extends mongoose.Document {
	name: string
	userId: String
	tasks: TaskDoc[]
}

interface TaskListModel extends mongoose.Model<TaskListDoc> {
	build(attrs: TaskListAttrs): TaskListDoc
}

const taskListSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		userId: {
			type: String,
			ref: 'User',
			required: true,
		},
		tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
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

taskListSchema.statics.build = (attrs: TaskListAttrs) => {
	return new TaskList(attrs)
}

const TaskList = mongoose.model<TaskListDoc, TaskListModel>(
	'TaskList',
	taskListSchema
)

// User Schema
interface UserAttrs {
	username: string
	email: string
	password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc
}

interface UserDoc extends mongoose.Document {
	username: string
	email: string
	password: string
	taskLists: TaskListDoc[]
}

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		taskLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskList' }],
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.password
				delete ret.__v
			},
		},
	}
)

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'))
		this.set('password', hashed)
	}
	done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User, TaskList, TaskListDoc, TaskListAttrs }
