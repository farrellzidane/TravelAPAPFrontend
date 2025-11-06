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

      <!-- Update Form -->
      <div v-else-if="property" class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-blue-600 mb-2">
            Update Property – {{ property.propertyName }}
          </h1>
          <p class="text-gray-600">Update property information and room types</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Property ID (Disabled) -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Property ID
              </label>
              <input
                v-model="formData.propertyID"
                type="text"
                disabled
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <!-- Property Name -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Property Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.propertyName"
                type="text"
                required
                placeholder="Enter property name"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Address -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Address <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.address"
                required
                rows="3"
                placeholder="Enter property address"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.description"
                required
                rows="4"
                placeholder="Enter property description"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Room Types -->
          <div class="mt-8">
            <h2 class="text-xl font-bold text-blue-700 mb-4">Room Types</h2>
            
            <div v-if="formData.roomTypes.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
              No room types available to update.
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="(roomType, index) in formData.roomTypes"
                :key="roomType.roomTypeID"
                class="bg-blue-50 p-6 rounded-lg border-2 border-blue-100"
              >
                <h4 class="text-md font-semibold text-blue-700 mb-4">
                  Room Type {{ index + 1 }} - {{ roomType.roomTypeName }}
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Room Type ID (Disabled) -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-blue-700 mb-2">
                      Room Type ID
                    </label>
                    <input
                      v-model="roomType.roomTypeID"
                      type="text"
                      disabled
                      class="w-full px-4 py-2.5 border border-blue-300 rounded-lg bg-blue-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <!-- Facility (Disabled - Show Only) -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-blue-700 mb-2">
                      Facility
                    </label>
                    <input
                      v-model="roomType.facility"
                      type="text"
                      disabled
                      class="w-full px-4 py-2.5 border border-blue-300 rounded-lg bg-blue-100 text-gray-600 cursor-not-allowed"
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
              type="submit"
              :disabled="propertyStore.loading"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="propertyStore.loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>{{ propertyStore.loading ? 'Updating...' : 'Update' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import type { Property, UpdateRoomTypeForm, UpdatePropertyRequest } from '@/interfaces/property.interface'
import { propertyService } from '@/services/property.service'
import { usePropertyStore } from '@/stores/property/property.stores'

const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()

const property = ref<Property | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const formData = ref<{
  propertyID: string
  propertyName: string
  address: string
  description: string
  roomTypes: UpdateRoomTypeForm[]
}>({
  propertyID: '',
  propertyName: '',
  address: '',
  description: '',
  roomTypes: []
})

const fetchPropertyDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const propertyId = route.params.id as string
    property.value = await propertyService.getPropertyById(propertyId)

    // Populate form data
    formData.value = {
      propertyID: property.value.propertyID,
      propertyName: property.value.propertyName,
      address: property.value.address,
      description: property.value.description,
      roomTypes: property.value.roomTypes?.map(rt => ({
        roomTypeID: rt.roomTypeID,
        roomTypeName: rt.roomTypeName,
        facility: rt.facility,
        capacity: rt.capacity,
        price: rt.price,
        floor: rt.floor,
        description: rt.description
      })) || []
    }
  } catch (err: any) {
    console.error('Error fetching property detail:', err)
    error.value = err.message || 'Failed to load property details'
    toast.error('Failed to load property details')
  } finally {
    loading.value = false
  }
}

const validateForm = (): boolean => {
  // Validate property fields
  if (!formData.value.propertyName.trim()) {
    toast.error('Property name is required')
    return false
  }

  if (!formData.value.address.trim()) {
    toast.error('Address is required')
    return false
  }

  if (!formData.value.description.trim()) {
    toast.error('Description is required')
    return false
  }

  // Validate room types
  for (let i = 0; i < formData.value.roomTypes.length; i++) {
    const rt = formData.value.roomTypes[i]

    if (!rt) {
      toast.error(`Room Type ${i + 1}: Room type data is missing`)
      return false
    }

    if (!rt.capacity || rt.capacity <= 0) {
      toast.error(`Room Type ${i + 1}: Please enter valid capacity`)
      return false
    }

    if (!rt.price || rt.price <= 0) {
      toast.error(`Room Type ${i + 1}: Please enter valid price`)
      return false
    }

    if (rt.floor === null || rt.floor < 0) {
      toast.error(`Room Type ${i + 1}: Please enter valid floor number`)
      return false
    }

    if (!rt.description || !rt.description.trim()) {
      toast.error(`Room Type ${i + 1}: Description is required`)
      return false
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  const confirmed = confirm(
    `Are you sure you want to update property "${formData.value.propertyName}"?\n\nNote: Changes will not affect existing bookings unless they are updated separately.`
  )

  if (!confirmed) return

  try {
    const requestData: UpdatePropertyRequest = {
      propertyID: formData.value.propertyID,
      propertyName: formData.value.propertyName,
      address: formData.value.address,
      description: formData.value.description,
      roomTypes: formData.value.roomTypes.map(rt => ({
        roomTypeID: rt.roomTypeID,
        capacity: rt.capacity,
        price: rt.price,
        floor: rt.floor,
        description: rt.description
      }))
    }

    console.log('Submitting update property data:', JSON.stringify(requestData, null, 2))

    await propertyStore.updateProperty(formData.value.propertyID, requestData)

    // Redirect after short delay
    setTimeout(() => {
      router.push(`/property/${formData.value.propertyID}`)
    }, 1500)
  } catch (error: any) {
    console.error('Error updating property:', error)
    // Error toast already shown by store
  }
}

const handleBack = () => {
  if (!property.value) {
    router.push('/property')
    return
  }

  const hasChanges =
    formData.value.propertyName !== property.value.propertyName ||
    formData.value.address !== property.value.address ||
    formData.value.description !== property.value.description ||
    JSON.stringify(formData.value.roomTypes) !== JSON.stringify(
      property.value.roomTypes?.map(rt => ({
        roomTypeID: rt.roomTypeID,
        roomTypeName: rt.roomTypeName,
        facility: rt.facility,
        capacity: rt.capacity,
        price: rt.price,
        floor: rt.floor,
        description: rt.description
      }))
    )

  if (hasChanges) {
    if (confirm('Are you sure you want to go back? All unsaved changes will be lost.')) {
      router.push(`/property/${formData.value.propertyID}`)
    }
  } else {
    router.push(`/property/${formData.value.propertyID}`)
  }
}

const goBack = () => {
  router.push('/property')
}

onMounted(() => {
  fetchPropertyDetail()
})
</script>