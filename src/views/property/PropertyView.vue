<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Header Section -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Property Management</h1>
          <p class="text-gray-600">Manage and view all registered properties</p>
        </div>

        <!-- Filter and Action Section -->
        <div class="mb-6 space-y-4">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Add Property Button - Hidden for Customer -->
            <button
              v-if="!isCustomer"
              @click="goToAddProperty"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Property
            </button>

            <!-- Filters -->
            <div class="flex-1 flex flex-col sm:flex-row gap-4">
              <!-- Name Search -->
              <input
                v-model="propertyStore.filters.name"
                @input="applyFilters"
                type="text"
                placeholder="Search by name..."
                class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <!-- Type Filter -->
              <select
                v-model="propertyStore.filters.type"
                @change="applyFilters"
                class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option :value="1">Hotel</option>
                <option :value="2">Villa</option>
                <option :value="3">Apartemen</option>
              </select>

              <!-- Province Filter -->
              <select
                v-model="propertyStore.filters.province"
                @change="applyFilters"
                class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Provinces</option>
                <option :value="11">Aceh</option>
                <option :value="12">Sumatera Utara</option>
                <option :value="13">Sumatera Barat</option>
                <option :value="14">Riau</option>
                <option :value="15">Jambi</option>
                <option :value="16">Sumatera Selatan</option>
                <option :value="17">Bengkulu</option>
                <option :value="18">Lampung</option>
                <option :value="19">Kepulauan Bangka Belitung</option>
                <option :value="21">Kepulauan Riau</option>
                <option :value="31">DKI Jakarta</option>
                <option :value="32">Jawa Barat</option>
                <option :value="33">Jawa Tengah</option>
                <option :value="34">DI Yogyakarta</option>
                <option :value="35">Jawa Timur</option>
                <option :value="36">Banten</option>
                <option :value="51">Bali</option>
                <option :value="52">Nusa Tenggara Barat</option>
                <option :value="53">Nusa Tenggara Timur</option>
                <option :value="61">Kalimantan Barat</option>
                <option :value="62">Kalimantan Tengah</option>
                <option :value="63">Kalimantan Selatan</option>
                <option :value="64">Kalimantan Timur</option>
                <option :value="65">Kalimantan Utara</option>
                <option :value="71">Sulawesi Utara</option>
                <option :value="72">Sulawesi Tengah</option>
                <option :value="73">Sulawesi Selatan</option>
                <option :value="74">Sulawesi Tenggara</option>
                <option :value="75">Gorontalo</option>
                <option :value="76">Sulawesi Barat</option>
                <option :value="81">Maluku</option>
                <option :value="82">Maluku Utara</option>
                <option :value="91">Papua Barat</option>
                <option :value="94">Papua</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="propertyStore.loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading properties...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="propertyStore.error" class="text-center py-12">
          <div class="text-red-500 text-xl mb-4">⚠️</div>
          <p class="text-red-600 mb-2">{{ propertyStore.error }}</p>
          <button
            @click="propertyStore.fetchAllProperties()"
            class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!propertyStore.properties || propertyStore.properties.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">🏢</div>
          <p class="text-gray-600 text-lg">No properties found</p>
          <p class="text-gray-500 text-sm mt-2">
            {{ hasActiveFilters ? 'Try adjusting your filters' : 'Start by adding a new property' }}
          </p>
        </div>

        <!-- Properties Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-blue-50 border-b border-blue-100">
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Province
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Rooms
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="property in propertyStore.properties"
                :key="property.propertyID"
                class="hover:bg-gray-50 transition duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ property.propertyName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ property.typeName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ getProvinceName(property.province) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                  {{ property.totalRoom }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="goToDetail(property.propertyID ? property.propertyID : '')"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Results Count -->
        <div v-if="!propertyStore.loading && !propertyStore.error && propertyStore.properties.length > 0" 
             class="mt-6 text-sm text-gray-600 text-center">
          Showing {{ propertyStore.properties.length }} active {{ propertyStore.properties.length === 1 ? 'property' : 'properties' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/property/property.stores'
import { getCurrentRole } from '@/config/axios.config'

const router = useRouter()
const propertyStore = usePropertyStore()

const currentRole = computed(() => getCurrentRole())
const isCustomer = computed(() => currentRole.value === 'CUSTOMER')

const provinceMap: Record<number, string> = {
  11: 'Aceh', 12: 'Sumatera Utara', 13: 'Sumatera Barat', 14: 'Riau',
  15: 'Jambi', 16: 'Sumatera Selatan', 17: 'Bengkulu', 18: 'Lampung',
  19: 'Kepulauan Bangka Belitung', 21: 'Kepulauan Riau',
  31: 'DKI Jakarta', 32: 'Jawa Barat', 33: 'Jawa Tengah', 34: 'DI Yogyakarta',
  35: 'Jawa Timur', 36: 'Banten',
  51: 'Bali', 52: 'Nusa Tenggara Barat', 53: 'Nusa Tenggara Timur',
  61: 'Kalimantan Barat', 62: 'Kalimantan Tengah', 63: 'Kalimantan Selatan',
  64: 'Kalimantan Timur', 65: 'Kalimantan Utara',
  71: 'Sulawesi Utara', 72: 'Sulawesi Tengah', 73: 'Sulawesi Selatan',
  74: 'Sulawesi Tenggara', 75: 'Gorontalo', 76: 'Sulawesi Barat',
  81: 'Maluku', 82: 'Maluku Utara',
  91: 'Papua Barat', 94: 'Papua'
}

const getProvinceName = (code: number): string => {
  return provinceMap[code] || 'Unknown'
}

const hasActiveFilters = computed(() => {
  return !!(
    propertyStore.filters.name ||
    propertyStore.filters.type ||
    propertyStore.filters.province
  )
})

let filterTimeout: ReturnType<typeof setTimeout> | null = null

const applyFilters = () => {
  if (filterTimeout) clearTimeout(filterTimeout)
  
  filterTimeout = setTimeout(() => {
    propertyStore.fetchFilteredProperties()
  }, 300)
}

const goToAddProperty = () => {
  router.push('/property/create')
}

const goToDetail = (propertyID: string) => {
  router.push(`/property/${propertyID}`)
}

onMounted(async () => {
  await propertyStore.fetchAllProperties()
})
</script>