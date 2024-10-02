'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import { useAppDispatch, useAppSelector } from '@/lib/redux/store'
import {
	getAddTaskModalValue,
	closeAddTaskModal,
	getCurrentBoardId,
} from '@/lib/redux/slices/appSlice'

import { useAddTaskMutation } from '@/lib/redux/store'

import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

const statuses = [
	{ label: 'To Do', value: 'To Do' },
	{ label: 'In Progress', value: 'In Progress' },
	{ label: 'Completed', value: 'Completed' },
] as const

const priorities = [
	{ label: 'Low', value: 'Low' },
	{ label: 'Medium', value: 'Medium' },
	{ label: 'High', value: 'High' },
] as const

const taskFormSchema = z.object({
	title: z.string().min(1, {
		message: 'Title is required.',
	}),
	description: z.string().optional(),
	status: z.string(),
	priority: z.string(),
	dueDate: z.date().optional(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

export default function AddTaskDialog() {
	const dispatch = useAppDispatch()
	const isModalOpen = useAppSelector(getAddTaskModalValue)

	const closeModal = () => dispatch(closeAddTaskModal())
	const currentListId = useAppSelector(getCurrentBoardId)

	// Initialize the mutation hook at the top level
	const [addTask, results] = useAddTaskMutation()

	const form = useForm<TaskFormValues>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: {},
	})

	const onSubmit = (data: TaskFormValues, event: React.SyntheticEvent) => {
		event.preventDefault() // Prevent form default behavior

		if (!currentListId) {
			alert('Please select a board to add a task to.')
		}

		try {
			addTask({
				taskListId: currentListId,
				taskData: data,
			}).unwrap()
			dispatch(closeAddTaskModal())

			console.log('Task added successfully:', results)
		} catch (error) {
			console.error('Error adding task:', error)
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={closeModal}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>ADD TASK</DialogTitle>
					<DialogDescription>Create a new task</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Task Title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="Task Description" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Status</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn(
														'w-[200px] justify-between',
														!field.value && 'text-muted-foreground'
													)}
												>
													{field.value
														? statuses.find(
																(status) => status.value === field.value
														  )?.label
														: 'Select Status'}
													<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-[200px] p-0">
											<Command>
												<CommandInput placeholder="Search status..." />
												<CommandList>
													<CommandEmpty>No status found.</CommandEmpty>
													<CommandGroup>
														{statuses.map((status) => (
															<CommandItem
																value={status.label}
																key={status.value}
																onSelect={() => {
																	form.setValue('status', status.value)
																}}
															>
																<CheckIcon
																	className={cn(
																		'mr-2 h-4 w-4',
																		status.value === field.value
																			? 'opacity-100'
																			: 'opacity-0'
																	)}
																/>
																{status.label}
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="priority"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Priority</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn(
														'w-[200px] justify-between',
														!field.value && 'text-muted-foreground'
													)}
												>
													{field.value
														? priorities.find(
																(priority) => priority.value === field.value
														  )?.label
														: 'Select Priority'}
													<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-[200px] p-0">
											<Command>
												<CommandInput placeholder="Search priority..." />
												<CommandList>
													<CommandEmpty>No priority found.</CommandEmpty>
													<CommandGroup>
														{priorities.map((priority) => (
															<CommandItem
																value={priority.label}
																key={priority.value}
																onSelect={() => {
																	form.setValue('priority', priority.value)
																}}
															>
																<CheckIcon
																	className={cn(
																		'mr-2 h-4 w-4',
																		priority.value === field.value
																			? 'opacity-100'
																			: 'opacity-0'
																	)}
																/>
																{priority.label}
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Due Date Field with Calendar Component */}
						<FormField
							control={form.control}
							name="dueDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Due Date</FormLabel>
									<Popover modal={true}>
										<PopoverTrigger asChild>
											<Button
												variant={'outline'}
												className={cn('w-[240px] pl-3 text-left font-normal')}
											>
												{field.value
													? format(field.value, 'PPP')
													: 'Pick a date'}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</PopoverTrigger>

										<PopoverContent className="w-auto p-0" side="top">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={(date) => {
													if (date) {
														form.setValue('dueDate', date)
														form.trigger('dueDate') // Trigger validation for the dueDate field
													}
												}}
												initialFocus
												disabled={(date) =>
													date < new Date(new Date().setHours(0, 0, 0, 0))
												}
											/>
										</PopoverContent>
									</Popover>
								</FormItem>
							)}
						/>

						{/* Submit Button */}
						<DialogFooter>
							<Button type="submit">Create Task</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
