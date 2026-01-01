export interface Bill {
  billId: string
  customerId: string
  customerName: string
  customerEmail?: string
  serviceName: string
  serviceReferenceId: string
  description: string
  amount: number
  status: number // 0 = Unpaid, 1 = Paid
  statusText?: string
  statusColor?: string
  createdAt: string
  updatedAt: string
  paymentTimestamp?: string
}

export interface CreateBillRequest {
  customerId: string
  serviceName: string
  serviceReferenceId: string
  description: string
  amount: number
  apiKey: string
}

export interface UpdateBillRequest {
  customerId: string
  serviceName: string
  serviceReferenceId: string
  description: string
  amount: number
  apiKey: string
}

export interface PayBillRequest {
  couponCode?: string
}

export interface BillFilter {
  customerId?: string
  serviceName?: string
  status?: number | string
  sortBy?: string
  sortDirection?: string
}

export enum BillStatus {
  UNPAID = 0,
  PAID = 1
}

export const BillStatusNames: Record<number, string> = {
  0: 'Unpaid',
  1: 'Paid'
}

export const BillStatusColors: Record<number, string> = {
  0: 'warning',
  1: 'success'
}

export const ServiceNames = [
  'Accommodation',
  'TopUp',
  'Flight',
  'Insurance',
  'VehicleRental',
  'TourPackage'
] as const

export type ServiceName = typeof ServiceNames[number]

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
  timestamp: string
}
