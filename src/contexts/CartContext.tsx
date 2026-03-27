import { createContext, useState, useEffect } from 'react'

import type { Booking } from '../types/booking'
import type { Tour } from '../types/tour'

export type CartItem = {
	booking: Booking
	tour: Tour
}

export type CartContextType = {
	cartItems: CartItem[]
	addPersonToBooking: (item: CartItem) => void
	addItemToCart: (item: CartItem) => void
	removePersonOrBooking: (item: CartItem) => void
	removeItemFromCart: (item: CartItem) => void
	clearCart: () => void
	cartDropdownCollapsed: boolean
	setCartDropdownCollapsed: (collapsed: boolean) => void
	total: number
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
	const [cartItems, setCartItems] = useState<CartItem[]>(() => {
		const stored = localStorage.getItem('galacticCart')
		return stored ? JSON.parse(stored) : []
	})
	const [cartDropdownCollapsed, setCartDropdownCollapsed] = useState(false)

	const addItemToCart = (item: CartItem) => {
		item.booking.people= 1
		setCartItems(prev => [...prev, item])
	}

	const addPersonToBooking = (item: CartItem) => {
		setCartItems(prev =>
			prev.map(cartItem =>
				cartItem.booking.id === item.booking.id
					? { ...cartItem, booking: { ...cartItem.booking, people: cartItem.booking.people + 1 } }
					: cartItem
			)
		)
	}

	const removeItemFromCart = (item: CartItem) => {
		setCartItems((prevCartItems) => prevCartItems.filter((i) => i !== item))
	}	

	const subtractPersonFromBooking = (item: CartItem) => {
		setCartItems((prevCartItems) =>
			prevCartItems.map((cartItem) =>
				cartItem === item ? { ...cartItem, booking: { ...cartItem.booking, people: item.booking.people - 1 } } : cartItem
			)
		)
	}

	const removePersonOrBooking = (item: CartItem) => {
		if (item.booking.people === 1) removeItemFromCart(item)
		else subtractPersonFromBooking(item)
	}
		
	const clearCart = () => {
		setCartItems([])
	}

	const total = cartItems.reduce((acc, item) => acc + 1 * item.booking.people, 0)

	useEffect(() => {
		localStorage.setItem('galacticCart', JSON.stringify(cartItems))
	}, [cartItems])

	return (
		<CartContext value={{ cartItems, addPersonToBooking, addItemToCart, removePersonOrBooking, removeItemFromCart, clearCart, cartDropdownCollapsed, setCartDropdownCollapsed, total }}>
			{children}
		</CartContext>
	)
}