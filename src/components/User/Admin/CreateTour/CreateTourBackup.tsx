import { useEffect, useState } from 'react'

// Example hook for previewing a file URL
export function useFilePreviewUrl(fileList?: FileList) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  useEffect(() => {
    if (fileList?.[0]) {
      const url = URL.createObjectURL(fileList[0]);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(undefined);
  }, [fileList]);

  return previewUrl;
}

const CreateTourBackup = () => {
  // Example usage:
  // const watchImageCover = watch('imageCoverFile');
  // const coverPreviewUrl = useFilePreviewUrl(watchImageCover);
  return (
    <div>CreateTourBackup</div>
  )
}

export default CreateTourBackup