<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p class="mt-4 text-gray-600 text-lg">Loading property details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 class="text-xl font-semibold text-red-800 mb-2">Error Loading Property</h2>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <div class="flex gap-4 justify-center">
            <button>
              @click="fetchPropertyDetail"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Retry
            </button>
            <button
              @click="goBack"
              class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>

      <!-- Property Detail -->
      <div v-else-if="property" class="max-w-7xl mx-auto">
        <!-- Header Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <!-- Title and Status -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">
                Property Details {{ property.propertyID }}
              </h1>
              <span
                :class="[
                  'px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full',
                  property.activeStatusName === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ property.activeStatusName }}
              </span>
            </div>

            <!-- Action Buttons (only show if active) -->
            <div v-if="property.activeStatus === 1" class="flex flex-wrap gap-2">
              <button
                @click="handleAddRoom"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
              >
                Add Room
              </button>
              <button
                @click="handleUpdateProperty"
                class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow transition"
              >
                Update Property
              </button>
              <button
                @click="showDeleteModal = true"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition"
              >
                Delete Property
              </button>
            </div>
          </div>

          <!-- Property Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Property Name</label>
              <p class="text-lg font-semibold text-gray-800">{{ property.propertyName }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Type</label>
              <p class="text-lg font-semibold text-gray-800">{{ property.typeName }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Total Rooms</label>
              <p class="text-lg font-semibold text-gray-800">{{ property.totalRoom }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Province</label>
              <p class="text-lg font-semibold text-gray-800">{{ getProvinceName(property.province) }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-600 mb-1">Address</label>
              <p class="text-lg font-semibold text-gray-800">{{ property.address }}</p>
            </div>

            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <p class="text-gray-700">{{ property.description }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Owner Name</label>
              <p class="text-lg font-semibold text-gray-800">{{ property.ownerName }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Owner ID</label>
              <p class="text-sm font-mono text-gray-600 break-all">{{ property.ownerID }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Income</label>
              <p class="text-lg font-semibold text-green-600">
                Rp {{ property.income.toLocaleString('id-ID') }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Created Date</label>
              <p class="text-gray-700">{{ formatDate(property.createdDate) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Updated Date</label>
              <p class="text-gray-700">{{ formatDate(property.updatedDate) }}</p>
            </div>
          </div>
        </div>

        <!-- Inactive Property Notice -->
        <div v-if="property.activeStatus === 0" class="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center mb-6">
          <div class="flex flex-col items-center">
            <div class="bg-red-100 rounded-full p-4 mb-4">
              <svg class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-red-800 mb-2">Property Inactive</h3>
            <p class="text-red-700 text-lg mb-4">
              This property has been deactivated and is no longer available for bookings.
            </p>
            <div class="bg-white border border-red-200 rounded-lg p-4 max-w-md">
              <p class="text-sm text-gray-700">
                <span class="font-semibold">Note:</span> Room types and rooms are not displayed for inactive properties.
                To view and manage rooms, the property must be reactivated.
              </p>
            </div>
          </div>
        </div>

        <!-- Date Filter Card (only show if active) -->
        <div v-if="property.activeStatus === 1" class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Filter by Date</h2>
          <div class="flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Check In</label>
              <input
                v-model="dateFilter.checkIn"
                type="date"
                :min="today"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Check Out</label>
              <input
                v-model="dateFilter.checkOut"
                type="date"
                :min="dateFilter.checkIn || today"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              @click="applyDateFilter"
              :disabled="!dateFilter.checkIn || !dateFilter.checkOut"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Apply Filter
            </button>
            <button
              v-if="dateFilter.checkIn || dateFilter.checkOut"
              @click="clearDateFilter"
              class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Room Types (only show if active) -->
        <div v-if="property.activeStatus === 1" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-800">Room Types</h2>

          <div v-if="!property.roomTypes || property.roomTypes.length === 0" class="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div class="text-gray-400 text-5xl mb-4">🏠</div>
            <p class="text-gray-600 text-lg">No room types available</p>
          </div>

          <div
            v-for="roomType in property.roomTypes"
            :key="roomType.roomTypeID"
            class="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <!-- Room Type Header -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-2xl font-bold">{{ roomType.roomTypeName }}</h3>
                <span class="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  Floor {{ roomType.floor }}
                </span>
              </div>
              <p class="text-blue-100 mb-4">{{ roomType.description }}</p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span class="font-semibold">Rp {{ roomType.price.toLocaleString('id-ID') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Capacity: {{ roomType.capacity }} people</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>{{ roomType.facility }}</span>
                </div>
              </div>
            </div>

            <!-- Room List Table -->
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-lg font-semibold text-gray-800">Rooms ({{ roomType.listRoom?.length || 0 }})</h4>
                <span class="text-sm text-gray-600">
                  {{ getAvailableRoomsCount(roomType.listRoom) }} Available
                </span>
              </div>
              
              <div v-if="!roomType.listRoom || roomType.listRoom.length === 0" class="text-center py-8 text-gray-500">
                <div class="text-4xl mb-2">🚫</div>
                <p>No rooms available</p>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gray-50 border-b border-gray-200">
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Room ID
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="room in roomType.listRoom"
                      :key="room.roomID"
                      class="hover:bg-gray-50 transition"
                    >
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ room.roomID }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          :class="[
                            'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                            getStatusClass(room.availabilityStatusName)
                          ]"
                        >
                          {{ room.availabilityStatusName }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-center">
                        <div class="flex gap-2 justify-center">
                          <button
                            @click="handleBook(room.roomID)"
                            :disabled="room.availabilityStatus !== 1"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Book
                          </button>
                          <button
                            @click="handleMaintenance(room.roomID)"
                            :disabled="room.availabilityStatus !== 1"
                            class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-lg shadow transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Maintenance
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-8">
          <button
            @click="goBack"
            class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Properties
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <!-- Modal Header -->
          <div class="bg-red-600 text-white p-6">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold">Delete Property?</h3>
                <p class="text-red-100 text-sm mt-1">This action cannot be undone</p>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6">
            <p class="text-gray-700 mb-4">
              Are you sure you want to delete property 
              <span class="font-semibold text-gray-900">"{{ property?.propertyName }}"</span>?
            </p>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div class="flex gap-2">
                <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-sm text-yellow-800">
                  <p class="font-semibold mb-1">Important Notes:</p>
                  <ul class="list-disc list-inside space-y-1">
                    <li>Property will be deactivated (soft delete)</li>
                    <li>All rooms will be marked as inactive</li>
                    <li>Property can only be deleted if there are no future bookings</li>
                    <li>Active status will change to "Non-Active"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
            <button
              @click="showDeleteModal = false"
              :disabled="deletingProperty"
              class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No, Cancel
            </button>
            <button
              @click="confirmDeleteProperty"
              :disabled="deletingProperty"
              class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:bg-red-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="deletingProperty" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>{{ deletingProperty ? 'Deleting...' : 'Yes, Delete' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { propertyService } from '@/services/property.service'
import { usePropertyStore } from '@/stores/property/property.stores'
import type { Property, DateFilter, Room } from '@/interfaces/property.interface'
import { PROVINCE_MAP } from '@/interfaces/property.interface'

const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()

const property = ref<Property | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const showDeleteModal = ref(false)
const deletingProperty = ref(false)

const dateFilter = ref<DateFilter>({
  checkIn: '',
  checkOut: ''
})

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const fetchPropertyDetail = async (withFilter: boolean = false) => {
  loading.value = true
  error.value = null

  try {
    const propertyId = route.params.id as string
    
    const filter = withFilter && dateFilter.value.checkIn && dateFilter.value.checkOut
      ? dateFilter.value
      : undefined

    property.value = await propertyService.getPropertyById(propertyId, filter)
    
    if (withFilter) {
      toast.success('Room availability updated based on selected dates')
    }
  } catch (err: any) {
    console.error('Error fetching property detail:', err)
    error.value = err.message || 'Failed to load property details'
    toast.error('Failed to load property details')
  } finally {
    loading.value = false
  }
}

const applyDateFilter = async () => {
  if (!dateFilter.value.checkIn || !dateFilter.value.checkOut) {
    toast.error('Please select both check-in and check-out dates')
    return
  }

  if (new Date(dateFilter.value.checkOut) <= new Date(dateFilter.value.checkIn)) {
    toast.error('Check-out date must be after check-in date')
    return
  }

  await fetchPropertyDetail(true)
}

const clearDateFilter = async () => {
  dateFilter.value = {
    checkIn: '',
    checkOut: ''
  }
  await fetchPropertyDetail(false)
  toast.success('Date filter cleared')
}

const getProvinceName = (code: number): string => {
  return PROVINCE_MAP[code] || `Province ${code}`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Available': 'bg-green-100 text-green-800',
    'Not Available': 'bg-red-100 text-red-800',
    'Maintenance': 'bg-yellow-100 text-yellow-800',
    'Booked': 'bg-blue-100 text-blue-800'
  }
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}

const getAvailableRoomsCount = (rooms: Room[] | null | undefined): number => {
  if (!rooms) return 0
  return rooms.filter(room => room.availabilityStatus === 1).length
}

const handleAddRoom = () => {
  toast.info('Add room feature - Coming soon')
  // router.push(`/property/${property.value?.propertyID}/add-room`)
}

const handleUpdateProperty = () => {
  router.push(`/property/${property.value?.propertyID}/edit`)
}

const confirmDeleteProperty = async () => {
  if (!property.value) return

  try {
    deletingProperty.value = true
    
    await propertyStore.deleteProperty(property.value.propertyID)
    
    showDeleteModal.value = false
    
    // Wait a bit to show success message
    setTimeout(() => {
      router.push('/property')
    }, 1500)
  } catch (error: any) {
    console.error('Error deleting property:', error)
    showDeleteModal.value = false
    // Error toast already shown by store
  } finally {
    deletingProperty.value = false
  }
}

const handleBook = (roomId: string) => {
  if (!dateFilter.value.checkIn || !dateFilter.value.checkOut) {
    toast.warning('Please select check-in and check-out dates first')
    return
  }
  
  toast.info('Book room feature - Coming soon')
  // router.push(`/booking/create?roomId=${roomId}&checkIn=${dateFilter.value.checkIn}&checkOut=${dateFilter.value.checkOut}`)
}

const handleMaintenance = (roomId: string) => {
  toast.info('Maintenance feature - Coming soon')
  // router.push(`/room/${roomId}/maintenance`)
}

const goBack = () => {
  router.push('/property')
}

onMounted(() => {
  fetchPropertyDetail()
})
</script>