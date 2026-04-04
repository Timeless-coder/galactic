import { useState, useCallback, useRef, useEffect } from 'react'

export type FirestoreMutateServiceOptions = {
	silent?: boolean
}

const defaultFirestoreCreateServiceOptions: FirestoreMutateServiceOptions = {
	silent: false
}

type FirestoreCreateServiceResult<T, TArgs extends any[]> = {
	error: Error | null
	loading: boolean
	mutate: (...args: TArgs) => Promise<T | void>
}

export const useFirestoreMutateService = <T, TArgs extends any[]>(service: (...args: TArgs) => Promise<T>, options: FirestoreMutateServiceOptions = defaultFirestoreCreateServiceOptions): FirestoreCreateServiceResult<T, TArgs> => {
	const { silent = false } = options
	const [error, setError] = useState<Error | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const serviceRef = useRef(service)
	
	useEffect(() => { serviceRef.current = service })

	const mutate = useCallback(async (...args: TArgs) => {
		setLoading(true)
		setError(null)

		try {
			return await serviceRef.current(...args)
		}
		catch (err: any) {
			setError(err instanceof Error ? err : new Error(String(err)))
		}
		finally {
			setLoading(false)
		}
	}, [silent])

	return { error, loading, mutate }
}
