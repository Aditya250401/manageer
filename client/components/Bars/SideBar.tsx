'use client'
import { useState } from 'react'
import Link from 'next/link'

import {
	setCurrentBoardName,
	openAddBoardModal,
	setCurrentBoardId,
} from '@/lib/redux/slices/appSlice'
import { useGetTaskListsQuery, useAppDispatch } from '@/lib/redux/store'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'

export default function Sidebar() {
	const { data } = useGetTaskListsQuery()

	// State to keep track of the index of the active board during navigation
	const [active, setActive] = useState<number>(0)

	const dispatch = useAppDispatch()

	// Function to handle navigation through boards
	const handleNav = (index: number, name: string, id: string) => {
		setActive(index)
		dispatch(setCurrentBoardName(name))
		dispatch(setCurrentBoardId(id))
	}

	return (
		<aside className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
			{data && (
				<>
					{/* Display the number of boards available in the data */}
					<p className="text-muted-foreground pl-6 text-lg font-semibold uppercase">
						{`All Boards (${data.length})`}
					</p>

					{/* Display the names of each board */}
					{data.map((board: { [key: string]: any }, index: number) => {
						const { name, id } = board
						const isActive = index === active // Check if the board is active

						return (
							<Link
								href="#"
								key={id}
								onClick={() => handleNav(index, name, id)} // Handle navigation through boards on click
								className={cn(
									buttonVariants({ variant: 'ghost' }),
									isActive
										? 'bg-muted text-primary'
										: 'hover:bg-transparent hover:underline',
									'justify-start pl-6'
								)}
							>
								{name}
							</Link>
						)
					})}
					<Button
						className="px-4 py-2 flex rounded-xl items-center space-x-2"
						onClick={() => dispatch(openAddBoardModal())}
					>
						+ Create New Board
					</Button>
				</>
			)}
		</aside>
	)
}
