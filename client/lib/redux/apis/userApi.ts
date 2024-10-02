
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Task } from './tasksApi'

export interface User {
	name: string
	email: string
	password: string
}


export type UserResponse = {
	id: string
	email: string
	username: string
	taskLists: Task[] // u can be more specific here if you know the structure of taskLists
}

export type currentUserResponse = {
	currentUser: UserResponse
}

const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://manageer.vercel.app/',
		credentials: 'include',
		mode: 'no-cors',
	}),

	endpoints(builder) {
		return {
			getUser: builder.query<currentUserResponse, void>({
				query: () => {
					return {
						url: '/api/users/currentuser',
						method: 'GET',
					}
				},
			}),
			addUser: builder.mutation<UserResponse, User>({
				query: (user) => {
					return {
						url: '/api/users/signup',
						method: 'POST',
						body: {
							username: user.name,
							email: user.email,
							password: user.password,
						},
					}
				},
			}),
			loginUser: builder.mutation({
				query: (user) => {
					return {
						url: '/api/users/signin',
						method: 'POST',
						body: {
							email: user.email,
							password: user.password,
						},
					}
				},
			}),
			logout: builder.mutation({
				query: () => {
					return {
						url: '/api/users/signout',
						method: 'POST',
					}
				},
			}),
		}
	},
})

export const { useGetUserQuery, useAddUserMutation, useLoginUserMutation, useLogoutMutation } =
	userApi
export { userApi }
