export interface Booking {
  bookingID: string
  roomID?: string
  propertyID?: string
  roomTypeID?: string
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
  // Removed: extraPay and refund fields as per updated requirements
  // extraPay: number
  // refund: number
  status: number // 0 = Waiting for Payment, 1 = Payment Confirmed, 2 = Cancelled
  statusText?: string
  statusColor?: string
  createdDate: string
  updatedDate: string
  canPay?: boolean
  canUpdate?: boolean
  // Removed: canRefund as refund feature removed
  // canRefund?: boolean
  canCancel?: boolean
  breakfast: boolean
  reviewID?: string // ID of the review if booking has been reviewed
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

export interface CreateBookingWithoutRoomRequest {
  propertyID: string
  roomTypeID: string
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

export interface UpdateBookingRequest {
  bookingID: string
  propertyID: string
  roomTypeID: string
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