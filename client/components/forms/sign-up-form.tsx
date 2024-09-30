import * as z from 'zod'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { UserValidation } from '@/lib/models/user'


import Link from 'next/link'
import { redirect } from 'next/navigation'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useAddUserMutation } from '@/lib/redux/store'

import { setCredentials } from '@/lib/redux/slices/authSlice'
import { useDispatch } from 'react-redux'


const SignUpForm = () => {

	const dispatch = useDispatch()

	const [addUser, results] = useAddUserMutation()


	const form = useForm<z.infer<typeof UserValidation>>({
		resolver: zodResolver(UserValidation),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})
	

	const onSubmit = (values: z.infer<typeof UserValidation>) => {
		addUser(values).unwrap()
	}

	if (results.data) {
		dispatch(setCredentials({ user: results.data }))
		redirect('/')
	}

	return (
		<>
			<Form {...form}>
				<form
					className="flex flex-col justify-start gap-10 text-white text-2xl"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormLabel className="text-base-semibold text-light-2">
									Name
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										className="account-form_input no-focus text-white"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Add fields for other keys in the UserValidation schema */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormLabel className="text-base-semibold text-light-2">
									Email
								</FormLabel>
								<FormControl>
									<Input
										type="email"
										className="account-form_input no-focus text-white"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormLabel className="text-base-semibold text-light-2">
									Password
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										className="account-form_input no-focus text-white"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Sign-up</Button>
				</form>
			</Form>
			<p className="px-8 text-center text-sm text-muted-foreground">
				already signed-up?{' '}
				<Link
					href="/auth/signin"
					className="underline underline-offset-4 hover:text-primary text-blue-500"
				>
					Sign-In
				</Link>
			</p>
		</>
	)
}

export default SignUpForm
