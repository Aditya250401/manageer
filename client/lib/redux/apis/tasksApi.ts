import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Task {
	title: string
	description?: string
	status?: string
	priority: string
	dueDate: string
}

export type TaskResponse = {
	id: string
}

const taskApi = createApi({
	reducerPath: 'taskApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3001',
		credentials: 'include',
		mode: 'cors',
	}),
	endpoints(builder) {
		return {
			addTask: builder.mutation<
				TaskResponse,
				{ taskListId: string; taskData: Task }
			>({
				query: ({ taskListId, taskData }) => ({
					url: '/api/tasks',
					method: 'POST',
					body: {
						...taskData,
						taskListId,
					},
				}),
			}),
			getTasksByListId: builder.query<TaskResponse[], { taskListId: string }>({
				query: ({ taskListId }) => ({
					url: `/api/tasks?taskListId=${taskListId}`,
					method: 'GET',
				}),
			}),
			updateTaskStatus: builder.mutation<
				TaskResponse,
				{ id: string; status: string }
			>({
				query: ({ id, status }) => ({
					url: `/api/tasks/${id}`,
					method: 'PUT',
					body: { status },
				}),
			}),
			deleteTask: builder.mutation<void, string>({
				query: (id) => ({
					url: `/api/tasks/${id}`,
					method: 'DELETE',
				}),
			}),
		}
	},
})

export const {
	useAddTaskMutation,
	useGetTasksByListIdQuery,
	useUpdateTaskStatusMutation,
	useDeleteTaskMutation,
} = taskApi
export { taskApi }
