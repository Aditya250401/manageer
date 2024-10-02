'use client'
import { useEffect } from 'react'
// Import Redux functions and selectors for managing board names
import {
	setCurrentBoardName,
	getCurrentBoardName,
	openAddTaskModal,
} from '@/lib/redux/slices/appSlice'
import {
	useAppDispatch,
	useAppSelector,
	useLogoutMutation, // Updated to use mutation hook
} from '@/lib/redux/store'
// Import the data-fetching hook from the API slice
import { useGetTaskListsQuery } from '@/lib/redux/store'
import { Button } from '@/components/ui/button'

export default function Navbar() {
	// Destructuring assignment to extract data from the useFetchDataFromDbQuery hook
	const { data } = useGetTaskListsQuery()
	// Access the Redux dispatch function for calling actions
	const dispatch = useAppDispatch()

	// Call the logout mutation hook at the top level
	const [logout] = useLogoutMutation() // Updated to use mutation

	// Effect hook to run when the data updates
	useEffect(() => {
		if (data?.length > 0) {
			// When a user signs in, set the currentBoardName to the first board's name
			const activeBoard = data[0]
			dispatch(setCurrentBoardName(activeBoard.name))
		}
	}, [data])

	// Select the current board name from the Redux store
	const currentBoardName = useAppSelector(getCurrentBoardName)

	// Function to handle logout
	const handleLogout = async () => {
		try {
			await logout() // Call the logout function
			// Optionally, you can dispatch any additional actions after logout
		} catch (error) {
			console.error('Logout failed:', error)
			// Handle error (e.g., show a notification)
		}
	}

	return (
		<nav className="bg-white border flex h-24">
			<div className="flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
				<p className="font-bold text-3xl"> Manageer </p>
			</div>

			<div className="flex justify-between w-full items-center pr-[2.12rem]">
				{/* populate the current board name in the navbar */}
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
						onClick={handleLogout} // Use the handleLogout function here
						className="px-4 py-2 flex rounded-xl items-center space-x-2"
					>
						<p>Logout</p>
					</Button>
				</div>
			</div>
		</nav>
	)
}
