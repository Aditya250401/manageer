'use client'
import SignUpForm from '@/components/forms/sign-up-form'

function Page() {
	return (
		<>
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-3xl font-semibold text-white tracking-tight">
						Sign-Up to Manageer
					</h1>
					<p className="text-xl text-muted-foreground">Enter your details</p>
				</div>
				<SignUpForm />
			</div>
		</>
	)
}

export default Page
