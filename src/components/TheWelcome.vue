<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span class="text-blue-600">Accommodation App</span>
          </h1>
          <p class="text-gray-600 text-lg">
            Let's stay with us! Discover, book, and manage your perfect<br>
            stay effortlessly!
          </p>
        </div>

        <!-- Platform Statistics -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
            Platform Statistics
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Total Properties Card -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm mb-2">Total Properties</p>
                  <p class="text-4xl font-bold text-gray-800">{{ statistics.totalProperties }}</p>
                  <p class="text-gray-500 text-sm mt-2">All registered properties</p>
                </div>
                <div class="text-5xl">🏠</div>
              </div>
            </div>

            <!-- Total Bookings Card -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm mb-2">Total Bookings</p>
                  <p class="text-4xl font-bold text-gray-800">{{ statistics.totalBookings }}</p>
                  <p class="text-gray-500 text-sm mt-2">All recorded bookings</p>
                </div>
                <div class="text-5xl">📅</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            @click="goToProperties"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            See Properties
          </button>
          <button
            @click="goToBookings"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            See Bookings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

interface Statistics {
  totalProperties: number
  totalBookings: number
}

const statistics = ref<Statistics>({
  totalProperties: 0,
  totalBookings: 0
})

const fetchStatistics = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/statistics`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch statistics')
    }
    
    const data = await response.json()
    statistics.value = data
  } catch (error) {
    console.error('Error fetching statistics:', error)
    toast.error('Failed to load statistics')
  }
}

const goToProperties = () => {
  router.push('/property')
}

const goToBookings = () => {
  router.push('/bookings')
}

onMounted(() => {
  fetchStatistics()
})
</script>