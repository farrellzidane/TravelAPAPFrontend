<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading && !property" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p class="mt-4 text-gray-600 text-lg">Loading property data...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error && !property" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 class="text-xl font-semibold text-red-800 mb-2">Error Loading Property</h2>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <div class="flex gap-4 justify-center">
            <button
              @click="fetchPropertyDetail"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Retry
            </button>
            <button
              @click="goBack"
              class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <!-- Add Room Type Form -->
      <div v-else-if="property" class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-blue-600 mb-2">
            Add Rooms for Property #{{ property.propertyID }}
          </h1>
          <p class="text-gray-600">
            Property: <span class="font-semibold">{{ property.propertyName }}</span>
          </p>
          <p class="text-sm text-gray-500 mt-1">
            Add new room types to this property
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Room Types Dynamic Form -->
          <div class="space-y-6">
            <div
              v-for="(roomType, index) in formData.roomTypes"
              :key="roomType.id"
              class="bg-blue-50 p-6 rounded-lg border-2 border-blue-100 relative"
            >
              <!-- Remove Button -->
              <button
                v-if="formData.roomTypes.length > 1"
                type="button"
                @click="removeRoomType(index)"
                class="absolute top-4 right-4 text-red-600 hover:text-red-800 font-semibold text-sm"
              >
                Remove
              </button>

              <h3 class="text-lg font-semibold text-blue-700 mb-4">
                Room Type {{ index + 1 }}
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Room Type Name -->
                <div>
                  <label class="block text-sm font-medium text-blue-700 mb-2">
                    Name <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="roomType.roomTypeName"
                    required
                    class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" disabled>Select Room Type</option>
                    <option
                      v-for="type in availableRoomTypes"
                      :key="type"
                      :value="type"
                    >
                      {{ type }}
                    </option>
                  </select>
                </div>

                <!-- Facility -->
                <div>
                  <label class="block text-sm font-medium text-blue-700 mb-2">
                    Facility <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="roomType.facility"
                    type="text"
                    required
                    placeholder="e.g., AC, TV, WiFi"
                    class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <!-- Capacity -->
                <div>
                  <label class="block text-sm font-medium text-blue-700 mb-2">
                    Capacity <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="roomType.capacity"
                    type="number"
                    required
                    min="1"
                    placeholder="0"
                    class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <!-- Price -->
                <div>
                  <label class="block text-sm font-medium text-blue-700 mb-2">
                    Price <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="roomType.price"
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <!-- Floor -->
                <div>
                  <label class="block text-sm font-medium text-blue-700 mb-2">
                    Floor <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="roomType.floor"
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <!-- Unit Count -->
                <div>
                  <label class="block text-sm font-medium text-blue-700 mb-2">
                    Unit <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="roomType.unitCount"
                    type="number"
                    required
                    min="1"
                    placeholder="0"
                    class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <!-- Description -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-blue-700 mb-2">
                    Description <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="roomType.description"
                    required
                    rows="3"
                    placeholder="Enter room type description"
                    class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleBack"
              :disabled="propertyStore.loading"
              class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="button"
              @click="addRoomType"
              :disabled="propertyStore.loading"
              class="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Type
            </button>
            <button
              type="submit"
              :disabled="propertyStore.loading || formData.roomTypes.length === 0"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="propertyStore.loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>{{ propertyStore.loading ? 'Saving...' : 'Save' }}</span>
            </button>
          </div>
        </form>

        <!-- Validation Info -->
        <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex gap-2">
            <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm text-yellow-800">
              <p class="font-semibold mb-1">Important Notes:</p>
              <ul class="list-disc list-inside space-y-1">
                <li>All fields are required for each room type</li>
                <li>At least one room type must be added</li>
                <li>Each room type must have at least 1 unit</li>
                <li>Combination of property-room type-floor must be unique</li>
                <li>System will check for duplicates with existing room types</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import type { Property, AddRoomTypeForm, AddRoomTypeRequest } from '@/interfaces/property.interface'
import { ROOM_TYPE_OPTIONS } from '@/interfaces/property.interface'
import { propertyService } from '@/services/property.service'
import { usePropertyStore } from '@/stores/property/property.stores'

const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()

const property = ref<Property | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const formData = ref<{
  roomTypes: AddRoomTypeForm[]
}>({
  roomTypes: []
})

const availableRoomTypes = computed(() => {
  if (!property.value) return []
  return ROOM_TYPE_OPTIONS[property.value.typeName] || []
})

const fetchPropertyDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const propertyId = route.params.id as string
    property.value = await propertyService.getPropertyById(propertyId)

    // Initialize with one empty room type
    if (formData.value.roomTypes.length === 0) {
      addRoomType()
    }
  } catch (err: any) {
    console.error('Error fetching property detail:', err)
    error.value = err.message || 'Failed to load property details'
    toast.error('Failed to load property details')
  } finally {
    loading.value = false
  }
}

