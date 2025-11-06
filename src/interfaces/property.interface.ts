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

export interface RoomType {
  roomTypeID: string
  roomTypeName: string
  floor: number
  capacity: number
  price: number
  facility: string
  description: string
  roomIDs: string[] | null
  listRoom: Room[] | null
  createdDate: string
  updatedDate: string
}

export interface Room {
  roomID: string
  name: string
  availabilityStatus: number
  availabilityStatusName: string
  activeRoom: number
  activeRoomName: string
  maintenanceStart: string | null
  maintenanceEnd: string | null
  capacity: number
  price: number
  floor: number
  roomTypeID: string
  roomTypeName: string
  createdDate: string
  updatedDate: string
}

export interface PropertyFilter {
  search: string
  type: string
  status: string
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
  address: string
  description: string
  roomTypes: Array<{
    roomTypeID: string
    capacity: number
    price: number
    floor: number
    description: string
  }>
}

export interface UpdateRoomTypeForm {
  roomTypeID: string
  roomTypeName: string
  facility: string
  capacity: number
  price: number
  floor: number
  description: string
}

export interface AddRoomTypeRequest {
  propertyID: string
  roomTypes: Array<{
    roomTypeName: string
    facility: string
    capacity: number
    price: number
    floor: number
    unitCount: number
    description: string
  }>
}

export interface AddRoomTypeForm {
  id: string
  roomTypeName: string
  facility: string
  capacity: number | null
  price: number | null
  floor: number | null
  unitCount: number | null
  description: string
}

export interface CreateMaintenanceRequest {
  roomID: string
  maintenanceStart: string
  maintenanceEnd: string
}

export interface MaintenanceForm {
  maintenanceStart: string
  maintenanceEnd: string
}
// ==== helper interfaces ====

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