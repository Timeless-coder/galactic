import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export type FirestoreServiceOptions = {
	successMessage?: string
	errorMessage?: string
	immediate?: boolean
	silent?: boolean
}

const defaultFirestoreServiceOptions: FirestoreServiceOptions = {
	immediate: true,
	silent: false
}

type FirestoreServiceResult<T> = {
	data: T | null
	error: Error | null
	loading: boolean
	refetch: () => Promise<void>
}

export const useFirestoreReadService = <T>(service: () => Promise<T>, options: FirestoreServiceOptions = defaultFirestoreServiceOptions): FirestoreServiceResult<T> => {
	const { successMessage, errorMessage, immediate = true, silent = false } = options
	const [data, setData] = useState<T | null>(null)
	const [error, setError] = useState<Error | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const isMounted = useRef(true)

	useEffect(() => {
		isMounted.current = true
		return () => { isMounted.current = false }
	}, [])

	const readServiceQuery = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const result = await service()
			if (isMounted.current) setData(result)
			if (successMessage && !silent && isMounted.current) toast.success(successMessage)
		}
		catch (err: any) {
			if (isMounted.current) setError(err.message)
			if (!silent && isMounted.current) toast.error(errorMessage || err.message || 'An error occurred')
		}
		finally {
			if (isMounted.current) setLoading(false)
		}
	}, [service, successMessage, errorMessage, silent])
	
	useEffect(() => {
		if (immediate) readServiceQuery()
	}, [immediate, readServiceQuery])

	return { data, error, loading, refetch: readServiceQuery }
}