import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface TaskList {
	name: string
}

export type TaskListResponse = {
	id: string
	name: string
	userId: string
}

const taskListApi = createApi({
	reducerPath: 'taskListApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3001',
		credentials: 'include',
		mode: 'cors',
	}),
	endpoints(builder) {
		return {
			addTaskList: builder.mutation<TaskListResponse, TaskList>({
				query: (taskList) => ({
					url: '/api/task-lists',
					method: 'POST',
					body: taskList,
				}),
			}),
			getTaskLists: builder.query<TaskListResponse[], void>({
				query: () => ({
					url: '/api/task-lists',
					method: 'GET',
				}),
			}),
			deleteTaskList: builder.mutation<void, string>({
				query: (id) => ({
					url: `/api/task-lists/${id}`,
					method: 'DELETE',
				}),
			}),
		}
	},
})

export const {
	useAddTaskListMutation,
	useGetTaskListsQuery,
	useDeleteTaskListMutation,
} = taskListApi
export { taskListApi }
