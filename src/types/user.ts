export enum Role {
  Admin = 'admin',
  User = 'user'
}

export type User = {
  id: string
  displayName: string
  email: string
  photoURL: string
  role: Role
  providerId: string
  createdAt: string
}