export type User = {
  id: string
  name: string
  email: string
  photoURL: string
  role: 'user' | 'admin'
}