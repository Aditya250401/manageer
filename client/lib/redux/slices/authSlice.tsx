import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UserResponse } from '../apis/userApi' // Updated import
import type { RootState } from '../store'

type AuthState = {
	user: UserResponse | null
}

const initialState: AuthState = {
	user: null,
}

const slice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (
			state,
			{ payload }: PayloadAction<{ user: UserResponse }>
		) => {
			state.user = payload.user
		},
	},
})

export const { setCredentials } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user
