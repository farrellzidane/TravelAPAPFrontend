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

            <!-- Owner ID - Manual Input for Superadmin, Auto-filled for Owner -->
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-2">
                Owner ID <span class="text-red-500">*</span>
              </label>
              <!-- Superadmin: Manual Input -->
              <input
                v-if="isSuperAdminRole"
                v-model="formData.ownerID"
                type="text"
                required
                placeholder="Enter accommodation owner UUID"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <!-- Accommodation Owner: Readonly Input -->
              <input
                v-else
                v-model="formData.ownerID"
                type="text"
                readonly
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p v-if="isSuperAdmin" class="mt-1 text-xs text-gray-500">
                Enter the UUID of the accommodation owner (e.g., xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
              </p>
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
                :readonly="isOwnerRole"
                :class="[
                  'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  isOwnerRole ? 'bg-gray-100 cursor-not-allowed' : ''
                ]"
              />
              <p v-if="isSuperAdminRole" class="mt-1 text-xs text-gray-500">
                Enter the full name of the accommodation owner
              </p>
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
              <span>{{ propertyStore.loading ? 'Saving...' : 'Save' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import type { Province, CreatePropertyRequest } from '@/interfaces/property.interface'
import type { RoomTypeForm } from '@/interfaces/room.interface'
import { PropertyTypeByName } from '@/interfaces/property.interface'
import { propertyService } from '@/services/property.service'
import { usePropertyStore } from '@/stores/property/property.stores'
import VDynamicForm from '@/components/property/VDynamicForm.vue'
import { getCurrentRole, getCurrentUserId, getCurrentUserName, isSuperAdmin, isAccommodationOwner } from '@/config/axios.config'

const router = useRouter()
const propertyStore = usePropertyStore()

const loadingProvinces = ref(false)
const provinces = ref<Province[]>([])

// Role checking using helper functions
const currentRole = computed(() => getCurrentRole())
const isSuperAdminRole = computed(() => isSuperAdmin(currentRole.value))
const isOwnerRole = computed(() => isAccommodationOwner(currentRole.value))
const canCreateProperty = computed(() => isSuperAdminRole.value || isOwnerRole.value)

// Get current user info from token
const currentUserId = computed(() => getCurrentUserId())
const currentUserName = computed(() => getCurrentUserName())

// Owner options for Superadmin (empty for now, will be populated from API in the future)
const ownerOptions = ref<Array<{ id: string; name: string }>>([])

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
  // Reset room types when property type changes
  formData.value.roomTypes = [{
    id: `room-${Date.now()}`,
    roomTypeName: '',
    facility: '',
    capacity: null,
    price: null,
    floor: null,
    unitCount: null,
    roomTypeDescription: ''
  }]
}

const validateForm = (): boolean => {
  // Validate room types exist
  if (formData.value.roomTypes.length === 0) {
    toast.error('Please add at least one room type')
    return false
  }

  // Validate all room types are completely filled
  for (let i = 0; i < formData.value.roomTypes.length; i++) {
    const rt = formData.value.roomTypes[i]
    if (!rt) {
      toast.error(`Room Type ${i + 1}: Room type data is missing`)
      return false
    }
    
    if (!rt.roomTypeName) {
      toast.error(`Room Type ${i + 1}: Please select a room type name`)
      return false
    }
    
    if (!rt.facility || rt.facility.trim() === '') {
      toast.error(`Room Type ${i + 1}: Please enter facility`)
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
    
    if (!rt.unitCount || rt.unitCount <= 0) {
      toast.error(`Room Type ${i + 1}: Please enter valid unit count`)
      return false
    }
    
    if (!rt.roomTypeDescription || rt.roomTypeDescription.trim() === '') {
      toast.error(`Room Type ${i + 1}: Please enter description`)
      return false
    }
  }

  // Check for duplicate roomType-floor combination
  const combinations = new Set<string>()
  for (let i = 0; i < formData.value.roomTypes.length; i++) {
    const rt = formData.value.roomTypes[i]
    if (!rt) {
      continue
    }
    const combo = `${rt.roomTypeName}-${rt.floor}`
    
    if (combinations.has(combo)) {
      toast.error(`Duplicate combination found: ${rt.roomTypeName} on floor ${rt.floor}. Each room type must be on a different floor.`)
      return false
    }
    combinations.add(combo)
  }

  // Validate UUID format
  const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  if (!uuidPattern.test(formData.value.ownerID)) {
    toast.error('Please enter a valid UUID for Owner ID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)')
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    // Calculate total rooms
    const totalRoom = formData.value.roomTypes.reduce((sum, rt) => sum + (rt.unitCount || 0), 0)

    // Build request body sesuai dengan BE
    const requestData: CreatePropertyRequest = {
      propertyName: formData.value.propertyName,
      type: PropertyTypeByName[formData.value.propertyType] ?? (() => { throw new Error('Invalid property type'); })(), // Convert string to number, ensure not undefined
      address: formData.value.address,
      province: parseInt(formData.value.province), // Convert string to number
      description: formData.value.description,
      totalRoom: totalRoom,
      ownerName: formData.value.ownerName,
      ownerID: formData.value.ownerID,
      roomTypes: formData.value.roomTypes.map(rt => ({
        roomTypeName: rt.roomTypeName,
        roomTypeDescription: rt.roomTypeDescription,
        capacity: rt.capacity!,
        price: rt.price!,
        facility: rt.facility,
        unitCount: rt.unitCount!,
        floor: rt.floor!
      }))
    }

    console.log('Submitting property data:', JSON.stringify(requestData, null, 2))

    await propertyStore.createProperty(requestData)
    
    // Redirect after short delay to allow user to see success message
    setTimeout(() => {
      router.push('/property')
    }, 1500)
  } catch (error: any) {
    console.error('Error creating property:', error)
    // Error toast already shown by store
  }
}

const handleBack = () => {
  const hasData = 
    formData.value.propertyName ||
    formData.value.propertyType ||
    formData.value.province ||
    formData.value.address ||
    formData.value.description ||
    formData.value.ownerID ||
    formData.value.ownerName ||
    formData.value.roomTypes.length > 0

  if (hasData) {
    if (confirm('Are you sure you want to go back? All unsaved changes will be lost.')) {
      router.push('/property')
    }
  } else {
    router.push('/property')
  }
}

onMounted(() => {
  // RBAC: Only Superadmin and Accommodation Owner can create property
  if (!canCreateProperty.value) {
    toast.error('You do not have permission to create properties')
    router.push('/property')
    return
  }
  
  fetchProvinces()
  
  // Auto-fill owner data if user is Accommodation Owner
  if (isOwnerRole.value) {
    formData.value.ownerID = currentUserId.value
    formData.value.ownerName = currentUserName.value
  }
  
  // For Superadmin: Manual entry of owner ID and name
  // Note: In the future, this can be replaced with a dropdown that fetches
  // accommodation owners from the SSO service
})
</script>