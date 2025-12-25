<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Add New Booking</h1>
        <p class="text-gray-600">Fill in the booking details below</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Row 1: Room ID and Room Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Room ID (Disabled) -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Room ID
              </label>
              <input
                v-model="formData.roomID"
                type="text"
                disabled
                class="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>

            <!-- Room Name (Disabled) -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Room Name
              </label>
              <input
                v-model="formData.roomNumber"
                type="text"
                disabled
                class="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>

          <!-- Row 2: Check-in and Check-out Date -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Check-in Date -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Check-in Date <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.checkInDate"
                type="date"
                required
                :min="minDate"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Check-out Date -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Check-out Date <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.checkOutDate"
                type="date"
                required
                :min="formData.checkInDate || minDate"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Row 3: Customer ID and Customer Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Customer ID (Disabled) -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Customer ID <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.customerID"
                type="text"
                required
                disabled
                placeholder="550e8400-e29b-41d4-a716-446655440000"
                class="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>

            <!-- Customer Name -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Customer Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.customerName"
                type="text"
                required
                placeholder="John Doe"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Row 4: Customer Email and Customer Phone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Customer Email -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Customer Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.customerEmail"
                type="email"
                required
                placeholder="john.doe@example.com"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Customer Phone -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Customer Phone <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.customerPhone"
                type="tel"
                required
                placeholder="081234567890"
                pattern="[0-9]{10,13}"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Format: 10-13 digits</p>
            </div>
          </div>

          <!-- Row 5: Capacity and Breakfast -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Capacity -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Capacity <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.capacity"
                type="number"
                required
                min="1"
                placeholder="0"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Breakfast -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Breakfast (+ Rp 50.000) <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.isBreakfast"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="false">No</option>
                <option :value="true">Yes</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="button"
              @click="handleBack"
              :disabled="submitting"
              class="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="submitting" class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              <span>{{ submitting ? 'Saving...' : 'Save' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { bookingService } from '@/services/booking.service'
import type { CreateBookingRequest } from '@/interfaces/booking.interface'
import { useAuthStore } from '@/stores/auth/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const submitting = ref(false)

interface BookingFormData {
  roomID: string
  roomNumber: string
  checkInDate: string
  checkOutDate: string
  customerID: string
  customerName: string
  customerEmail: string
  customerPhone: string
  isBreakfast: boolean
  capacity: number
}

const formData = ref<BookingFormData>({
  roomID: '',
  roomNumber: '',
  checkInDate: '',
  checkOutDate: '',
  customerID: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  isBreakfast: false,
  capacity: 0
})

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})
const initializeForm = () => {
  // Get roomID from route params
  const roomID = route.params.idRoom as string
  
  // Get check-in and check-out from query params (from the property detail page filter)
  const checkIn = route.query.checkIn as string
  const checkOut = route.query.checkOut as string
  const roomNumber = route.query.roomNumber as string

  if (!roomID) {
    toast.error('Room ID is missing')
    router.push('/property')
    return
  }

  // Check if user is customer
  const currentRole = authStore.currentUserInfo?.role || ''
  const isCustomer = currentRole === 'CUSTOMER' || currentRole === 'Customer'
  if (!isCustomer) {
    toast.error('Only customers can create bookings')
    router.push('/bookings')
    return
  }

  formData.value.roomID = roomID
  formData.value.roomNumber = roomNumber || ''
  
  // Auto-fill customer ID from current user
  formData.value.customerID = authStore.currentUserInfo?.userId || ''
  
  if (checkIn) {
    formData.value.checkInDate = checkIn
  }
  
  if (checkOut) {
    formData.value.checkOutDate = checkOut
  }
} 


const handleSubmit = async () => {
  // Validate check-out date
  if (new Date(formData.value.checkOutDate) <= new Date(formData.value.checkInDate)) {
    toast.error('Check-out date must be after check-in date')
    return
  }

  // Validate capacity
  if (formData.value.capacity < 1) {
    toast.error('Capacity must be at least 1')
    return
  }

  // Validate UUID format for customer ID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(formData.value.customerID)) {
    toast.error('Customer ID must be a valid UUID format')
    return
  }

  try {
    submitting.value = true

    // Format dates to ISO 8601 format with time
    const checkInDateTime = `${formData.value.checkInDate}T14:00:00`
    const checkOutDateTime = `${formData.value.checkOutDate}T12:00:00`

    const requestData: CreateBookingRequest = {
      roomID: formData.value.roomID,
      checkInDate: checkInDateTime,
      checkOutDate: checkOutDateTime,
      customerID: formData.value.customerID,
      customerName: formData.value.customerName,
      customerEmail: formData.value.customerEmail,
      customerPhone: formData.value.customerPhone,
      isBreakfast: formData.value.isBreakfast,
      capacity: formData.value.capacity
    }

    console.log('Submitting booking:', requestData)

    const result = await bookingService.createBooking(requestData)

    toast.success(`Booking successfully created with ID: ${result.bookingID}`)

    // Redirect to booking detail page or bookings list
    setTimeout(() => {
      router.push(`/bookings/${result.bookingID}`)
    }, 1500)

  } catch (error: any) {
    console.error('Error creating booking:', error)
    toast.error(error.message || 'Failed to create booking')
  } finally {
    submitting.value = false
  }
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  initializeForm()
})
</script>
