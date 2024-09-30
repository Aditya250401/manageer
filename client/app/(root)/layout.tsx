
import Navbar from '@/components/Bars/NavBar'
import Sidebar from '@/components/Bars/SideBar'

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Navbar />
			<main className="flex flex-row">
				<Sidebar />
				<section className="main-container">
					<div className="w-full max-w-4xl">{children}</div>
				</section>
			</main>
		</>
	)
}
