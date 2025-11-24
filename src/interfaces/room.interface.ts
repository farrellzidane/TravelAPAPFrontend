// Room and RoomType related interfaces

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
  propertyId: string
  roomTypes: Array<{
    name: string
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
