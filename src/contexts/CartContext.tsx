import { createContext, useState, useEffect } from 'react'

import type { Booking } from '../types/booking'
import type { Tour } from '../types/tour'
export type CartItem = {
	booking: Booking
	tour: Tour
}

export type CartContextType = {
	cartItems: CartItem[]
	addItemToCart: (item: CartItem) => void
	removeItemFromCart: (item: CartItem) => void
	clearCart: () => void
	addPersonToBooking: (item: CartItem) => void
	subtractPersonFromBooking: (item: CartItem) => void
	cartDropdownCollapsed: boolean
	setCartDropdownCollapsed: (collapsed: boolean) => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [cartDropdownCollapsed, setCartDropdownCollapsed] = useState(false)	

	const addItemToCart = (item: CartItem) => {
		setCartItems((prevCartItems) => [...prevCartItems, item])
	}

	const removeItemFromCart = (item: CartItem) => {
		setCartItems((prevCartItems) => prevCartItems.filter((i) => i !== item))
	}

	const clearCart = () => {
		setCartItems([])
	}

	const addPersonToBooking = (item: CartItem) => {
		setCartItems((prevCartItems) =>
			prevCartItems.map((cartItem) =>
				cartItem === item ? { ...cartItem, booking: { ...cartItem.booking, people: item.booking.people + 1 } } : cartItem
			)
		)
	}

	const subtractPersonFromBooking = (item: CartItem) => {
		setCartItems((prevCartItems) =>
			prevCartItems.map((cartItem) =>
				cartItem === item ? { ...cartItem, booking: { ...cartItem.booking, people: item.booking.people - 1 } } : cartItem
			)
		)
	}

	useEffect(() => {
		const storedCart = localStorage.getItem('cartTours')
		if (storedCart) {
			setCartItems(JSON.parse(storedCart))
		}
	}, [])

	return (
		<CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, clearCart, addPersonToBooking, subtractPersonFromBooking, cartDropdownCollapsed, setCartDropdownCollapsed }}>
			{children}
		</CartContext.Provider>
	)
}