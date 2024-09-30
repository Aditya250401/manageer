import { currentUser } from './../../../../backend/middlewares/current-user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface User {
	name: string
	email: string
	password: string
}


export type UserResponse = {
	id: string
	email: string
	username: string
	taskLists: Array<any> // You can be more specific here if you know the structure of taskLists
}

export type currentUserResponse = {
	currentUser: UserResponse
}

const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3001',
		credentials: 'include',
		mode: 'cors',
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
			logout: builder.query({
				query: () => {
					return {
						url: '/api/users/signout',
						method: 'GET',
					}
				},
			}),
		}
	},
})

export const { useGetUserQuery, useAddUserMutation, useLoginUserMutation, useLogoutQuery } =
	userApi
export { userApi }
