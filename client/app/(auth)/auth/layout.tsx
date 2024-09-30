'use client'
export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<div className="flex flex-1 items-center justify-center min-h-screen relative bg-black">
				<div className="flex flex-1 flex-col container m-10 relative min-h-50 border-2 border-white rounded-lg h-[800px] items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
					<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
						<div className="absolute inset-0 bg-zinc-900" />
						<div className="relative z-20 flex items-center text-lg font-medium">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mr-2 h-6 w-6"
							>
								<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
							</svg>
							Manageer
						</div>
						<div className="relative z-20 mt-auto">
							<blockquote className="space-y-2">
								<p className="text-lg">
									&ldquo;This app has become my whole new way of managing my
									tasks&rdquo;
								</p>
								<footer className="text-sm">Aditya Agarwal</footer>
							</blockquote>
						</div>
					</div>
					<div className="lg:p-8">
						<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
