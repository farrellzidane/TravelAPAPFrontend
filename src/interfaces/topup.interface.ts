export interface TopUpTransaction {
  transactionId: string
  endUserId: string
  paymentMethodId: string
  paymentMethodName?: string
  provider?: string
  amount: number
  status: string
  statusText?: string
  statusColor?: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface CreateTopUpRequest {
  customerId: string
  amount: number
  paymentMethodId: string
}

export interface UpdateTopUpStatusRequest {
  transactionId: string
  status: string
}

export enum TopUpStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAILED = 'Failed'
}

export const TopUpStatusNames: Record<string, string> = {
  'Pending': 'Pending',
  'Success': 'Success',
  'Failed': 'Failed'
}

export const TopUpStatusColors: Record<string, string> = {
  'Pending': 'warning',
  'Success': 'success',
  'Failed': 'danger'
}

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
  timestamp: string
}
