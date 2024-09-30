import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from './apis/userApi'
import { taskApi } from './apis/tasksApi'
import { taskListApi } from './apis/taskListApi'
import  featuresReducers  from './slices/appSlice'
import authReducer from './slices/authSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'



// Create the Redux store
export const store = configureStore({
	reducer: {
		[userApi.reducerPath]: userApi.reducer,
		[taskApi.reducerPath]: taskApi.reducer,
		[taskListApi.reducerPath]: taskListApi.reducer,
		auth: authReducer,
		features: featuresReducers,
	}, // Add your reducers here
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(userApi.middleware, taskApi.middleware, taskListApi.middleware),
})

// Setup listeners for refetch behaviors
setupListeners(store.dispatch)

export {
	useGetUserQuery,
	useAddUserMutation,
	useLoginUserMutation,
	useLogoutQuery,
} from './apis/userApi'

export {
	useAddTaskMutation,
	useGetTasksByListIdQuery,
	useUpdateTaskStatusMutation,
	useDeleteTaskMutation,
} from './apis/tasksApi'

export {
	useAddTaskListMutation,
	useGetTaskListsQuery,
	useDeleteTaskListMutation,
} from './apis/taskListApi'

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


// Typed versions of useDispatch and useSelector hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