const addRoomType = () => {
  const newRoomType: AddRoomTypeForm = {
    id: `room-type-${Date.now()}-${Math.random()}`,
    roomTypeName: '',
    facility: '',
    capacity: null,
    price: null,
    floor: null,
    unitCount: null,
    description: ''
  }
  formData.value.roomTypes.push(newRoomType)
}

const removeRoomType = (index: number) => {
  if (formData.value.roomTypes.length > 1) {
    formData.value.roomTypes.splice(index, 1)
    toast.success('Room type removed')
  }
}

const validateForm = (): boolean => {
  // Check if at least one room type exists
  if (formData.value.roomTypes.length === 0) {
    toast.error('Please add at least one room type')
    return false
  }

  // Validate each room type
  for (let i = 0; i < formData.value.roomTypes.length; i++) {
    const rt = formData.value.roomTypes[i]

    if (!rt) {
      toast.error(`Room Type ${i + 1}: Room type data is missing`)
      return false
    }

    if (!rt.roomTypeName) {
      toast.error(`Room Type ${i + 1}: Please select room type name`)
      return false
    }

    if (!rt.facility.trim()) {
      toast.error(`Room Type ${i + 1}: Please enter facility`)
      return false
    }

    if (!rt.capacity || rt.capacity <= 0) {
      toast.error(`Room Type ${i + 1}: Please enter valid capacity`)
      return false
    }

    if (rt.price === null || rt.price < 0) {
      toast.error(`Room Type ${i + 1}: Please enter valid price`)
      return false
    }

    if (rt.floor === null || rt.floor < 0) {
      toast.error(`Room Type ${i + 1}: Please enter valid floor number`)
      return false
    }

    if (!rt.unitCount || rt.unitCount <= 0) {
      toast.error(`Room Type ${i + 1}: Please enter valid unit count (minimum 1)`)
      return false
    }

    if (!rt.description.trim()) {
      toast.error(`Room Type ${i + 1}: Please enter description`)
      return false
    }
  }

  // Check for duplicate combinations in form
  const combinations = new Set<string>()
  for (let i = 0; i < formData.value.roomTypes.length; i++) {
    const rt = formData.value.roomTypes[i]
    if (!rt) {
      toast.error(`Room Type ${i + 1}: Room type data is missing`)
      return false
    }
    const key = `${rt.roomTypeName}-${rt.floor}`
    
    if (combinations.has(key)) {
      toast.error(`Duplicate combination found: ${rt.roomTypeName} on floor ${rt.floor}`)
      return false
    }
    combinations.add(key)
  }

  // Check for duplicate with existing room types
  if (property.value?.roomTypes) {
    for (let i = 0; i < formData.value.roomTypes.length; i++) {
      const rt = formData.value.roomTypes[i]
      const existingDuplicate = property.value.roomTypes.find(
        existing => rt && existing.roomTypeName === rt.roomTypeName && existing.floor === rt.floor
      )
      
      if (existingDuplicate) {
        toast.error(
          `Room type "${rt?.roomTypeName ?? ''}" on floor ${rt?.floor ?? ''} already exists in this property`
        )
        return false
      }
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!property.value) return

  if (!validateForm()) {
    return
  }

  const confirmed = confirm(
    `Are you sure you want to add ${formData.value.roomTypes.length} room type(s) to "${property.value.propertyName}"?\n\nThis will create new rooms based on the unit count specified for each room type.`
  )

  if (!confirmed) return

  try {
    const requestData: AddRoomTypeRequest = {
      propertyID: property.value.propertyID,
      roomTypes: formData.value.roomTypes.map(rt => ({
        roomTypeName: rt.roomTypeName,
        facility: rt.facility,
        capacity: rt.capacity!,
        price: rt.price!,
        floor: rt.floor!,
        unitCount: rt.unitCount!,
        description: rt.description
      }))
    }

    console.log('Submitting add room types data:', JSON.stringify(requestData, null, 2))

    await propertyStore.addRoomTypes(property.value.propertyID, requestData)

    // Redirect after short delay
    setTimeout(() => {
      router.push(`/property/${property.value!.propertyID}`)
    }, 1500)
  } catch (error: any) {
    console.error('Error adding room types:', error)
    // Error toast already shown by store
  }
}

const handleBack = () => {
  if (formData.value.roomTypes.some(rt => 
    rt.roomTypeName || rt.facility || rt.capacity || rt.price || rt.floor || rt.unitCount || rt.description
  )) {
    if (confirm('Are you sure you want to go back? All unsaved changes will be lost.')) {
      goBack()
    }
  } else {
    goBack()
  }
}

const goBack = () => {
  router.push(`/property/${property.value?.propertyID || ''}`)
}

onMounted(() => {
  fetchPropertyDetail()
})
</script>