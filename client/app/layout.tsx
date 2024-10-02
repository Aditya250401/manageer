import type { Metadata } from 'next'
import { Providers } from '@/lib/redux/provider'
import './globals.css'

export const metadata: Metadata = {
	title: 'Manageer',
	description: 'A simple task manager app and kanban board',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<Providers>
				<body>{children}</body>
			</Providers>
		</html>
	)
}
