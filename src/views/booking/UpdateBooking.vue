<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Loading State -->
      <div v-if="loadingBooking" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p class="mt-4 text-gray-600 text-lg">Loading booking details...</p>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Update Booking</h1>
          <p class="text-gray-600">Modify booking details below</p>
          <p v-if="formData.bookingID" class="text-sm text-gray-500 mt-1">Booking ID: {{ formData.bookingID }}</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Row 1: Property Name and Room Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Property Name -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  Property <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.propertyID"
                  @change="onPropertyChange"
                  required
                  disabled
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                >
                  <option value="">Select Property</option>
                  <option 
                    v-for="property in activeProperties" 
                    :key="property.propertyID" 
                    :value="property.propertyID"
                  >
                    {{ property.propertyName }}
                  </option>
                </select>
              </div>

              <!-- Room Type -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  Room Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.roomTypeID"
                  @change="onRoomTypeChange"
                  required
                  disabled
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                >
                  <option value="">Select Room Type</option>
                  <option 
                    v-for="roomType in availableRoomTypes" 
                    :key="roomType.roomTypeID" 
                    :value="roomType.roomTypeID"
                  >
                    {{ roomType.roomTypeName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 2: Room Name and Capacity -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Room Name -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  Room Name <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.roomID"
                  @change="onRoomChange"
                  required
                  disabled
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                >
                  <option value="">Select Room</option>
                  <option 
                    v-for="room in availableRooms" 
                    :key="room.roomID" 
                    :value="room.roomID"
                  >
                    {{ room.name }}
                  </option>
                </select>
              </div>

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
                  :max="maxCapacity || undefined"
                  placeholder="0"
                  :disabled="!formData.roomTypeID"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p v-if="maxCapacity" class="text-xs text-gray-500 mt-1">
                  Maximum capacity: {{ maxCapacity }} {{ maxCapacity === 1 ? 'person' : 'people' }}
                </p>
              </div>
            </div>

            <!-- Row 3: Check-in and Check-out Date -->
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

            <!-- Row 4: Customer ID and Customer Name -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Customer ID -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  Customer ID <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.customerID"
                  type="text"
                  required
                  disabled
                  placeholder="550e8400-e29b-41d4-a716-446655440000"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <!-- Customer Name -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  Customer Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.customerName"
                  type="text"
                  required
                  disabled
                  placeholder="John Doe"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Row 5: Customer Email and Customer Phone -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Customer Email -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  Customer Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.customerEmail"
                  type="email"
                  required
                  disabled
                  placeholder="john.doe@example.com"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <!-- Customer Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  Customer Phone <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.customerPhone"
                  type="tel"
                  required
                  disabled
                  placeholder="081234567890"
                  pattern="[0-9]{10,13}"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <p class="text-xs text-gray-500 mt-1">Format: 10-13 digits</p>
              </div>
            </div>

            <!-- Row 6: Breakfast -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                :disabled="submitting || cancelling"
                class="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                type="button"
                @click="handleCancel"
                :disabled="submitting || cancelling"
                class="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg v-if="cancelling" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ cancelling ? 'Cancelling...' : 'Cancel Booking' }}</span>
              </button>
              <button
                type="submit"
                :disabled="submitting || cancelling || !isFormValid"
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

    <!-- Cancel Booking Confirmation -->
    <VConfirmDialog
      v-model="showCancelConfirm"
      title="Cancel Booking"
      variant="danger"
      message="Are you sure you want to cancel this booking?"
      subtitle="This action cannot be undone"
      confirm-text="Cancel Booking"
      cancel-text="Keep Booking"
      @confirm="confirmCancel"
      @cancel="showCancelConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { bookingService } from '@/services/booking.service'
import { propertyService } from '@/services/property.service'
import { useAuthStore } from '@/stores/auth/auth.store'
import type { UpdateBookingRequest, Booking } from '@/interfaces/booking.interface'
import type { Property } from '@/interfaces/property.interface'
import type { RoomType, Room } from '@/interfaces/room.interface'
import VConfirmDialog from '@/components/common/VConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const submitting = ref(false)
const cancelling = ref(false)
const showCancelConfirm = ref(false)
const loadingBooking = ref(false)
const loadingProperties = ref(false)
const loadingRoomTypes = ref(false)
const loadingRooms = ref(false)

const originalBooking = ref<Booking | null>(null)
const allProperties = ref<Property[]>([])
const selectedProperty = ref<Property | null>(null)
const availableRoomTypes = ref<RoomType[]>([])
const availableRooms = ref<Room[]>([])

interface BookingFormData {
  bookingID: string
  propertyID: string
  roomTypeID: string
  roomID: string
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
  bookingID: '',
  propertyID: '',
  roomTypeID: '',
  roomID: '',
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

const activeProperties = computed(() => {
  return allProperties.value.filter(p => p.activeStatus === 1)
})

const maxCapacity = computed(() => {
  if (!formData.value.roomTypeID) return null
  const roomType = availableRoomTypes.value.find(rt => rt.roomTypeID === formData.value.roomTypeID)
  return roomType ? roomType.capacity : null
})

const isFormValid = computed(() => {
  return (
    formData.value.bookingID &&
    formData.value.propertyID &&
    formData.value.roomTypeID &&
    formData.value.roomID &&
    formData.value.checkInDate &&
    formData.value.checkOutDate &&
    formData.value.customerID &&
    formData.value.customerName &&
    formData.value.customerEmail &&
    formData.value.customerPhone &&
    formData.value.capacity > 0
  )
})

// Fetch booking details
const fetchBookingDetails = async () => {
  const bookingId = route.params.id as string
  
  if (!bookingId) {
    toast.error('Booking ID is missing')
    router.push('/bookings')
    return
  }

  try {
    loadingBooking.value = true
    
    // Fetch booking details
    const booking = await bookingService.getBookingById(bookingId)
    originalBooking.value = booking
    
    // Check if booking can be updated
    if (!booking.canUpdate) {
      toast.error('This booking cannot be updated (has extra pay or refund)')
      router.push(`/bookings/${bookingId}`)
      return
    }
    
    // Fetch all properties
    allProperties.value = await propertyService.getAllProperties()
    
    // Prefill form data
    formData.value.bookingID = booking.bookingID
    formData.value.customerID = booking.customerID
    formData.value.customerName = booking.customerName
    formData.value.customerEmail = booking.customerEmail
    formData.value.customerPhone = booking.customerPhone
    formData.value.isBreakfast = booking.breakfast
    formData.value.capacity = booking.capacity
    
    // Format dates (convert from ISO to YYYY-MM-DD)
    if (booking.checkInDate) {
      const checkInParts = booking.checkInDate.split('T')
      if (checkInParts[0]) {
        formData.value.checkInDate = checkInParts[0]
      }
    }
    if (booking.checkOutDate) {
      const checkOutParts = booking.checkOutDate.split('T')
      if (checkOutParts[0]) {
        formData.value.checkOutDate = checkOutParts[0]
      }
    }
    
    // We need to determine propertyID and roomTypeID from roomID
    // The roomID format is like "HOT-7e6f-001-204"
    // Extract propertyID and roomTypeID from it
    if (booking.roomID) {
      const parts = booking.roomID.split('-')
      if (parts.length >= 3) {
        formData.value.propertyID = `${parts[0]}-${parts[1]}` // e.g., "HOT-7e6f"
        formData.value.roomTypeID = `${parts[0]}-${parts[1]}-${parts[2]}` // e.g., "HOT-7e6f-001"
        formData.value.roomID = booking.roomID
        
        // Load room types and rooms for the selected property
        await loadPropertyData(formData.value.propertyID, formData.value.roomTypeID, formData.value.roomID)
      }
    }
    
  } catch (error: any) {
    console.error('Error fetching booking details:', error)
    toast.error('Failed to load booking details')
    router.push('/bookings')
  } finally {
    loadingBooking.value = false
  }
}

// Load property, room types, and rooms data
const loadPropertyData = async (propertyID: string, roomTypeID: string, roomID: string) => {
  try {
    // Fetch property details to get room types
    const property = await propertyService.getPropertyById(propertyID)
    selectedProperty.value = property
    
    if (property.roomTypes && property.roomTypes.length > 0) {
      availableRoomTypes.value = property.roomTypes
      
      // Find the room type and load its rooms
      const roomType = property.roomTypes.find(rt => rt.roomTypeID === roomTypeID)
      if (roomType && roomType.listRoom) {
        // Include both the current room and available rooms
        availableRooms.value = roomType.listRoom.filter(room => 
          room.availabilityStatus === 1 || room.roomID === roomID
        )
      }
    }
  } catch (error: any) {
    console.error('Error loading property data:', error)
    toast.error('Failed to load property data')
  }
}

// When property changes, load room types
const onPropertyChange = async () => {
  // Reset dependent fields only if property actually changed
  const oldPropertyID = formData.value.propertyID
  
  formData.value.roomTypeID = ''
  formData.value.roomID = ''
  availableRoomTypes.value = []
  availableRooms.value = []

  if (!formData.value.propertyID) {
    selectedProperty.value = null
    return
  }

  try {
    loadingRoomTypes.value = true
    
    // Fetch property details to get room types
    const property = await propertyService.getPropertyById(formData.value.propertyID)
    selectedProperty.value = property
    
    if (property.roomTypes && property.roomTypes.length > 0) {
      availableRoomTypes.value = property.roomTypes
    } else {
      toast.warning('No room types available for this property')
    }
  } catch (error: any) {
    console.error('Error fetching room types:', error)
    toast.error('Failed to load room types')
  } finally {
    loadingRoomTypes.value = false
  }
}

// When room type changes, load rooms
const onRoomTypeChange = () => {
  // Reset dependent fields
  formData.value.roomID = ''
  availableRooms.value = []

  if (!formData.value.roomTypeID) {
    return
  }

  try {
    loadingRooms.value = true
    
    const roomType = availableRoomTypes.value.find(rt => rt.roomTypeID === formData.value.roomTypeID)
    
    if (roomType && roomType.listRoom && roomType.listRoom.length > 0) {
      // Include current booking's room even if not available + all available rooms
      const currentRoomID = originalBooking.value?.roomID || ''
      availableRooms.value = roomType.listRoom.filter(room => 
        room.availabilityStatus === 1 || room.roomID === currentRoomID
      )
      
      if (availableRooms.value.length === 0) {
        toast.warning('No available rooms for this room type')
      }
    } else {
      toast.warning('No rooms available for this room type')
    }
  } catch (error: any) {
    console.error('Error loading rooms:', error)
    toast.error('Failed to load rooms')
  } finally {
    loadingRooms.value = false
  }
}

// When room changes
const onRoomChange = () => {
  // Auto-set capacity if needed
  if (formData.value.capacity === 0 && maxCapacity.value) {
    formData.value.capacity = 1
  }
}

// Watch capacity to validate against max capacity
watch(() => formData.value.capacity, (newCapacity) => {
  if (maxCapacity.value && newCapacity > maxCapacity.value) {
    toast.error(`Capacity cannot exceed ${maxCapacity.value}`)
    formData.value.capacity = maxCapacity.value
  }
})

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

  if (maxCapacity.value && formData.value.capacity > maxCapacity.value) {
    toast.error(`Capacity cannot exceed ${maxCapacity.value} for this room type`)
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

    const requestData: UpdateBookingRequest = {
      bookingID: formData.value.bookingID,
      propertyID: formData.value.propertyID,
      roomTypeID: formData.value.roomTypeID,
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

    console.log('Submitting update booking:', requestData)

    const result = await bookingService.updateBooking(requestData)

    // Removed: extraPay notification as feature removed
    toast.success('Booking successfully updated!')

    // Redirect to booking detail page
    setTimeout(() => {
      router.push(`/bookings/${result.bookingID}`)
    }, 1500)

  } catch (error: any) {
    console.error('Error updating booking:', error)
    toast.error(error.message || 'Failed to update booking')
  } finally {
    submitting.value = false
  }
}

const handleBack = () => {
  router.back()
}

const handleCancel = () => {
  showCancelConfirm.value = true
}

const confirmCancel = async () => {
  showCancelConfirm.value = false
  
  try {
    cancelling.value = true

    const result = await bookingService.cancelBooking(formData.value.bookingID)

    toast.success('Booking cancelled successfully!')

    // Redirect to booking detail page
    setTimeout(() => {
      router.push(`/bookings/${result.bookingID}`)
    }, 1500)

  } catch (error: any) {
    console.error('Error cancelling booking:', error)
    toast.error(error.message || 'Failed to cancel booking')
  } finally {
    cancelling.value = false
  }
}

onMounted(() => {
  // Role validation: Only CUSTOMER can update booking
  if (authStore.currentUserInfo?.role !== 'CUSTOMER') {
    toast.error('Access denied: Only customers can update bookings')
    router.push('/bookings')
    return
  }
  
  fetchBookingDetails()
})
</script>
