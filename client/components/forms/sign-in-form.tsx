'use client'
import * as React from 'react'
import * as z from 'zod'

import { useToast } from '@/components/ui/use-toast'

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

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useLoginUserMutation } from '@/store'
import DispatchCredentials from '@/hooks/SetCredentials'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { UserLoginValidation } from '@/lib/models/user'

export function UserAuthForm() {
	const { toast } = useToast()
	const form = useForm<z.infer<typeof UserLoginValidation>>({
		resolver: zodResolver(UserLoginValidation),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const [loginUser, results] = useLoginUserMutation()

	const onSubmit = async (values: z.infer<typeof UserLoginValidation>) => {
		try {
			const res: any = await loginUser(values).unwrap()
			toast({
				title: res ? 'Login Successful' : 'Welcome',
			})
		} catch (error: any) {
			toast({
				variant: 'destructive',
				title: error?.data?.msg,
			})
		}
	}

	if (results.isSuccess) {

		toast({
			title: 'Login Successful',
		})
		DispatchCredentials(results.data)
		redirect('/')
	}

	return (
		<>
			<Form {...form}>
				<form
					className="flex flex-col justify-start gap-10 text-white text-2xl"
					onSubmit={form.handleSubmit(onSubmit)}
				>
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
										className="account-form_input no-focus text-black"
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
										className="account-form_input no-focus text-black"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button disabled={results.isLoading} type="submit">
						{results.isLoading && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						Sign-In
					</Button>
				</form>
			</Form>
			<p className="px-8 text-center text-sm text-muted-foreground">
				Not registered?{' '}
				<Link
					href="/auth/sign-up"
					className="underline underline-offset-4 hover:text-primary text-blue-500"
				>
					Register Now
				</Link>
			</p>
		</>
	)
}
