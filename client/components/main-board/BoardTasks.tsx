'use client'
import { useAppDispatch, useDeleteTaskMutation } from '@/lib/redux/store'
import { setCurrentTaskId } from '@/lib/redux/slices/appSlice'
import { openEditTaskModal } from '@/lib/redux/slices/appSlice'

import * as React from 'react'
import { ListFilter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { format, addWeeks, addMonths, addYears } from 'date-fns'

interface Task {
	title: string
	description: string
	status: string
	priority: string
	dueDate: string // ISO date string
	userId: string
	taskListId: string
	id: string
}

interface TaskProps {
	tasks: Task[]
	currentBoardId: string
}

export function Dashboard({ tasks, currentBoardId }: TaskProps) {
	const Dispatch = useAppDispatch()

	const [deleteTask] = useDeleteTaskMutation()

	const handleDeleteTask = (taskId: string) => {
		deleteTask({
			id: taskId,
			taskListId: currentBoardId,
		})
	}

	function DropDownBox() {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
						<ListFilter className="h-3.5 w-3.5" />
						<span className="sr-only sm:not-sr-only">Filter</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Filter by</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem
						checked={priorityFilter.includes('Low')}
						onCheckedChange={() => togglePriorityFilter('Low')}
					>
						Low
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={priorityFilter.includes('Medium')}
						onCheckedChange={() => togglePriorityFilter('Medium')}
					>
						Medium
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={priorityFilter.includes('High')}
						onCheckedChange={() => togglePriorityFilter('High')}
					>
						High
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={statusFilter.includes('To Do')}
						onCheckedChange={() => toggleStatusFilter('To Do')}
					>
						To Do
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={statusFilter.includes('In Progress')}
						onCheckedChange={() => toggleStatusFilter('In Progress')}
					>
						In Progress
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={statusFilter.includes('Completed')}
						onCheckedChange={() => toggleStatusFilter('Completed')}
					>
						Completed
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}

	const [statusFilter, setStatusFilter] = React.useState<string[]>([])
	const [priorityFilter, setPriorityFilter] = React.useState<string[]>([])

	// Toggle Priority Filter
	const togglePriorityFilter = (priority: string) => {
		setPriorityFilter((prev) =>
			prev.includes(priority)
				? prev.filter((p) => p !== priority)
				: [...prev, priority]
		)
	}

	// Filter tasks by Priority
	const filterTasksByPriority = (tasks: Task[], priorityFilter: string[]) => {
		if (priorityFilter.length === 0) return tasks // No filter applied
		return tasks.filter((task) => priorityFilter.includes(task.priority))
	}

	// Filter tasks by Time Range (week, month, year)
	const filterTasksByTimeRange = (
		tasks: Task[],
		timeRange: 'week' | 'month' | 'year'
	) => {
		const now = new Date()
		let rangeEnd: Date

		if (timeRange === 'week') {
			rangeEnd = addWeeks(now, 1)
		} else if (timeRange === 'month') {
			rangeEnd = addMonths(now, 1)
		} else {
			rangeEnd = addYears(now, 1)
		}

		return tasks.filter((task) => {
			const taskDueDate = new Date(task.dueDate)
			return taskDueDate >= now && taskDueDate <= rangeEnd
		})
	}

	// Filter tasks by Status
	const filterTasksByStatus = (tasks: Task[], statusFilter: string[]) => {
		if (statusFilter.length === 0) return tasks // No filter applied
		return tasks.filter((task) => statusFilter.includes(task.status))
	}

	// Toggle Status Filter
	const toggleStatusFilter = (status: string) => {
		setStatusFilter((prev) =>
			prev.includes(status)
				? prev.filter((s) => s !== status)
				: [...prev, status]
		)
	}

	// Filter tasks that missed their due dates (Overdue)
	const filterTasksByOverdue = (tasks: Task[]) => {
		const now = new Date()
		return tasks.filter((task) => new Date(task.dueDate) < now)
	}

	// Render filtered tasks
	const renderTasks = (filteredTasks: Task[]) => {
		return (
			<TableBody>
				{filteredTasks.length > 0 ? (
					filteredTasks.map((task) => (
						<TableRow key={task.id}>
							<TableCell>
								<div className="font-medium">{task.title}</div>
							</TableCell>
							<TableCell className="hidden md:table-cell">
								{task.description}
							</TableCell>
							<TableCell className="hidden md:table-cell">
								{task.priority}
							</TableCell>
							<TableCell className="hidden md:table-cell">
								<Badge
									className={`hidden md:table-cell rounded-xl ${
										task.priority === 'High'
											? 'bg-red-100 text-black'
											: task.priority === 'Medium'
											? 'bg-yellow-100 text-black'
											: 'bg-green-100 text-black'
									}`}
								>
									{task.status}
								</Badge>
							</TableCell>
							<TableCell className="hidden md:table-cell">
								{format(new Date(task.dueDate), 'yyyy-MM-dd')}
							</TableCell>
							<TableCell className="text-right">
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										Dispatch(setCurrentTaskId(task.id))
										Dispatch(openEditTaskModal())
									}}
								>
									Edit
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleDeleteTask(task.id)}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={6} className="text-center">
							No tasks found for the selected filter.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		)
	}

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
					<div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
						<Tabs defaultValue="week">
							<div className="flex items-center">
								<TabsList>
									<TabsTrigger value="week">Week</TabsTrigger>
									<TabsTrigger value="month">Month</TabsTrigger>
									<TabsTrigger value="year">Year</TabsTrigger>
									<TabsTrigger value="overdue">Overdue</TabsTrigger>
								</TabsList>
								<div className="ml-auto flex items-center gap-2">
									<DropDownBox />
								</div>
							</div>

							{/* Week Tab */}
							<TabsContent value="week">
								<Card x-chunk="dashboard-06-chunk-0">
									<CardHeader>
										<CardTitle>Tasks</CardTitle>
										<CardDescription>
											Recent tasks based on due dates.
										</CardDescription>
									</CardHeader>
									<CardContent>
										{/* Updated Table component */}
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Title</TableHead>
													<TableHead className="hidden md:table-cell">
														Description
													</TableHead>
													<TableHead className="hidden sm:table-cell">
														Priority
													</TableHead>
													<TableHead className="hidden sm:table-cell">
														Status
													</TableHead>
													<TableHead className="hidden md:table-cell">
														Due Date
													</TableHead>
													<TableHead>
														<span className="sr-only">Actions</span>
													</TableHead>
												</TableRow>
											</TableHeader>

											{renderTasks(
												filterTasksByPriority(
													filterTasksByStatus(
														filterTasksByTimeRange(tasks, 'week'),
														statusFilter
													),
													priorityFilter
												)
											)}
										</Table>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Month Tab */}
							<TabsContent value="month">
								<Card>
									<CardHeader className="px-7">
										<CardTitle>Tasks</CardTitle>
										<CardDescription>
											Recent tasks based on due dates.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="w-full flex justify-center">
											<Table className="w-full max-w-5xl mx-auto overflow-x-auto">
												<TableHeader>
													<TableRow>
														<TableHead className="w-1/6">Title</TableHead>
														<TableHead className="hidden md:table-cell w-2/6">
															Description
														</TableHead>
														<TableHead className="hidden sm:table-cell w-1/6">
															Priority
														</TableHead>
														<TableHead className="hidden sm:table-cell w-1/6">
															Status
														</TableHead>
														<TableHead className="hidden md:table-cell w-1/6">
															Due Date
														</TableHead>
														<TableHead className="text-right w-1/6">
															Action
														</TableHead>
													</TableRow>
												</TableHeader>

												{renderTasks(
													filterTasksByPriority(
														filterTasksByStatus(
															filterTasksByTimeRange(tasks, 'month'),
															statusFilter
														),
														priorityFilter
													)
												)}
											</Table>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Year Tab */}
							<TabsContent value="year">
								<Card>
									<CardHeader className="px-7">
										<CardTitle>Tasks</CardTitle>
										<CardDescription>
											Recent tasks based on due dates.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="w-full flex justify-center">
											<Table className="w-full max-w-5xl mx-auto overflow-x-auto">
												<TableHeader>
													<TableRow>
														<TableHead className="w-1/6">Title</TableHead>
														<TableHead className="hidden md:table-cell w-2/6">
															Description
														</TableHead>
														<TableHead className="hidden sm:table-cell w-1/6">
															Priority
														</TableHead>
														<TableHead className="hidden sm:table-cell w-1/6">
															Status
														</TableHead>
														<TableHead className="hidden md:table-cell w-1/6">
															Due Date
														</TableHead>
														<TableHead className="text-right w-1/6">
															Action
														</TableHead>
													</TableRow>
												</TableHeader>

												{renderTasks(
													filterTasksByPriority(
														filterTasksByStatus(
															filterTasksByTimeRange(tasks, 'year'),
															statusFilter
														),
														priorityFilter
													)
												)}
											</Table>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Overdue Tab */}
							<TabsContent value="overdue">
								<Card>
									<CardHeader className="px-7">
										<CardTitle>Tasks</CardTitle>
										<CardDescription>
											Recent tasks based on due dates.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="w-full flex justify-center">
											<Table className="w-full max-w-5xl mx-auto overflow-x-auto">
												<TableHeader>
													<TableRow>
														<TableHead className="w-1/6">Title</TableHead>
														<TableHead className="hidden md:table-cell w-2/6">
															Description
														</TableHead>
														<TableHead className="hidden sm:table-cell w-1/6">
															Priority
														</TableHead>
														<TableHead className="hidden sm:table-cell w-1/6">
															Status
														</TableHead>
														<TableHead className="hidden md:table-cell w-1/6">
															Due Date
														</TableHead>
														<TableHead className="text-right w-1/6">
															Action
														</TableHead>
													</TableRow>
												</TableHeader>

												{renderTasks(filterTasksByOverdue(tasks))}
											</Table>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</main>
			</div>
		</div>
	)
}
