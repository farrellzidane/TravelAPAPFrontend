export interface Review {
  reviewID: string
  bookingID: string
  customerID: string
  customerName: string
  propertyName: string
  overallRating: number
  cleanlinessRating: number
  facilityRating: number
  serviceRating: number
  valueRating: number
  comment: string
  createdDate: string
}

export interface CreateReviewRequest {
  bookingID: string
  cleanlinessRating: number
  facilityRating: number
  serviceRating: number
  valueRating: number
  comment: string
}
