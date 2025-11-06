export interface PropertyRevenue {
  propertyID: string
  propertyName: string
  propertyType: string
  totalBookings: number
  totalRevenue: number
  percentage: number
}

export interface BookingChartData {
  period: string
  month: number
  year: number
  totalProperties: number
  totalRevenue: number
  propertyRevenues: PropertyRevenue[]
}
