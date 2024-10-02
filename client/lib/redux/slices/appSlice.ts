import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

// Define the initial state using that type
export interface Task {
	name: string
	status: string
}

const initialState = {
	currentBoardName: '',
	currentBoardId: '',
	currentTaskId: '',
	isKanban: false,
	taskList: [],
	// Manage the state for opening and closing the Add and Edit Board modal
	isAddBoardModal: { isOpen: false },
	isAddTaskModal: {
		isOpen: false,
	},
	isEditTaskModal: {
		isOpen: false,
	},
}

export const features = createSlice({
	name: 'features',
	initialState,

	reducers: {
		setCurrentBoardName: (state, action: PayloadAction<string>) => {
			state.currentBoardName = action.payload
		},
		setCurrentBoardId: (state, action: PayloadAction<string>) => {
			state.currentBoardId = action.payload
		},
		setCurrentTaskId: (state, action: PayloadAction<string>) => {
			state.currentTaskId = action.payload
		},
		// Open the Add and Edit Board modal with a specified variant (add or edit)
		openAddBoardModal: (state) => {
			state.isAddBoardModal.isOpen = true
			// Set the kind of modal to open (add board or edit board) based on the variant parameter
		},
		// Close the Add and Edit Board modal
		closeAddBoardModal: (state) => {
			state.isAddBoardModal.isOpen = false
		},
		// Open the Add and Edit task modal with a specified variant (add or edit)
		openAddTaskModal: (state) => {
			state.isAddTaskModal.isOpen = true
		},
		// Close the Add and Edit task modal
		closeAddTaskModal: (state) => {
			state.isAddTaskModal.isOpen = false
		},

		openEditTaskModal: (state) => {
			state.isEditTaskModal.isOpen = true
		},
		closeEditTaskModal: (state) => {
			state.isEditTaskModal.isOpen = false
		},
		toggleKanban: (state) => {
			state.isKanban = !state.isKanban
		},

		// Open the delete board and task modal with a specified variant (delete board or task
	},
})

export const {
	setCurrentBoardId,
	setCurrentBoardName,
	setCurrentTaskId,
	openAddBoardModal,
	closeAddBoardModal,
	openAddTaskModal,
	closeAddTaskModal,
	openEditTaskModal,
	closeEditTaskModal,
	toggleKanban,
} = features.actions

// delete task and board
// Selector function to retrieve variant state value

// add and edit task
export const getAddTaskModalValue = (state: RootState) =>
	state.features.isAddTaskModal.isOpen
// Selector function to retrieve variant state value

export const getCurrentBoardName = (state: RootState) =>
	state.features.currentBoardName

export const getCurrentBoardId = (state: RootState) =>
	state.features.currentBoardId

export const getCurrentTaskId = (state: RootState) =>
	state.features.currentTaskId

export const getAddBoardModalValue = (state: RootState) =>
	state.features.isAddBoardModal.isOpen

export const getEditTaskModalValue = (state: RootState) =>
	state.features.isEditTaskModal.isOpen

// Selector functions to retrieve isOpen value of state from the isAddBoardModal state
export const AddBoardModal = (state: RootState) =>
	state.features.isAddBoardModal.isOpen

//get kanban state
export const getKanban = (state: RootState) => state.features.isKanban

// Selector functions to retrieve isOpen value of state from the isAddBoardModal state
// Export the reducer for use in the Redux store
export default features.reducer
