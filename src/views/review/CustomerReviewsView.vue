<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Reviews</h1>
        <p class="mt-2 text-gray-600">All reviews you have written</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading your reviews...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!reviews || reviews.length === 0"
        class="text-center py-12 bg-white rounded-lg shadow"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No reviews yet</h3>
        <p class="mt-1 text-gray-500">You haven't written any reviews. Complete a booking to leave a review!</p>
      </div>

      <!-- Reviews List -->
      <div v-else class="space-y-6">
        <div
          v-for="review in reviews"
          :key="review.reviewID"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <!-- Review Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 
                class="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                @click="navigateToProperty(review.bookingID)"
              >
                {{ review.propertyName }}
              </h3>
              <p class="text-sm text-gray-500">{{ formatDate(review.createdDate) }}</p>
              <p class="text-xs text-gray-400 mt-1">Booking ID: {{ review.bookingID }}</p>
            </div>
            <div class="flex items-center">
              <div class="flex items-center">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-2xl"
                  :class="star <= Math.round(review.overallRating) ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </div>
              <span class="ml-2 text-xl font-bold text-gray-900">{{ review.overallRating.toFixed(1) }}</span>
            </div>
          </div>

          <!-- Rating Categories -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div class="text-center bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-2">Cleanliness</p>
              <div class="flex items-center justify-center">
                <span
                  v-for="star in 5"
                  :key="'clean-' + star"
                  class="text-sm"
                  :class="star <= review.cleanlinessRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </div>
              <p class="text-sm font-semibold mt-1">{{ review.cleanlinessRating }}/5</p>
            </div>
            <div class="text-center bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-2">Facility</p>
              <div class="flex items-center justify-center">
                <span
                  v-for="star in 5"
                  :key="'facility-' + star"
                  class="text-sm"
                  :class="star <= review.facilityRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </div>
              <p class="text-sm font-semibold mt-1">{{ review.facilityRating }}/5</p>
            </div>
            <div class="text-center bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-2">Service</p>
              <div class="flex items-center justify-center">
                <span
                  v-for="star in 5"
                  :key="'service-' + star"
                  class="text-sm"
                  :class="star <= review.serviceRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </div>
              <p class="text-sm font-semibold mt-1">{{ review.serviceRating }}/5</p>
            </div>
            <div class="text-center bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-2">Value</p>
              <div class="flex items-center justify-center">
                <span
                  v-for="star in 5"
                  :key="'value-' + star"
                  class="text-sm"
                  :class="star <= review.valueRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </div>
              <p class="text-sm font-semibold mt-1">{{ review.valueRating }}/5</p>
            </div>
          </div>

          <!-- Comment -->
          <div v-if="review.comment" class="border-t pt-4">
            <p class="text-sm text-gray-500 mb-2">Your Review:</p>
            <p class="text-gray-700">{{ review.comment }}</p>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex justify-end space-x-3">
            <button
              @click="navigateToDetail(review.reviewID)"
              class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { reviewService } from '@/services/review.service'
import { getCurrentRole, getCurrentUserId, isCustomer } from '@/config/axios.config'
import type { Review } from '@/interfaces/review.interface'

const router = useRouter()

const reviews = ref<Review[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const navigateToDetail = (reviewID: string) => {
  router.push({ name: 'ReviewDetail', params: { id: reviewID } })
}

const navigateToProperty = (bookingID: string) => {
  // Navigate to booking detail which shows property info
  router.push({ name: 'BookingDetail', params: { id: bookingID } })
}

const loadReviews = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Check if user is customer
    const role = getCurrentRole()
    if (!isCustomer(role)) {
      toast.error('Only customers can access this page')
      router.push({ name: 'Home' })
      return
    }

    // Get current user ID
    const customerID = getCurrentUserId()
    if (!customerID) {
      toast.error('Failed to get customer information')
      router.push({ name: 'Home' })
      return
    }

    const response = await reviewService.getReviewsByCustomer(customerID)
    reviews.value = response
  } catch (err: any) {
    console.error('Error loading reviews:', err)
    error.value = err.response?.data?.message || 'Failed to load your reviews'
    
    if (err.response?.status === 403) {
      toast.error('You do not have permission to view this page')
      router.push({ name: 'Home' })
    } else if (error.value) {
      toast.error(error.value)
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadReviews()
})
</script>
