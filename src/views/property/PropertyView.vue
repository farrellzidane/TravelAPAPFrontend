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
            <!-- Add Property Button -->
            <button
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
              <!-- Type Filter -->
              <select
                v-model="propertyStore.filters.type"
                class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Hotel">Hotel</option>
                <option value="Villa">Villa</option>
                <option value="Apartemen">Apartemen</option>
              </select>

              <!-- Status Filter -->
              <select
                v-model="propertyStore.filters.status"
                class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Non Active">Non Active</option>
              </select>

              <!-- Search Input -->
              <input
                v-model="propertyStore.filters.search"
                type="text"
                placeholder="Search properties..."
                class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
        <div v-else-if="propertyStore.filteredProperties.length === 0" class="text-center py-12">
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
                  ID
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
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
                v-for="property in propertyStore.filteredProperties"
                :key="property.propertyID"
                class="hover:bg-gray-50 transition duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ property.propertyID }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ property.propertyName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ property.typeName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      property.activeStatusName === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ property.activeStatusName }}
                  </span>
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
        <div v-if="!propertyStore.loading && !propertyStore.error && propertyStore.filteredProperties.length > 0" 
             class="mt-6 text-sm text-gray-600 text-center">
          Showing {{ propertyStore.filteredProperties.length }} of {{ propertyStore.totalProperties }} properties
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/property/property.stores'

const router = useRouter()
const propertyStore = usePropertyStore()

const hasActiveFilters = computed(() => {
  return !!(
    propertyStore.filters.search ||
    propertyStore.filters.type ||
    propertyStore.filters.status
  )
})

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