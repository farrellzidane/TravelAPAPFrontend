<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <h1 class="text-3xl font-bold text-gray-900">Write a Review</h1>
        <p class="mt-2 text-gray-600">Share your experience with this property</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <form @submit.prevent="handleSubmit">
          <!-- Booking Info Display (if bookingId provided) -->
          <div v-if="bookingId" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-gray-700">
              <span class="font-medium">Booking ID:</span> {{ bookingId }}
            </p>
          </div>

          <!-- Cleanliness Rating -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cleanliness Rating <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center space-x-2">
              <button
                v-for="star in 5"
                :key="'cleanliness-' + star"
                type="button"
                @click="formData.cleanlinessRating = star"
                class="focus:outline-none transition-transform hover:scale-110"
              >
                <span
                  class="text-4xl"
                  :class="star <= formData.cleanlinessRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </button>
              <span class="ml-4 text-lg font-semibold text-gray-900">
                {{ formData.cleanlinessRating }}/5
              </span>
            </div>
            <p v-if="errors.cleanlinessRating" class="mt-1 text-sm text-red-600">
              {{ errors.cleanlinessRating }}
            </p>
          </div>

          <!-- Facility Rating -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Facility Rating <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center space-x-2">
              <button
                v-for="star in 5"
                :key="'facility-' + star"
                type="button"
                @click="formData.facilityRating = star"
                class="focus:outline-none transition-transform hover:scale-110"
              >
                <span
                  class="text-4xl"
                  :class="star <= formData.facilityRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </button>
              <span class="ml-4 text-lg font-semibold text-gray-900">
                {{ formData.facilityRating }}/5
              </span>
            </div>
            <p v-if="errors.facilityRating" class="mt-1 text-sm text-red-600">
              {{ errors.facilityRating }}
            </p>
          </div>

          <!-- Service Rating -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Service Rating <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center space-x-2">
              <button
                v-for="star in 5"
                :key="'service-' + star"
                type="button"
                @click="formData.serviceRating = star"
                class="focus:outline-none transition-transform hover:scale-110"
              >
                <span
                  class="text-4xl"
                  :class="star <= formData.serviceRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </button>
              <span class="ml-4 text-lg font-semibold text-gray-900">
                {{ formData.serviceRating }}/5
              </span>
            </div>
            <p v-if="errors.serviceRating" class="mt-1 text-sm text-red-600">
              {{ errors.serviceRating }}
            </p>
          </div>

          <!-- Value Rating -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Value Rating <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center space-x-2">
              <button
                v-for="star in 5"
                :key="'value-' + star"
                type="button"
                @click="formData.valueRating = star"
                class="focus:outline-none transition-transform hover:scale-110"
              >
                <span
                  class="text-4xl"
                  :class="star <= formData.valueRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </button>
              <span class="ml-4 text-lg font-semibold text-gray-900">
                {{ formData.valueRating }}/5
              </span>
            </div>
            <p v-if="errors.valueRating" class="mt-1 text-sm text-red-600">
              {{ errors.valueRating }}
            </p>
          </div>

          <!-- Overall Rating Preview -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700 mb-2">Overall Rating (Average)</p>
            <div class="flex items-center">
              <div class="flex items-center">
                <span
                  v-for="star in 5"
                  :key="'overall-' + star"
                  class="text-3xl"
                  :class="star <= Math.round(overallRating) ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
              </div>
              <span class="ml-4 text-2xl font-bold text-gray-900">
                {{ overallRating.toFixed(1) }}/5
              </span>
            </div>
          </div>

          <!-- Comment -->
          <div class="mb-6">
            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              id="comment"
              v-model="formData.comment"
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your experience with this property..."
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">Optional: Share more details about your stay</p>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="router.back()"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { reviewService } from '@/services/review.service'
import { useAuthStore } from '@/stores/auth/auth.store'
import type { CreateReviewRequest } from '@/interfaces/review.interface'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

const bookingId = ref<string>('')
const isSubmitting = ref(false)

const formData = ref<CreateReviewRequest>({
  bookingID: '',
  cleanlinessRating: 0,
  facilityRating: 0,
  serviceRating: 0,
  valueRating: 0,
  comment: ''
})

const errors = ref({
  cleanlinessRating: '',
  facilityRating: '',
  serviceRating: '',
  valueRating: ''
})

const overallRating = computed(() => {
  const ratings = [
    formData.value.cleanlinessRating,
    formData.value.facilityRating,
    formData.value.serviceRating,
    formData.value.valueRating
  ]
  const validRatings = ratings.filter(r => r > 0)
  if (validRatings.length === 0) return 0
  return validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length
})

const validateForm = (): boolean => {
  let isValid = true
  errors.value = {
    cleanlinessRating: '',
    facilityRating: '',
    serviceRating: '',
    valueRating: ''
  }

  if (formData.value.cleanlinessRating < 1 || formData.value.cleanlinessRating > 5) {
    errors.value.cleanlinessRating = 'Please select a cleanliness rating (1-5)'
    isValid = false
  }

  if (formData.value.facilityRating < 1 || formData.value.facilityRating > 5) {
    errors.value.facilityRating = 'Please select a facility rating (1-5)'
    isValid = false
  }

  if (formData.value.serviceRating < 1 || formData.value.serviceRating > 5) {
    errors.value.serviceRating = 'Please select a service rating (1-5)'
    isValid = false
  }

  if (formData.value.valueRating < 1 || formData.value.valueRating > 5) {
    errors.value.valueRating = 'Please select a value rating (1-5)'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please provide all required ratings')
    return
  }

  try {
    isSubmitting.value = true

    await reviewService.createReview(formData.value)
    
    toast.success('Review submitted successfully!')
    router.push({ name: 'CustomerReviews' })
  } catch (err: any) {
    console.error('Error submitting review:', err)
    // Extract error message from response
    let errorMessage = 'Failed to submit review'
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message
      // Remove "Error: " prefix if exists
      errorMessage = errorMessage.replace(/^Error:\s*/i, '')
    } else if (err.message) {
      errorMessage = err.message
      // Remove "Error: " prefix if exists
      errorMessage = errorMessage.replace(/^Error:\s*/i, '')
    }
    
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // Check if user is customer
  if (authStore.currentUserInfo?.role !== 'CUSTOMER') {
    toast.error('Only customers can create reviews')
    router.push({ name: 'home' })
    return
  }

  // Get booking ID from route params
  const paramBookingId = route.params.bookingId as string
  if (paramBookingId) {
    bookingId.value = paramBookingId
    formData.value.bookingID = paramBookingId
  } else {
    toast.error('Booking ID is required to create a review')
    router.back()
  }
})
</script>
