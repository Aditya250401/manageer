import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	useAppSelector,
	useAppDispatch,
	useAddTaskListMutation,
	useGetTaskListsQuery,
} from '@/lib/redux/store'
import {
	getAddBoardModalValue,
	closeAddBoardModal,
} from '@/lib/redux/slices/appSlice'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface IAddBoardData {
	name: string
}

const initialBoardData: IAddBoardData = {
	name: '',
}

export default function AddBoardModal() {
	const [boardData, setBoardData] = useState<IAddBoardData>(initialBoardData)
	const [isBoardNameEmpty, setIsBoardNameEmpty] = useState<boolean>(false)
	const dispatch = useAppDispatch()
	const isOpen = useAppSelector(getAddBoardModalValue)

	const closeModal = () => dispatch(closeAddBoardModal())

	const { data } = useGetTaskListsQuery()
	const [addTaskList, { isLoading }] = useAddTaskListMutation()

	// Effect to set initial data for the dialog based on the variant
	useEffect(() => {
		if (data) {
			setBoardData(initialBoardData)
		}
	}, [data])

	// Effect to clear error messages after a certain time
	useEffect(() => {
		if (isBoardNameEmpty) {
			const timeoutId = setTimeout(() => {
				setIsBoardNameEmpty(false)
			}, 3000)
			return () => clearTimeout(timeoutId)
		}
	}, [isBoardNameEmpty])

	// Handler for adding a new board to the database
	const handleAddNewBoardToDb = async (
		e: React.FormEvent<HTMLButtonElement>
	) => {
		e.preventDefault()

		if (!boardData.name) {
			setIsBoardNameEmpty(true)
			return
		}

		try {
			await addTaskList({ name: boardData.name }).unwrap()
			closeModal() // Close dialog after successful addition
		} catch (error) {
			console.error('Failed to add board:', error)
		}
	}

	// Handler for input change
	const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBoardData({ ...boardData, name: e.target.value })
	}

	return (
		<Dialog open={isOpen} onOpenChange={closeModal}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>ADD TASK LIST</DialogTitle>
					<DialogDescription>Create a new Task List</DialogDescription>
				</DialogHeader>

				<div className="py-6">
					<div>
						<label htmlFor="boardName" className="text-sm">
							Board Name
						</label>
						<div className="pt-2">
							<Input
								id="boardName"
								className={`${
									isBoardNameEmpty ? 'border-red-500' : 'border-stone-200'
								} border w-full p-2 rounded text-sm cursor-pointer focus:outline-none`}
								value={boardData.name}
								onChange={handleBoardNameChange}
								required
							/>
						</div>
						{isBoardNameEmpty && (
							<p className="text-xs text-red-500">board name cannot be empty</p>
						)}
					</div>

					<div className="pt-6">
						<DialogFooter>
							<Button
								type="submit"
								onClick={handleAddNewBoardToDb}
								className="px-4 py-2 flex rounded-xl items-center space-x-2"
							>
								<p>{isLoading ? 'Loading' : 'Save Changes'}</p>
							</Button>
						</DialogFooter>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
