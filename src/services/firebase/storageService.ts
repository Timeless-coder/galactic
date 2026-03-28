import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export const deleteProfileImageIfNeeded = async (photoURL: string): Promise<void> => {
  if (!photoURL || photoURL.includes('Anonymous.jpg')) return
  try {
    const storage = getStorage()
    await deleteObject(ref(storage, photoURL))
  }
  catch {
    // Ignore if image doesn't exist or can't be deleted
  }
}

export const uploadProfileImage = async (file: File, fileName: string): Promise<string> => {
  const storage = getStorage()
  const imageRef = ref(storage, fileName)
  await uploadBytes(imageRef, file)
  return getDownloadURL(imageRef)
}

export const uploadTourImage = async (file: File, fileName: string): Promise<string> => {
  const storage = getStorage()
  const imageRef = ref(storage, `tourImages/${fileName}`)
  await uploadBytes(imageRef, file)
  return getDownloadURL(imageRef)
}

