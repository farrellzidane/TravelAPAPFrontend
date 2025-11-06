<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Bookings</h1>
        <p class="text-gray-600">Manage all accommodation bookings</p>
      </div>

      <!-- Filters and Actions -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <!-- Left: Filters -->
          <div class="flex flex-col md:flex-row gap-4 flex-1">
            <!-- Status Filter -->
            <div class="w-full md:w-64">
              <select
                v-model="filter.status"
                @change="applyFilter"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="0">Waiting for Payment</option>
                <option value="1">Payment Confirmed</option>
                <option value="2">Done</option>
                <option value="3">Request Refund</option>
                <option value="4">Cancelled</option>
              </select>
            </div>

            <!-- Search -->
            <div class="flex-1">
              <input
                v-model="filter.search"
                @input="loadBookings"
                type="text"
                placeholder="Search bookings..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Right: Add Button -->
          <button
            @click="goToCreateBooking"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition flex items-center gap-2 whitespace-nowrap"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Booking
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p class="mt-4 text-gray-600 text-lg">Loading bookings...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div class="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 class="text-xl font-semibold text-red-800 mb-2">Error Loading Bookings</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadBookings"
          class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!bookings || bookings.length === 0" class="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div class="text-gray-400 text-6xl mb-4">📋</div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No Bookings Found</h2>
        <p class="text-gray-500 mb-6">
          {{ filter.status !== 'all' || filter.search ? 'Try adjusting your filters' : 'Start by creating your first booking' }}
        </p>
        <button
          @click="goToCreateBooking"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition"
        >
          Create First Booking
        </button>
      </div>

      <!-- Bookings Table -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Booking ID
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Property Name
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Room Name
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Check-In
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Check-Out
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Total Price
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="booking in bookings"
                :key="booking.bookingID"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ booking.bookingID }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.propertyName || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.roomNumber }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ formatDateTime(booking.checkInDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ formatDateTime(booking.checkOutDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">
                    Rp {{ booking.totalPrice.toLocaleString('id-ID') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      bookingStore.getStatusClass(booking.status.toString())
                    ]"
                  >
                    {{ getStatusName(booking.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="goToBookingDetail(booking.bookingID)"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              Showing <span class="font-semibold text-gray-900">{{ bookings.length }}</span> booking(s)
            </div>
            <div class="text-sm text-gray-500">
              Sorted by Booking ID
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/booking/booking.stores'
import type { BookingFilter } from '@/interfaces/booking.interface'

const router = useRouter()
const bookingStore = useBookingStore()

const bookings = ref(bookingStore.bookings)
const loading = ref(false)
const error = ref<string | null>(null)

const filter = ref<BookingFilter>({
  status: 'all',
  search: ''
})

const loadBookings = async () => {
  loading.value = true
  error.value = null

  try {
    const filterData: BookingFilter = {}
    
    if (filter.value.status !== 'all') {
      filterData.status = filter.value.status
    }
    
    if (filter.value.search) {
      filterData.search = filter.value.search
    }

    await bookingStore.fetchAllBookings(filterData)
    bookings.value = bookingStore.bookings
  } catch (err: any) {
    error.value = err.message || 'Failed to load bookings'
  } finally {
    loading.value = false
  }
}

const applyFilter = () => {
  loadBookings()
}

const getStatusName = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    0: 'Waiting for Payment',
    1: 'Payment Confirmed',
    2: 'Done',
    3: 'Request Refund',
    4: 'Cancelled'
  }
  return statusMap[status] || 'Unknown'
}

const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goToCreateBooking = () => {
  router.push('/bookings/create')
}

const goToBookingDetail = (bookingId: string) => {
  router.push(`/bookings/${bookingId}`)
}

onMounted(() => {
  loadBookings()
})
</script>