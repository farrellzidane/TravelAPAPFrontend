<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Property Income Statistic</h1>
      </div>

      <!-- Filter Card -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
          <!-- Left: Filters -->
          <div class="flex flex-col md:flex-row gap-4 flex-1">
            <!-- Month Filter -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                v-model="filters.month"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <!-- Year Filter -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                v-model.number="filters.year"
                type="number"
                min="2020"
                max="2100"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Right: Show Button -->
          <button
            @click="loadStatistics"
            :disabled="loading"
            class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Loading...' : 'Show Statistic' }}</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !chartData" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p class="mt-4 text-gray-600 text-lg">Loading statistics...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div class="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 class="text-xl font-semibold text-red-800 mb-2">Error Loading Statistics</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadStatistics"
          class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Retry
        </button>
      </div>

      <!-- Chart Card -->
      <div v-else-if="chartData" class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Chart Header with Legend -->
        <div class="mb-6">
          <div class="flex items-center justify-center gap-3 mb-2">
            <div class="w-4 h-4 bg-blue-600 rounded"></div>
            <span class="text-sm font-medium text-gray-700">
              Most Property Income ({{ chartData.month }}/{{ chartData.year }})
            </span>
          </div>
        </div>

        <!-- Chart Container -->
        <div class="relative" style="height: 400px;">
          <Bar
            :data="chartDataset"
            :options="chartOptions"
          />
        </div>

        <!-- Summary Statistics -->
        <div v-if="chartData.propertyRevenues.length > 0" class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Total Properties -->
          <div class="bg-blue-50 rounded-lg p-4 text-center">
            <p class="text-sm text-gray-600 mb-1">Total Properties</p>
            <p class="text-3xl font-bold text-blue-600">{{ chartData.totalProperties }}</p>
          </div>

          <!-- Total Revenue -->
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <p class="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p class="text-3xl font-bold text-green-600">
              Rp {{ formatCurrency(chartData.totalRevenue) }}
            </p>
          </div>

          <!-- Top Property -->
          <div class="bg-orange-50 rounded-lg p-4 text-center">
            <p class="text-sm text-gray-600 mb-1">Top Property</p>
            <p class="text-xl font-bold text-orange-600">
              {{ chartData.propertyRevenues[0]?.propertyName || '-' }}
            </p>
            <p class="text-sm text-gray-500">
              Rp {{ formatCurrency(chartData.propertyRevenues[0]?.totalRevenue || 0) }}
            </p>
          </div>
        </div>

        <!-- No Data Message -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 text-5xl mb-4">📊</div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
          <p class="text-gray-500">No booking statistics for the selected period</p>
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
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import type { BookingChartData } from '@/interfaces/statistics.interface'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Get current month and year
const now = new Date()
const currentMonth = now.getMonth() + 1 // JavaScript months are 0-indexed
const currentYear = now.getFullYear()

const filters = ref({
  month: currentMonth,
  year: currentYear
})

const loading = ref(false)
const error = ref<string | null>(null)
const chartData = ref<BookingChartData | null>(null)

// Chart.js dataset
const chartDataset = computed(() => {
  if (!chartData.value || chartData.value.propertyRevenues.length === 0) {
    return {
      labels: [],
      datasets: []
    }
  }

  return {
    labels: chartData.value.propertyRevenues.map(p => p.propertyName),
    datasets: [
      {
        label: `Most Property Income (${chartData.value.month}/${chartData.value.year})`,
        data: chartData.value.propertyRevenues.map(p => p.totalRevenue),
        backgroundColor: '#2563eb',
        borderColor: '#1d4ed8',
        borderWidth: 1
      }
    ]
  }
})

// Chart.js options
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += 'Rp ' + formatCurrency(context.parsed.y)
          }
          return label
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value: any) {
          return 'Rp ' + formatCurrency(value)
        }
      }
    }
  }
}))

const loadStatistics = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('Fetching statistics for:', filters.value)

    const response = await axios.get<CommonResponseInterface<BookingChartData>>(
      `${API_BASE_URL}/api/bookings/chart`,
      {
        params: {
          month: filters.value.month,
          year: filters.value.year
        }
      }
    )

    console.log('Statistics response:', response.data)

    if (response.data.status === 200 && response.data.data) {
      chartData.value = response.data.data
      toast.success(response.data.message || 'Statistics loaded successfully!')
    } else {
      throw new Error(response.data.message || 'Failed to load statistics')
    }
  } catch (err: any) {
    console.error('Error loading statistics:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load statistics'
    toast.error(error.value || 'Failed to load statistics')
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('id-ID')
}

const goBack = () => {
  router.push('/bookings')
}

onMounted(() => {
  loadStatistics()
})
</script>
