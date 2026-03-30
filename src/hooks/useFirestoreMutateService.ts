import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export type FirestoreMutateServiceOptions = {
	successMessage?: string
	errorMessage?: string
	silent?: boolean
}

const defaultFirestoreCreateServiceOptions: FirestoreMutateServiceOptions = {
	silent: false
}

type FirestoreCreateServiceResult<T> = {
	error: Error | null
	loading: boolean
	mutate: (...args: any[]) => Promise<T | void>
}

export const useFirestoreMutateService = <T>(service: (...args: any[]) => Promise<T>,	options: FirestoreMutateServiceOptions = defaultFirestoreCreateServiceOptions): FirestoreCreateServiceResult<T> => {
	const { successMessage, errorMessage, silent = false } = options
	const [error, setError] = useState<Error | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const isMounted = useRef(true)

	useEffect(() => {
		isMounted.current = true
		return () => { isMounted.current = false }
	}, [])

	const mutate = useCallback(async (...args: any[]) => {
		setLoading(true)
		setError(null)

		try {
			const result = await service(...args)
			if (successMessage && !silent && isMounted.current) toast.success(successMessage)
			return result
		}
		catch (err: any) {
			if (isMounted.current) setError(err.message)
			if (!silent && isMounted.current) toast.error(errorMessage || err.message || 'An error occurred')
		}
		finally {
			if (isMounted.current) setLoading(false)
		}
	}, [service, successMessage, errorMessage, silent])

	return { error, loading, mutate }
}
