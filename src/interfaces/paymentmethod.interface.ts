export interface PaymentMethod {
  paymentMethodId: string
  methodName: string
  provider: string
  status: string
  statusText?: string
  statusColor?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentMethodRequest {
  methodName: string
  provider: string
}

export interface UpdatePaymentMethodStatusRequest {
  paymentMethodId: string
  status: string
}

export enum PaymentMethodStatus {
  INACTIVE = 'Inactive',
  ACTIVE = 'Active'
}

export const PaymentMethodStatusNames: Record<string, string> = {
  'Inactive': 'Inactive',
  'Active': 'Active'
}

export const PaymentMethodStatusColors: Record<string, string> = {
  'Inactive': 'danger',
  'Active': 'success'
}

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
  timestamp: string
}
