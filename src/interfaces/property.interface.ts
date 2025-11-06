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
  roomTypeID?: string
  roomTypeName: string
  floor: number
  capacity: number
  price: number
  facility: string
  description: string
  roomIDs: string[]
  listRoom: any[] | null
  createdDate: string | null
  updatedDate: string | null
}

export interface PropertyFilter {
  search: string
  type: string
  status: string
}

export enum PropertyType {
  HOTEL = 1,
  VILLA = 2,
  APARTMENT = 3
}

export const PropertyTypeNames: Record<number, string> = {
  1: 'Hotel',
  2: 'Villa',
  3: 'Apartemen'
}

export const PropertyTypeByName: Record<string, number> = {
  'Hotel': 1,
  'Villa': 2,
  'Apartemen': 3
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
  roomTypeName: string
  facility: string
  capacity: number | null
  price: number | null
  floor: number | null
  unitCount: number | null
  roomTypeDescription: string
}

// Request sesuai dengan BE
export interface CreatePropertyRequest {
  propertyName: string
  type: number  // 1=Hotel, 2=Villa, 3=Apartemen
  address: string
  province: number  // province code as number
  description: string
  totalRoom: number  // total dari semua unitCount
  ownerName: string
  ownerID: string
  roomTypes: Array<{
    roomTypeName: string
    roomTypeDescription: string
    capacity: number
    price: number
    facility: string
    unitCount: number
    floor: number
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