'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '@/lib/redux/slices/authSlice'
import { useGetUserQuery, useGetTasksByListIdQuery } from '@/lib/redux/store'

import AddBoardModal from '@/components/modals/AddBoardModal'
import AddTaskModal from '@/components/modals/AddTaskModal'
import EditTaskModal from '@/components/modals/EditTaskModal'

import { Dashboard } from '@/components/main-board/BoardTasks'
import { KanbanBoard } from '@/components/kanbanBoard/KanbanBoard'
import { Separator } from '@/components/ui/separator'

import { setCredentials } from '@/lib/redux/slices/authSlice'
import { getCurrentBoardId, getKanban } from '@/lib/redux/slices/appSlice'


export default function Home() {
	const currentBoardId = useSelector(getCurrentBoardId)
	const { data: userData } = useGetUserQuery()
	const dispatch = useDispatch()

	const kanbanState = useSelector(getKanban)

	// Set user credentials if available
	useEffect(() => {
		if (userData?.currentUser) {
			dispatch(setCredentials({ user: userData.currentUser }))
		}
	}, [userData, dispatch])

	const user = useSelector(selectCurrentUser)

	// Fetch tasks for the current board
	const {
		data: tasks,
		error: tasksError,
		isLoading: tasksLoading,
	} = useGetTasksByListIdQuery(
		{ taskListId: currentBoardId },
		{ skip: !currentBoardId }
	)

	console.log(tasks)


	if (!user) {
		return (
			<div role="status">
				<p className="px-8 text-center text-sm text-muted-foreground">
					to view your tasks{' '}
					<Link
						href="/auth/signin"
						className="underline underline-offset-4 hover:text-primary text-blue-500"
					>
						Sign-In
					</Link>
				</p>
			</div>
		)
	}

	if (tasksLoading) {
		return (
			<div role="status">
				<p className="text-center">Loading tasks...</p>
			</div>
		)
	}

	if (tasksError) {
		return (
			<div>
				<p className="text-center text-red-500">Error loading tasks!</p>
				<AddBoardModal />
				<AddTaskModal />
			</div>
		)
	}

	if (!tasks || tasks.length === 0) {
		return (
			<div className="text-center">
				<p>No tasks available for this board.</p>
				<AddBoardModal />
				<AddTaskModal />
			</div>
		)
	}

	if (kanbanState) {
		return (
			<>
				<AddBoardModal />
				<AddTaskModal />
				<EditTaskModal />
				<div className="space-y-6">
					<div>
						<KanbanBoard taskarray={tasks} />
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<AddBoardModal />
			<AddTaskModal />
			<EditTaskModal />
			<div className="space-y-6">
				<div>
					<Separator />
					<Dashboard tasks={tasks} currentBoardId={currentBoardId} />
				</div>
			</div>
		</>
	)
}
