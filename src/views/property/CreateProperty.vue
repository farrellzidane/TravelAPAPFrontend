<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-blue-600 mb-2">Add New Property</h1>
          <p class="text-gray-600">Fill in the details to add a new property</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Property Name -->
            <div class="md:col-span-2">
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

            <!-- Property Type -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Type <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.propertyType"
                required
                @change="handlePropertyTypeChange"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="Hotel">Hotel</option>
                <option value="Villa">Villa</option>
                <option value="Apartemen">Apartemen</option>
              </select>
            </div>

            <!-- Province -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Province <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.province"
                required
                :disabled="loadingProvinces"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">{{ loadingProvinces ? 'Loading provinces...' : 'Pilih provinsi' }}</option>
                <option v-for="province in provinces" :key="province.code" :value="province.code">
                  {{ province.name }}
                </option>
              </select>
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

            <!-- Owner ID -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Owner ID (UUID) <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.ownerID"
                type="text"
                required
                placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
                pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Owner Name -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Owner Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.ownerName"
                type="text"
                required
                placeholder="Enter owner name"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Room Types Dynamic Form -->
          <div v-if="formData.propertyType" class="mt-8">
            <VDynamicForm
              v-model="formData.roomTypes"
              :property-type="formData.propertyType"
            />
          </div>
          <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
            Please select a property type first to add room types.
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleBack"
              class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              :disabled="propertyStore.loading"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="propertyStore.loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>{{ propertyStore.loading ? 'Saving...' : 'Save' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import type { Province, RoomTypeForm, CreatePropertyRequest } from '@/interfaces/property.interface'
import { propertyService } from '@/services/property.service'
import { usePropertyStore } from '@/stores/property/property.stores'
import VDynamicForm from '@/components/property/VDynamicForm.vue'

const router = useRouter()
const propertyStore = usePropertyStore()

const loadingProvinces = ref(false)
const provinces = ref<Province[]>([])

const formData = ref<{
  propertyName: string
  propertyType: string
  province: string
  address: string
  description: string
  ownerID: string
  ownerName: string
  roomTypes: RoomTypeForm[]
}>({
  propertyName: '',
  propertyType: '',
  province: '',
  address: '',
  description: '',
  ownerID: '',
  ownerName: '',
  roomTypes: []
})

const fetchProvinces = async () => {
  loadingProvinces.value = true
  try {
    provinces.value = await propertyService.getProvinces()
  } catch (error) {
    console.error('Error fetching provinces:', error)
    toast.warning('Using fallback provinces list')
  } finally {
    loadingProvinces.value = false
  }
}

const handlePropertyTypeChange = () => {
  formData.value.roomTypes = [{
    id: `room-${Date.now()}`,
    name: '',
    facility: '',
    capacity: null,
    price: null,
    floor: null,
    unit: null,
    description: ''
  }]
}

const validateForm = (): boolean => {
  if (formData.value.roomTypes.length === 0) {
    toast.error('Please add at least one room type')
    return false
  }

  const invalidRoomType = formData.value.roomTypes.find(
    rt => !rt.name || !rt.facility || !rt.capacity || !rt.price || rt.floor === null || !rt.unit || !rt.description
  )

  if (invalidRoomType) {
    toast.error('Please fill in all room type fields')
    return false
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidPattern.test(formData.value.ownerID)) {
    toast.error('Please enter a valid UUID for Owner ID')
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    const requestData: CreatePropertyRequest = {
      propertyName: formData.value.propertyName,
      propertyType: formData.value.propertyType,
      province: formData.value.province,
      address: formData.value.address,
      description: formData.value.description,
      ownerID: formData.value.ownerID,
      ownerName: formData.value.ownerName,
      roomTypes: formData.value.roomTypes.map(rt => ({
        name: rt.name,
        facility: rt.facility,
        capacity: rt.capacity!,
        price: rt.price!,
        floor: rt.floor!,
        unit: rt.unit!,
        description: rt.description
      }))
    }

    await propertyStore.createProperty(requestData)
    
    setTimeout(() => {
      router.push('/property')
    }, 1000)
  } catch (error: any) {
    console.error('Error creating property:', error)
  }
}

const handleBack = () => {
  if (confirm('Are you sure you want to go back? All unsaved changes will be lost.')) {
    router.push('/property')
  }
}

onMounted(() => {
  fetchProvinces()
})
</script>