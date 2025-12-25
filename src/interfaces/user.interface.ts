export interface User {
  id: string
  username: string
  name: string
  email: string
  role: 'SUPERADMIN' | 'ACCOMMODATION_OWNER' | 'CUSTOMER'
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  createdAt: string
  updatedAt: string
}

export interface Customer extends User {
  saldo: number
}

export interface LoginRequest {
  identifier: string // email or username
  password: string
}

export interface RegisterRequest {
  role: 'CUSTOMER' | 'ACCOMMODATION_OWNER'
  username: string
  name: string
  email: string
  password: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  password?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  role?: 'SUPERADMIN' | 'ACCOMMODATION_OWNER' | 'CUSTOMER'
}

export interface LoginResponse {
  userId: string
  username: string
  name: string
  email: string
  role: string
  message: string
}

export interface ApiResponse<T> {
  status: 'success' | 'error'
  message: string
  data?: T
}
