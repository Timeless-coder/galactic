import { useState, useCallback, useRef, useEffect } from 'react'

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
	const { immediate = true } = options
	const [data, setData] = useState<T | null>(null)
	const [error, setError] = useState<Error | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const serviceRef = useRef(service)
	useEffect(() => { serviceRef.current = service })

	const readServiceQuery = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const result = await serviceRef.current()
			setData(result)
		}
		catch (err: any) {
			setError(err instanceof Error ? err : new Error(String(err)))
		}
		finally {
			setLoading(false)
		}
	}, [])
	
	useEffect(() => {
		if (immediate) readServiceQuery()
	}, [immediate, readServiceQuery])

	return { data, error, loading, refetch: readServiceQuery }
}