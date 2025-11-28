<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Add New booking</h1>
        <p class="text-gray-600">Select property and room, then fill in booking details</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Row 1: Property Name and Room Type -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Property Name -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Property Name <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.propertyID"
                @change="onPropertyChange"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Room Type <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.roomTypeID"
                @change="onRoomTypeChange"
                required
                :disabled="!formData.propertyID || loadingRoomTypes"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Room Name <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.roomID"
                @change="onRoomChange"
                required
                :disabled="!formData.roomTypeID || loadingRooms"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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

          <!-- Row 5: Customer Email and Customer Phone -->
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
              :disabled="submitting"
              class="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="submit"
              :disabled="submitting || !isFormValid"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { bookingService } from '@/services/booking.service'
import { propertyService } from '@/services/property.service'
import { getCurrentUserId, getCurrentRole } from '@/config/axios.config'
import type { CreateBookingWithoutRoomRequest } from '@/interfaces/booking.interface'
import type { Property } from '@/interfaces/property.interface'
import type { RoomType, Room } from '@/interfaces/room.interface'

const router = useRouter()

const submitting = ref(false)
const loadingProperties = ref(false)
const loadingRoomTypes = ref(false)
const loadingRooms = ref(false)

const allProperties = ref<Property[]>([])
const selectedProperty = ref<Property | null>(null)
const availableRoomTypes = ref<RoomType[]>([])
const availableRooms = ref<Room[]>([])

interface BookingFormData {
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

// Fetch all properties on mount
const fetchProperties = async () => {
  try {
    loadingProperties.value = true
    allProperties.value = await propertyService.getAllProperties()
  } catch (error: any) {
    console.error('Error fetching properties:', error)
    toast.error('Failed to load properties')
  } finally {
    loadingProperties.value = false
  }
}

// When property changes, load room types
const onPropertyChange = async () => {
  // Reset dependent fields
  formData.value.roomTypeID = ''
  formData.value.roomID = ''
  formData.value.capacity = 0
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
  formData.value.capacity = 0
  availableRooms.value = []

  if (!formData.value.roomTypeID) {
    return
  }

  try {
    loadingRooms.value = true
    
    const roomType = availableRoomTypes.value.find(rt => rt.roomTypeID === formData.value.roomTypeID)
    
    if (roomType && roomType.listRoom && roomType.listRoom.length > 0) {
      // Filter rooms: available status AND no maintenance conflict with booking dates
      availableRooms.value = roomType.listRoom.filter(room => {
        // First check availability status
        if (room.availabilityStatus !== 1) return false
        
        // Then check for maintenance overlap with booking dates
        if (formData.value.checkInDate && formData.value.checkOutDate) {
          return !isRoomMaintenanceDuringBooking(
            room, 
            formData.value.checkInDate, 
            formData.value.checkOutDate
          )
        }
        
        // If no dates selected yet, show all available rooms
        return true
      })
      
      if (availableRooms.value.length === 0) {
        toast.warning('No available rooms for this room type during selected dates')
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

// Helper function to check if room has maintenance during booking dates
const isRoomMaintenanceDuringBooking = (room: Room, checkInDate: string, checkOutDate: string): boolean => {
  // If no maintenance scheduled, room is available
  if (!room.maintenanceStart || !room.maintenanceEnd) {
    return false
  }
  
  const bookingStart = new Date(checkInDate + 'T14:00:00')
  const bookingEnd = new Date(checkOutDate + 'T12:00:00')
  const maintenanceStart = new Date(room.maintenanceStart)
  const maintenanceEnd = new Date(room.maintenanceEnd)
  
  // Check if booking period overlaps with maintenance period
  // Overlap occurs if: bookingStart < maintenanceEnd AND bookingEnd > maintenanceStart
  return bookingStart < maintenanceEnd && bookingEnd > maintenanceStart
}

// When room changes, update capacity if needed
const onRoomChange = () => {
  if (!formData.value.roomID) {
    return
  }
  
  // Auto-set capacity to 1 if it's 0
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

// Watch for check-in/check-out date changes to re-filter rooms
watch(() => [formData.value.checkInDate, formData.value.checkOutDate], () => {
  // If both dates are selected and a room type is selected, refresh room list
  if (formData.value.checkInDate && formData.value.checkOutDate && formData.value.roomTypeID) {
    onRoomTypeChange()
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

    const requestData: CreateBookingWithoutRoomRequest = {
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

    console.log('Submitting booking:', requestData)

    const result = await bookingService.createBooking(requestData)

    toast.success(`Booking successfully created with ID: ${result.bookingID}`)

    // Redirect to booking detail page
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
  // Check if user is customer
  const currentRole = getCurrentRole()
  const isCustomer = currentRole === 'CUSTOMER' || currentRole === 'Customer'
  if (!isCustomer) {
    toast.error('Only customers can create bookings')
    router.push('/bookings')
    return
  }
  
  // Auto-fill customer ID from current user
  formData.value.customerID = getCurrentUserId()
  
  fetchProperties()
})
</script>
