<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
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
        <h1 class="text-3xl font-bold text-gray-900">Property Reviews</h1>
        <p v-if="propertyName" class="mt-2 text-gray-600">Reviews for {{ propertyName }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading reviews...</p>
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
        <p class="mt-1 text-gray-500">This property hasn't received any reviews.</p>
      </div>

      <!-- Reviews List -->
      <div v-else class="space-y-6">
        <div
          v-for="review in reviews"
          :key="review.reviewID"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateToDetail(review.reviewID)"
        >
          <!-- Review Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ review.customerName }}</h3>
              <p class="text-sm text-gray-500">{{ formatDate(review.createdDate) }}</p>
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
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Cleanliness</p>
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
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Facility</p>
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
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Service</p>
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
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Value</p>
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
            </div>
          </div>

          <!-- Comment Preview -->
          <div v-if="review.comment" class="border-t pt-4">
            <p class="text-gray-700 line-clamp-3">{{ review.comment }}</p>
          </div>

          <!-- View Details Link -->
          <div class="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
            View full review →
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

const reviews = ref<Review[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const propertyName = ref<string>('')

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

const loadReviews = async () => {
  try {
    isLoading.value = true
    error.value = null

    const propertyID = route.params.propertyId as string
    if (!propertyID) {
      throw new Error('Property ID is required')
    }

    const response = await reviewService.getReviewsByProperty(propertyID)
    reviews.value = response

    // Get property name from first review if available
    if (response.length > 0 && response[0]) {
      propertyName.value = response[0].propertyName
    }
  } catch (err: any) {
    console.error('Error loading reviews:', err)
    error.value = err.response?.data?.message || 'Failed to load reviews'
    
    if (err.response?.status === 403) {
      toast.error('You do not have permission to view these reviews')
      router.push({ name: 'PropertyList' })
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

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
