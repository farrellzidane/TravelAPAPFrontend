export interface UserProfile {
  userId: string
  username: string
  name: string
  email: string
  saldo?: number
  gender: string
  createdAt: string
  updatedAt: string
  deletedAt: boolean
  role: string

  phone?: string
  listOfLocations?: string[]
}

export interface UserProfileRequest {
  id?: string 
  username?: string
  name?: string
  email?: string
  password?: string 
  gender?: string

  saldo?: number
  phone?: string
  listOfLocations?: string[]
}

export interface CurrentUser {
  userId: string
  username: string
  name: string
  email: string
  password: string
  gender: string
  saldo?: number
  role: string
}

export enum UserRoleType {
  SUPERADMIN = "Superadmin",
  ACCOMMODATION_OWNER = "Accommodation Owner",
  FLIGHT_AIRLINE = "Flight Airline",
  CUSTOMER = "Customer",
  INSURANCE_PROVIDER = "Insurance Provider",
  TOUR_PACKAGE_VENDOR = "Tour Package Vendor",
  RENTAL_VENDOR = "Rental Vendor",
}