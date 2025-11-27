import type { RoomType, Room } from './room.interface'

export interface Property {
  propertyID: string
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

export interface PropertyFilter {
  name: string
  type: number | string
  province: number | string
}

export interface DateFilter {
  checkIn: string
  checkOut: string
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

export interface CreatePropertyRequest {
  propertyName: string
  type: number
  address: string
  province: number
  description: string
  totalRoom: number
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

export interface UpdatePropertyRequest {
  propertyID: string
  propertyName: string
  type: number
  address: string
  province: number
  description: string
  roomTypes: Array<{
    roomTypeID: string
    capacity: number
    price: number
    floor: number
    description: string
  }>
}

// ==== helper interfaces ====

export interface ApiResponse<T> {
  status: number
  message: string
  timestamp: string
  data: T
}

// Province Map for display
export const PROVINCE_MAP: Record<number, string> = {
  11: 'Aceh',
  12: 'Sumatera Utara',
  13: 'Sumatera Barat',
  14: 'Riau',
  15: 'Jambi',
  16: 'Sumatera Selatan',
  17: 'Bengkulu',
  18: 'Lampung',
  19: 'Kepulauan Bangka Belitung',
  21: 'Kepulauan Riau',
  31: 'DKI Jakarta',
  32: 'Jawa Barat',
  33: 'Jawa Tengah',
  34: 'DI Yogyakarta',
  35: 'Jawa Timur',
  36: 'Banten',
  51: 'Bali',
  52: 'Nusa Tenggara Barat',
  53: 'Nusa Tenggara Timur',
  61: 'Kalimantan Barat',
  62: 'Kalimantan Tengah',
  63: 'Kalimantan Selatan',
  64: 'Kalimantan Timur',
  65: 'Kalimantan Utara',
  71: 'Sulawesi Utara',
  72: 'Sulawesi Tengah',
  73: 'Sulawesi Selatan',
  74: 'Sulawesi Tenggara',
  75: 'Gorontalo',
  76: 'Sulawesi Barat',
  81: 'Maluku',
  82: 'Maluku Utara',
  91: 'Papua',
  92: 'Papua Barat',
}