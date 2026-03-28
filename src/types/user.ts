export enum Role {
  Admin = 'admin',
  User = 'user'
}

export type User = {
  id: string
  name: string
  email: string
  photoURL: string
  role: Role
  providerId?: string
}