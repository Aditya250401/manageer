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
		baseUrl: 'https://manageer.vercel.app/',
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
				// Invalidate the task list query when a new task list is added
				invalidatesTags: [{ type: 'TaskList', id: 'LIST' }],
			}),
			getTaskLists: builder.query<TaskListResponse[], void>({
				query: () => ({
					url: '/api/task-lists',
					method: 'GET',
				}),
				// Provide a tag for the task lists
				providesTags: [{ type: 'TaskList', id: 'LIST' }],
			}),
			deleteTaskList: builder.mutation<void, string>({
				query: (id) => ({
					url: `/api/task-lists/${id}`,
					method: 'DELETE',
				}),
				// Invalidate the task list query when a task list is deleted
				invalidatesTags: [{ type: 'TaskList', id: 'LIST' }],
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
