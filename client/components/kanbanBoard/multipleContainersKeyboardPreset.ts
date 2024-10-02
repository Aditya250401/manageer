import {
	closestCorners,
	getFirstCollision,
	DroppableContainer,
} from '@dnd-kit/core'

export const coordinateGetter = (
	event,
	{ context: { active, droppableRects, droppableContainers, collisionRect } }
) => {
	if (!active || !collisionRect) {
		return
	}

	const filteredContainers: DroppableContainer[] = []

	droppableContainers.getEnabled().forEach((entry) => {
		if (!entry || entry?.disabled) {
			return
		}

		const rect = droppableRects.get(entry.id)

		if (!rect) {
			return
		}

		const data = entry.data.current

		if (data) {
			const { type, children } = data

			if (type === 'Column' && children?.length > 0) {
				if (active.data.current?.type !== 'Column') {
					return
				}
			}
		}

		filteredContainers.push(entry)
	})

	const collisions = closestCorners({
		active,
		collisionRect,
		droppableRects,
		droppableContainers: filteredContainers,
		pointerCoordinates: null,
	})

	const closestId = getFirstCollision(collisions, 'id')

	if (closestId != null) {
		const newDroppable = droppableContainers.get(closestId)
		const newNode = newDroppable?.node.current
		const newRect = newDroppable?.rect.current

		if (newNode && newRect) {
			return {
				x: newRect.left,
				y: newRect.top,
			}
		}
	}

	return undefined
}
