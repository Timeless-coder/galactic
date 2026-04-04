import React, { createContext, useState, useEffect, useMemo, type SetStateAction } from 'react'

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
	cartDropdownOpen: boolean
	setCartDropdownOpen: React.Dispatch<SetStateAction<boolean>>
	currentPricePerTour: number
	totalCostForPurchase: number
}

export const currentPricePerTour = 1

const isValidCartItems = (data: unknown): data is CartItem[] => {
	if (!Array.isArray(data)) return false
	return data.every(item =>
		item &&
		typeof item === 'object' &&
		typeof item.booking?.id === 'string' &&
		typeof item.booking?.people === 'number' &&
		typeof item.tour?.id === 'string'
	)
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
	const [cartItems, setCartItems] = useState<CartItem[]>(() => {
		try {
			const storedCart = localStorage.getItem('galacticCart')
			if (!storedCart) return []
			const parsedCart: unknown = JSON.parse(storedCart)
			return isValidCartItems(parsedCart) ? parsedCart : []
		}
		catch (err: any) {
			console.error(err.message)
			return []
		}
	})
	const [cartDropdownOpen, setCartDropdownOpen] = useState<boolean>(false)

	const addItemToCart = (item: CartItem) => {
		setCartItems(prev => [...prev, { ...item, booking: { ...item.booking, people: 1 } }])
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
		setCartItems((prevCartItems) => prevCartItems.filter((i) => i.booking.id !== item.booking.id))
	}	

	const subtractPersonFromBooking = (item: CartItem) => {
		setCartItems((prevCartItems) =>
			prevCartItems.map((cartItem) =>
				cartItem.booking.id === item.booking.id ? { ...cartItem, booking: { ...cartItem.booking, people: item.booking.people - 1 } } : cartItem
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

	const totalCostForPurchase = useMemo(
		() => cartItems.reduce((acc, item) => acc + currentPricePerTour * item.booking.people, 0),
		[cartItems]
	)

	useEffect(() => {
		try {
			localStorage.setItem('galacticCart', JSON.stringify(cartItems))
		}
		catch (err: any) {
			console.error(err.message)
		}
	}, [cartItems])

	const contextValue = useMemo(() => ({
		cartItems, addPersonToBooking, addItemToCart, removePersonOrBooking,
		removeItemFromCart, clearCart, cartDropdownOpen, setCartDropdownOpen,
		currentPricePerTour, totalCostForPurchase
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}), [cartItems, cartDropdownOpen, totalCostForPurchase])

	return (
		<CartContext value={contextValue}>
			{children}
		</CartContext>
	)
}