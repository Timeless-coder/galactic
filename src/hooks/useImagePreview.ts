import { useState, useEffect } from 'react'

export const useImagePreviewUrl = (fileList?: FileList) => {
	const [previewUrl, setPreviewUrl] = useState<string | undefined>()

	useEffect(() => {
		if (fileList?.[0]) {
			const url = URL.createObjectURL(fileList[0])
			setPreviewUrl(url)
			return () => URL.revokeObjectURL(url)
		}
		setPreviewUrl(undefined)
	}, [fileList])

	return previewUrl
}