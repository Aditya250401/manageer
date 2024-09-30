import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	useSensor,
	useSensors,
	KeyboardSensor,
	Announcements,
	UniqueIdentifier,
	TouchSensor,
	MouseSensor,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cva } from 'class-variance-authority'
import { GripVertical } from 'lucide-react'
import {
	Card,
	CardContent,
	CardHeader,
} from '@/components/components-kanban/ui/card'
import { Button } from '@/components/components-kanban/ui/button'
import { Badge } from './ui/badge'
import { hasDraggableData } from './utils'
import { coordinateGetter } from './multipleContainersKeyboardPreset'

// TaskCard component
export interface Task {
	id: UniqueIdentifier
	columnId: ColumnId
	content: string
}

export type TaskType = 'Task'

export interface TaskDragData {
	type: TaskType
	task: Task
}

interface TaskCardProps {
	task: Task
	isOverlay?: boolean
}

function TaskCard({ task, isOverlay }: TaskCardProps) {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: 'Task',
			task,
		} satisfies TaskDragData,
		attributes: {
			roleDescription: 'Task',
		},
	})

	const style = {
		transition,
		transform: CSS.Translate.toString(transform),
	}

	const variants = cva('', {
		variants: {
			dragging: {
				over: 'ring-2 opacity-30',
				overlay: 'ring-2 ring-primary',
			},
		},
	})

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={variants({
				dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
			})}
		>
			<CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
				<Button
					variant={'ghost'}
					{...attributes}
					{...listeners}
					className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
				>
					<span className="sr-only">Move task</span>
					<GripVertical />
				</Button>
				<Badge variant={'outline'} className="ml-auto font-semibold">
					Task
				</Badge>
			</CardHeader>
			<CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
				{task.content}
			</CardContent>
		</Card>
	)
}

// KanbanBoard component
const defaultCols = [
	{ id: 'todo' as const, title: 'Todo' },
	{ id: 'in-progress' as const, title: 'In progress' },
	{ id: 'done' as const, title: 'Done' },
] satisfies Column[]

export type ColumnId = (typeof defaultCols)[number]['id']

const initialTasks: Task[] = [
	{ id: 'task1', columnId: 'done', content: 'Project initiation and planning' },
	{
		id: 'task2',
		columnId: 'done',
		content: 'Gather requirements from stakeholders',
	},
	{ id: 'task3', columnId: 'done', content: 'Create wireframes and mockups' },
	{ id: 'task4', columnId: 'in-progress', content: 'Develop homepage layout' },
	{
		id: 'task5',
		columnId: 'in-progress',
		content: 'Design color scheme and typography',
	},
	{ id: 'task6', columnId: 'todo', content: 'Implement user authentication' },
	{ id: 'task7', columnId: 'todo', content: 'Build contact us page' },
	{ id: 'task8', columnId: 'todo', content: 'Create product catalog' },
	{ id: 'task9', columnId: 'todo', content: 'Develop about us page' },
	{
		id: 'task10',
		columnId: 'todo',
		content: 'Optimize website for mobile devices',
	},
	{ id: 'task11', columnId: 'todo', content: 'Integrate payment gateway' },
	{ id: 'task12', columnId: 'todo', content: 'Perform testing and bug fixing' },
	{
		id: 'task13',
		columnId: 'todo',
		content: 'Launch website and deploy to server',
	},
]

