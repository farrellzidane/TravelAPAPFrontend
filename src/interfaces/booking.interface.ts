export interface Booking {
  bookingID: string
  propertyName?: string
  roomName?: string
  roomNumber: string
  customerID: string
  customerName: string
  customerEmail: string
  customerPhone: string
  checkInDate: string
  checkOutDate: string
  totalDays: number
  capacity: number
  totalPrice: number
  extraPay: number
  refund: number
  status: number
  statusText?: string
  statusColor?: string
  createdDate: string
  updatedDate: string
  canPay?: boolean
  canUpdate?: boolean
  canRefund?: boolean
  canCancel?: boolean
  breakfast: boolean
}

export interface CreateBookingRequest {
  roomID: string
  checkInDate: string
  checkOutDate: string
  customerID: string
  customerName: string
  customerEmail: string
  customerPhone: string
  isBreakfast: boolean
  capacity: number
}

export interface BookingFilter {
  status?: number | string
  search?: string
}