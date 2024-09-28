import type { Metadata } from 'next'
import localFont from 'next/font/local'
import StoreProvider from './StoreProvider'
import Navbar from '@/components/NavBar'
import './globals.css'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
})

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
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased pb-24 h-screen overflow-hidden `}
			>
				<StoreProvider>
					<Navbar />
					{children}
				</StoreProvider>
			</body>
		</html>
	)
}
