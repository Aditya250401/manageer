'use client'
import React from 'react'
import { useMyContext } from '../../MyContext'

export default function MyPage() {
	const { myObject } = useMyContext()

	return (
		<div>
			<p>{myObject.user.email}</p>
		</div>
	)
}
