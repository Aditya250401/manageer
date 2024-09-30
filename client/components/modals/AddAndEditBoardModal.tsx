import { useState, useEffect } from 'react'
import { Modal, ModalBody } from './Modal'
import {
	useAppSelector,
	useAppDispatch,
	useAddTaskListMutation,
	useGetTaskListsQuery,
} from '@/lib/redux/store'
import {
	getAddAndEditBoardModalValue,
	getAddAndEditBoardModalVariantValue,
	closeAddAndEditBoardModal,
	getCurrentBoardName,
} from '@/lib/redux/slices/appSlice'

interface IAddBoardData {
	name: string
}

const initialBoardData: IAddBoardData = {
	name: '',
}

export default function AddAndEditBoardModal() {
	const [boardData, setBoardData] = useState<IAddBoardData>(initialBoardData)
	const [isBoardNameEmpty, setIsBoardNameEmpty] = useState<boolean>(false)

	const modalVariant = useAppSelector(getAddAndEditBoardModalVariantValue)
	const isVariantAdd = modalVariant === 'Add New Board'
	const dispatch = useAppDispatch()
	const isOpen = useAppSelector(getAddAndEditBoardModalValue)
	const currentBoardTitle = useAppSelector(getCurrentBoardName)

	const closeModal = () => dispatch(closeAddAndEditBoardModal())

	const { data } = useGetTaskListsQuery()
	const [addTaskList, { isLoading }] = useAddTaskListMutation()

	//Effect to set initial data for the modal based on the variant
	useEffect(() => {
		if (data) {
			if (isVariantAdd) {
				setBoardData(initialBoardData)
			} else {
				const activeBoard = data.find(
					(board: { name: string }) => board.name === currentBoardTitle
				)
				if (activeBoard) {
					setBoardData({ name: activeBoard.name })
				}
			}
		}
	}, [data, modalVariant])

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

		// Submit to the database
		try {
			await addTaskList({ name: boardData.name }).unwrap()
			closeModal() // Close modal after successful addition
		} catch (error) {
			console.error('Failed to add board:', error)
		}
	}

	// Handler for input change
	const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBoardData({ ...boardData, name: e.target.value })
	}

	return (
		<Modal isOpen={isOpen} onRequestClose={closeModal}>
			<ModalBody>
				{boardData && (
					<>
						<p className="text-lg font-bold">{modalVariant}</p>
						<div className="py-6">
							<div>
								<label htmlFor="boardName" className="text-sm">
									Board Name
								</label>
								<div className="pt-2">
									<input
										id="boardName"
										className={`${
											isBoardNameEmpty ? 'border-red-500' : 'border-stone-200'
										} border w-full p-2 rounded text-sm cursor-pointer focus:outline-none`}
										placeholder="Name"
										value={boardData.name}
										onChange={handleBoardNameChange}
									/>
								</div>
								{isBoardNameEmpty && (
									<p className="text-xs text-red-500">
										Board name cannot be empty
									</p>
								)}
							</div>

							<div className="pt-6">
								<button
									type="submit"
									onClick={handleAddNewBoardToDb}
									className="bg-blue-500 rounded-3xl py-2 w-full text-sm font-bold"
								>
									<p>
										{isLoading
											? 'Loading'
											: `${isVariantAdd ? 'Create New Board' : 'Save Changes'}`}
									</p>
								</button>
							</div>
						</div>
					</>
				)}
			</ModalBody>
		</Modal>
	)
}
