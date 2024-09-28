import Sidebar from '../components/SideBar'
import BoardTasks from '../components/BoardTasks'

export default function Home() {
	return (
		<main className="flex h-full">
			<Sidebar />
			<BoardTasks />
		</main>
	)
}
