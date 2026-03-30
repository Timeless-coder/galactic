// The tours collection includes an 'id' property on top of the auto-generated doc id,
// and it has the same value as the doc id.
// I don't know the purpose, but the 2 strings match on all docs.
// When we create a new Tour, we're not including the secondary 'id' property.

export type Tour = {
	id: string
	createdAt: string
	name: string
	summary: string
	description: string
	planet: string
	reviews: number
	slug: string
	averageRating: number
	creator: string
	difficulty: number
	imageCover: string
	images: string[]
	departureDates: string[]
}