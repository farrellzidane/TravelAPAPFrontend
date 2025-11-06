export interface Property {
  propertyID?: string
  propertyName: string
  type: number
  typeName: string
  address: string
  province: number
  description: string
  totalRoom: number
  activeStatus: number
  activeStatusName: string
  income: number
  ownerName: string
  ownerID: string
  createdDate: string
  updatedDate: string
  roomTypes: RoomType[] | null
}

export interface RoomType {
  roomTypeID: string
  name: string
  price: number
  description: string
  capacity: number
  facility: string
  floor: number
}

export interface PropertyFilter {
  search: string
  type: string
  status: string
}

export enum PropertyType {
  HOTEL = 'Hotel',
  VILLA = 'Villa',
  APARTMENT = 'Apartemen'
}

export enum PropertyStatus {
  ACTIVE = 'Active',
  NON_ACTIVE = 'Non Active'
}

export interface Province {
  code: string
  name: string
}

export interface RoomTypeForm {
  id: string
  name: string
  facility: string
  capacity: number | null
  price: number | null
  floor: number | null
  unit: number | null
  description: string
}

export interface CreatePropertyRequest {
  propertyName: string
  propertyType: string
  province: string
  address: string
  description: string
  ownerID: string
  ownerName: string
  roomTypes: Array<{
    name: string
    facility: string
    capacity: number
    price: number
    floor: number
    unit: number
    description: string
  }>
}

export interface ApiResponse<T> {
  status: number
  message: string
  timestamp: string
  data: T
}

export const ROOM_TYPE_OPTIONS: Record<string, string[]> = {
  Hotel: [
    'Single Room',
    'Double Room',
    'Deluxe Room',
    'Superior Room',
    'Suite',
    'Family Room'
  ],
  Villa: [
    'Luxury',
    'Beachfront',
    'Mountside',
    'Eco-friendly',
    'Romantic'
  ],
  Apartemen: [
    'Studio',
    '1BR',
    '2BR',
    '3BR',
    'Penthouse'
  ]
}