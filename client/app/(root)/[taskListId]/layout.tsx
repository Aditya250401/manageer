export default function TaskLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`antialiased pb-24 h-screen overflow-hidden `}>
				{children}
			</body>
		</html>
	)
}
