import type { User } from './user'
import type { Tour } from './tour'

export type Review = {
	id: string
	rating: number
	text: string
	tourId: string
	userId: string
	createdAt: string
}

export type ReviewWithUser = {
	review: Review
	user: User
}

export type ReviewWithTour = {
	review: Review
	tour: Tour
}