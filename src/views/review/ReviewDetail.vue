<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading review details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
        <button
          @click="router.back()"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go Back
        </button>
      </div>

      <!-- Review Detail -->
      <div v-else-if="review" class="bg-white rounded-lg shadow-lg">
        <!-- Header -->
        <div class="border-b px-6 py-4">
          <button
            @click="router.back()"
            class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Review Details</h1>
        </div>

        <div class="p-6">
          <!-- Property and Customer Info -->
          <div class="mb-6 pb-6 border-b">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 class="text-sm font-medium text-gray-500 mb-1">Property</h2>
                <p class="text-lg font-semibold text-gray-900">{{ review.propertyName }}</p>
              </div>
              <div>
                <h2 class="text-sm font-medium text-gray-500 mb-1">Reviewed By</h2>
                <p class="text-lg font-semibold text-gray-900">{{ review.customerName }}</p>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 class="text-sm font-medium text-gray-500 mb-1">Booking ID</h2>
                <p 
                  class="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                  @click="navigateToBooking(review.bookingID)"
                >
                  {{ review.bookingID }}
                </p>
              </div>
              <div>
                <h2 class="text-sm font-medium text-gray-500 mb-1">Review Date</h2>
                <p class="text-gray-900">{{ formatDate(review.createdDate) }}</p>
              </div>
            </div>
          </div>

          <!-- Overall Rating -->
          <div class="mb-6 pb-6 border-b">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Overall Rating</h2>
            <div class="flex items-center justify-center bg-blue-50 rounded-lg p-6">
              <div class="text-center">
                <div class="flex items-center justify-center mb-2">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="text-4xl"
                    :class="star <= Math.round(review.overallRating) ? 'text-yellow-400' : 'text-gray-300'"
                  >
                    ★
                  </span>
                </div>
                <p class="text-4xl font-bold text-gray-900">{{ review.overallRating.toFixed(1) }}</p>
                <p class="text-sm text-gray-500 mt-1">out of 5</p>
              </div>
            </div>
          </div>

          <!-- Rating Categories -->
          <div class="mb-6 pb-6 border-b">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Rating Breakdown</h2>
            <div class="space-y-4">
              <!-- Cleanliness Rating -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-700 mb-2">Cleanliness Rating</p>
                  <div class="flex items-center">
                    <span
                      v-for="star in 5"
                      :key="'clean-' + star"
                      class="text-2xl"
                      :class="star <= review.cleanlinessRating ? 'text-yellow-400' : 'text-gray-300'"
                    >
                      ★
                    </span>
                    <span class="ml-3 text-lg font-bold text-gray-900">{{ review.cleanlinessRating }}/5</span>
                  </div>
                </div>
              </div>

              <!-- Facility Rating -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-700 mb-2">Facility Rating</p>
                  <div class="flex items-center">
                    <span
                      v-for="star in 5"
                      :key="'facility-' + star"
                      class="text-2xl"
                      :class="star <= review.facilityRating ? 'text-yellow-400' : 'text-gray-300'"
                    >
                      ★
                    </span>
                    <span class="ml-3 text-lg font-bold text-gray-900">{{ review.facilityRating }}/5</span>
                  </div>
                </div>
              </div>

              <!-- Service Rating -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-700 mb-2">Service Rating</p>
                  <div class="flex items-center">
                    <span
                      v-for="star in 5"
                      :key="'service-' + star"
                      class="text-2xl"
                      :class="star <= review.serviceRating ? 'text-yellow-400' : 'text-gray-300'"
                    >
                      ★
                    </span>
                    <span class="ml-3 text-lg font-bold text-gray-900">{{ review.serviceRating }}/5</span>
                  </div>
                </div>
              </div>

              <!-- Value Rating -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-700 mb-2">Value Rating</p>
                  <div class="flex items-center">
                    <span
                      v-for="star in 5"
                      :key="'value-' + star"
                      class="text-2xl"
                      :class="star <= review.valueRating ? 'text-yellow-400' : 'text-gray-300'"
                    >
                      ★
                    </span>
                    <span class="ml-3 text-lg font-bold text-gray-900">{{ review.valueRating }}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comment -->
          <div v-if="review.comment">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Review Comment</h2>
            <div class="bg-gray-50 rounded-lg p-6">
              <p class="text-gray-700 whitespace-pre-wrap">{{ review.comment }}</p>
            </div>
          </div>
          <div v-else>
            <h2 class="text-xl font-bold text-gray-900 mb-4">Review Comment</h2>
            <div class="bg-gray-50 rounded-lg p-6">
              <p class="text-gray-500 italic">No comment provided</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { reviewService } from '@/services/review.service'
import type { Review } from '@/interfaces/review.interface'

const router = useRouter()
const route = useRoute()

const review = ref<Review | null>(null)
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

const navigateToBooking = (bookingID: string) => {
  router.push({ name: 'BookingDetail', params: { id: bookingID } })
}

const loadReviewDetail = async () => {
  try {
    isLoading.value = true
    error.value = null

    const reviewID = route.params.id as string
    if (!reviewID) {
      throw new Error('Review ID is required')
    }

    const response = await reviewService.getReviewById(reviewID)
    review.value = response
  } catch (err: any) {
    console.error('Error loading review details:', err)
    error.value = err.response?.data?.message || 'Failed to load review details'
    
    if (err.response?.status === 403) {
      toast.error('You do not have permission to view this review')
      router.push({ name: 'Home' })
    } else if (err.response?.status === 404) {
      toast.error('Review not found')
      router.push({ name: 'Home' })
    } else if (error.value) {
      toast.error(error.value)
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadReviewDetail()
})
</script>