export function KanbanBoard() {
	const [columns, setColumns] = useState<Column[]>(defaultCols)
	const pickedUpTaskColumn = useRef<ColumnId | null>(null)
	const columnsId = useMemo(() => columns.map((col) => col.id), [columns])
	const [tasks, setTasks] = useState<Task[]>(initialTasks)
	const [activeColumn, setActiveColumn] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, { coordinateGetter })
	)

	const announcements: Announcements = {
		onDragStart({ active }) {
			if (!hasDraggableData(active)) return
			if (active.data.current?.type === 'Column') {
				const startColumnIdx = columnsId.findIndex((id) => id === active.id)
				const startColumn = columns[startColumnIdx]
				return `Picked up Column ${startColumn?.title} at position: ${
					startColumnIdx + 1
				} of ${columnsId.length}`
			} else if (active.data.current?.type === 'Task') {
				pickedUpTaskColumn.current = active.data.current.task.columnId
				const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
					active.id,
					pickedUpTaskColumn.current
				)
				return `Picked up Task ${
					active.data.current.task.content
				} at position: ${taskPosition + 1} of ${
					tasksInColumn.length
				} in column ${column?.title}`
			}
		},
		// Handle Drag Over and End
	}

	return (
		<DndContext
			accessibility={{ announcements }}
			sensors={sensors}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onDragOver={onDragOver}
		>
			<BoardContainer>
				<SortableContext items={columnsId}>
					{columns.map((col) => (
						<BoardColumn
							key={col.id}
							column={col}
							tasks={tasks.filter((task) => task.columnId === col.id)}
						/>
					))}
				</SortableContext>
			</BoardContainer>

			{'document' in window &&
				createPortal(
					<DragOverlay>
						{activeColumn && (
							<BoardColumn
								isOverlay
								column={activeColumn}
								tasks={tasks.filter(
									(task) => task.columnId === activeColumn.id
								)}
							/>
						)}
						{activeTask && <TaskCard task={activeTask} isOverlay />}
					</DragOverlay>,
					document.body
				)}
		</DndContext>
	)

	function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
		const tasksInColumn = tasks.filter((task) => task.columnId === columnId)
		const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId)
		const column = columns.find((col) => col.id === columnId)
		return { tasksInColumn, taskPosition, column }
	}

	function onDragStart(event: DragStartEvent) {
		if (!hasDraggableData(event.active)) return
		const data = event.active.data.current
		if (data?.type === 'Column') {
			setActiveColumn(data.column)
			return
		}
		if (data?.type === 'Task') {
			setActiveTask(data.task)
			return
		}
	}

	function onDragEnd(event: DragEndEvent) {
		setActiveColumn(null)
		setActiveTask(null)

		const { active, over } = event
		if (!over) return

		const activeId = active.id
		const overId = over.id

		if (!hasDraggableData(active)) return

		const activeData = active.data.current

		if (activeId === overId) return

		const isActiveAColumn = activeData?.type === 'Column'
		if (!isActiveAColumn) return

		setColumns((columns) => {
			const activeColumnIndex = columns.findIndex((col) => col.id === activeId)
			const overColumnIndex = columns.findIndex((col) => col.id === overId)
			return arrayMove(columns, activeColumnIndex, overColumnIndex)
		})
	}

	function onDragOver(event: DragOverEvent) {
		const { active, over } = event
		if (!over) return

		const activeId = active.id
		const overId = over.id

		if (activeId === overId) return

		if (!hasDraggableData(active) || !hasDraggableData(over)) return

		const activeData = active.data.current
		const overData = over.data.current

		const isActiveATask = activeData?.type === 'Task'
		const isOverATask = overData?.type === 'Task'

		if (isActiveATask && isOverATask) {
			setTasks((tasks) => {
				const oldColumnId = activeData.task.columnId
				const newColumnId = overData.task.columnId

				const activeTasks = tasks.filter(
					(task) => task.columnId === oldColumnId
				)
				const overTasks = tasks.filter((task) => task.columnId === newColumnId)

				const activeIndex = activeTasks.findIndex(
					(task) => task.id === activeId
				)
				const overIndex = overTasks.findIndex((task) => task.id === overId)

				const movedTask = activeTasks[activeIndex]
				if (oldColumnId !== newColumnId) {
					// Task is moved to a different column
					movedTask.columnId = newColumnId
					return arrayMove(tasks, activeIndex, overIndex)
				}

				return arrayMove(tasks, activeIndex, overIndex)
			})
		}
	}
}

// Board Container
const BoardContainer = ({ children }) => (
	<div className="kanban-board grid grid-cols-3 gap-2">{children}</div>
)

// BoardColumn
const BoardColumn = ({ column, tasks, isOverlay }) => (
	<div className="bg-secondary rounded-md px-2 pb-4">
		<h2 className="text-lg font-semibold mb-4">{column.title}</h2>
		<SortableContext items={tasks.map((task) => task.id)}>
			{tasks.map((task) => (
				<TaskCard key={task.id} task={task} isOverlay={isOverlay} />
			))}
		</SortableContext>
	</div>
)

export interface Column {
	id: ColumnId
	title: string
}

export default KanbanBoard
