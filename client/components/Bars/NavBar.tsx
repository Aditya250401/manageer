'use client'
import { useState } from 'react'
import { useEffect } from 'react'
import {
	setCurrentBoardName,
	getCurrentBoardName,
	openAddTaskModal,
} from '@/lib/redux/slices/appSlice'
import {
	useAppDispatch,
	useAppSelector,
	useLogoutMutation,
} from '@/lib/redux/store'
import { useGetTaskListsQuery } from '@/lib/redux/store'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

export default function Navbar() {
	const [response, setResponse] = useState({ message: '' })
	const { data } = useGetTaskListsQuery()
	const dispatch = useAppDispatch()
	const [logout] = useLogoutMutation()

	useEffect(() => {
		if (data?.length > 0) {
			const activeBoard = data[0]
			dispatch(setCurrentBoardName(activeBoard.name))
		}
	}, [data])

	const currentBoardName = useAppSelector(getCurrentBoardName)

	const handleLogout = async () => {
		try {
			const response = await logout().unwrap() // Ensure you unwrap to catch errors
			setResponse(response)
		} catch (error) {
			console.error('Logout failed:', error) // Log error for debugging
		}
	}

	if (response.message === 'Successfully signed out') {
		redirect('/auth/signin') // Redirect to the signin page after successful logout
	}

	if (data === undefined) {
		return (
			<nav className="bg-white border flex h-24">
				<div className="flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
					<p className="font-bold text-3xl"> Manageer </p>
				</div>
				<div className="flex items-center space-x-3">
					<p className="font-bold text-3xl"> Signin before using the app </p>
				</div>
			</nav>
		)
	}

	return (
		<nav className="bg-white border flex h-24">
			<div className="flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
				<p className="font-bold text-3xl"> Manageer </p>
			</div>

			<div className="flex justify-between w-full items-center pr-[2.12rem]">
				<p className="text-black text-2xl font-bold pl-6">{currentBoardName}</p>

				<div className="flex items-center space-x-3">
					<Button
						type="button"
						onClick={() => dispatch(openAddTaskModal())}
						className="px-4 py-2 flex rounded-xl items-center space-x-2"
					>
						<p>+ Add New Task</p>
					</Button>
					<Button
						type="button"
						onClick={handleLogout}
						className="px-4 py-2 flex rounded-xl items-center space-x-2"
					>
						<p>Logout</p>
					</Button>
				</div>
			</div>
		</nav>
	)
}
