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
	title: string
	description?: string
	status?: string
	priority: string
	dueDate: Date
}

const taskApi = createApi({
	reducerPath: 'taskApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://manageer.vercel.app/',
		credentials: 'include',
		mode: 'cors',
	}),
	tagTypes: ['Task'], // Define tag types here
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
				// Invalidate the tasks query for the associated task list
				invalidatesTags: (result, error, { taskListId }) => [
					{ type: 'Task', id: taskListId },
				],
			}),

			getTasksByListId: builder.query<TaskResponse[], { taskListId: string }>({
				query: ({ taskListId }) => ({
					url: `/api/tasks?taskListId=${taskListId}`,
					method: 'GET',
				}),
				// Provide a tag for the tasks associated with the list
				providesTags: (result, error, { taskListId }) => [
					{ type: 'Task', id: taskListId },
				],
			}),
			getTaskByTaskId: builder.query<TaskResponse, string>({
				query: (id) => ({
					url: `/api/tasks/${id}`,
					method: 'GET',
				}),
			}),
			updateTaskStatus: builder.mutation<
				TaskResponse,
				{ id: string; status: string; taskListId: string } // Include taskListId here
			>({
				query: ({ id, status }) => ({
					url: `/api/tasks/${id}`,
					method: 'PUT',
					body: { status },
				}),
				// Invalidate the tasks query for the associated task list
				invalidatesTags: (result, error, { taskListId }) => [
					{ type: 'Task', id: taskListId },
				],
			}),
			updateTask: builder.mutation<
				TaskResponse,
				{ id: string; taskListId: string; taskData: Task }
			>({
				query: ({ id, taskData }) => ({
					url: `/api/tasks/${id}`,
					method: 'PUT',
					body: taskData,
				}),
				// Invalidate the tasks query for the associated task list
				invalidatesTags: (result, error, { taskListId }) => [
					{ type: 'Task', id: taskListId },
				],
			}),

			deleteTask: builder.mutation<void, { id: string; taskListId: string }>({
				query: ({ id }) => ({
					url: `/api/tasks/${id}`,
					method: 'DELETE',
				}),
				// Invalidate the tasks query for the associated task list
				invalidatesTags: (result, error, { taskListId }) => [
					{ type: 'Task', id: taskListId },
				],
			}),
		}
	},
})

export const {
	useAddTaskMutation,
	useGetTasksByListIdQuery,
	useUpdateTaskStatusMutation,
	useDeleteTaskMutation,
	useUpdateTaskMutation,
	useGetTaskByTaskIdQuery,
} = taskApi

export { taskApi }
