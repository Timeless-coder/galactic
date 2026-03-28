import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteField } from 'firebase/firestore'

import { db } from './firebaseConfig'
import type { User } from '../../types/user'

export const getUserById = async (id: string): Promise<User> => {
	const userRef = doc(db, 'users', id)
	const userSnap = await getDoc(userRef)
	if (!userSnap.exists()) {
		throw new Error('User not found')
	}
	return { id: userSnap.id, ...userSnap.data() } as User
}

export const getAllUsers = async (): Promise<User[]> => {
	const usersSnapshot = await getDocs(collection(db, 'users'))
	return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User))
}

// *** ADMIN ***
export const migrateDisplayNameToName = async (): Promise<void> => {
	const usersSnapshot = await getDocs(collection(db, 'users'))
	for (const userDoc of usersSnapshot.docs) {
		const data = userDoc.data()
		if ('displayName' in data) {
			await updateDoc(doc(db, 'users', userDoc.id), {
				name: data.displayName,
				displayName: deleteField(),
			})
		}
	}
}