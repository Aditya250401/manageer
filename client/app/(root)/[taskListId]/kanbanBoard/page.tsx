'use client'

import { KanbanBoard } from '@/components/components-kanban/KanbanBoard'
import { ThemeToggle } from '@/components/components-kanban/ThemeToggle'
import { ThemeProvider } from '@/components/components-kanban/theme-provider'

function Page() {
	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<div className="min-h-screen flex flex-col">
					<header className="flex justify-between w-full flex-row p-4">
						<ThemeToggle />
					</header>
					<main className="mx-4 flex flex-col gap-6">
						<KanbanBoard />
					</main>
				</div>
			</ThemeProvider>
		</>
	)
}

export default Page
