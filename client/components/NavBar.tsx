'use client'
import Dropdown from './DropDown'
import { useState, useEffect, useRef } from 'react'

export default function Navbar() {
	const [show, setShow] = useState<boolean>(false)
	const dropdownRef = useRef<HTMLDivElement>(null) // Ref for the dropdown

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShow(false)
			}
		}

		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			// Unbind the event listener on cleanup
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [dropdownRef])

	return (
		<nav className="bg-white border flex h-24">
			<div className="flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
				<p className="font-bold text-3xl"> Kanban App </p>
			</div>

			<div className="flex justify-between w-full items-center pr-[2.12rem]">
				<p className="text-black text-2xl font-bold pl-6">Board Name</p>

				<div className="flex items-center space-x-3">
					<button className="bg-blue-500 text-black px-4 py-2 flex rounded-3xl items-center space-x-2">
						<p>+ Add New Task</p>
					</button>
					<div className="relative flex items-center" ref={dropdownRef}>
						<button
							onClick={() => setShow(!show)} // Trigger function that shows dropdown here
							className="text-3xl mb-4"
						>
							...
						</button>
						<Dropdown show={show} />{' '}
						{/* Render dropdown here and pass show as prop */}
					</div>
				</div>
			</div>
		</nav>
	)
}
