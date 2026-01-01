<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Bills</h1>
        <p class="text-gray-600">Manage and pay your bills</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <!-- Status Filter -->
          <div class="w-full md:w-64">
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="filter.status"
              @change="loadBills"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option :value="0">Unpaid</option>
              <option :value="1">Paid</option>
            </select>
          </div>

          <!-- Service Name Filter (for Superadmin) -->
          <div v-if="isSuperAdmin" class="w-full md:w-64">
            <label class="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <select
              v-model="filter.serviceName"
              @change="loadBills"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Services</option>
              <option value="Accommodation">Accommodation</option>
              <option value="TopUp">TopUp</option>
              <option value="Flight">Flight</option>
              <option value="Insurance">Insurance</option>
              <option value="VehicleRental">Vehicle Rental</option>
              <option value="TourPackage">Tour Package</option>
            </select>
          </div>

          <!-- Sort By (for Customer) -->
          <div v-if="isCustomer" class="w-full md:w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              v-model="sortBy"
              @change="loadBills"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">None</option>
              <option value="createdAt">Created Date</option>
              <option value="serviceName">Service Name</option>
            </select>
          </div>

          <!-- Sort Direction (for Customer) -->
          <div v-if="isCustomer && sortBy" class="w-full md:w-40">
            <label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <select
              v-model="sortDirection"
              @change="loadBills"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
          <p class="mt-4 text-gray-600 text-lg">Loading bills...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div class="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 class="text-xl font-semibold text-red-800 mb-2">Error Loading Bills</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadBills"
          class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!bills || bills.length === 0" class="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div class="text-gray-400 text-6xl mb-4">💳</div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No Bills Found</h2>
        <p class="text-gray-500">
          {{ filter.status !== 'all' ? 'Try adjusting your filters' : 'You have no bills at the moment' }}
        </p>
      </div>

      <!-- Bills Table -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Bill ID
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Service
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Created At
                </th>
                <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="bill in bills"
                :key="bill.billId"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ bill.billId.substring(0, 8) }}...
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ bill.customerName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ bill.serviceName }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-700 max-w-xs truncate">{{ bill.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">
                    Rp {{ bill.amount.toLocaleString('id-ID') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      {
                        'bg-yellow-100 text-yellow-800': bill.status === 0,
                        'bg-green-100 text-green-800': bill.status === 1
                      }
                    ]"
                  >
                    {{ bill.statusText }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ formatDateTime(bill.createdAt) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="goToBillDetail(bill.billId)"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow transition"
                  >
                    View Detail
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
              Showing <span class="font-semibold">{{ bills.length }}</span> bill(s)
            </div>
            <div class="text-sm text-gray-600">
              Total Unpaid: <span class="font-semibold text-purple-600">
                Rp {{ totalUnpaidAmount.toLocaleString('id-ID') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBillStore } from '@/stores/bill/bill.stores'
import { useAuthStore } from '@/stores/auth/auth.store'
import { storeToRefs } from 'pinia'

const router = useRouter()
const billStore = useBillStore()
const authStore = useAuthStore()

const { bills, loading, error, totalUnpaidAmount } = storeToRefs(billStore)
const { userRole, currentUserInfo } = storeToRefs(authStore)

const filter = ref({
  status: 'all' as number | string,
  serviceName: ''
})

const sortBy = ref('')
const sortDirection = ref('desc')

const isCustomer = computed(() => userRole.value === 'CUSTOMER')
const isSuperAdmin = computed(() => userRole.value === 'SUPERADMIN')
const isAccommodationOwner = computed(() => userRole.value === 'ACCOMMODATION_OWNER')

const loadBills = async () => {
  try {
    if (isCustomer.value && currentUserInfo.value?.userId) {
      // Customer: fetch their own bills
      const statusFilter = filter.value.status === 'all' ? undefined : Number(filter.value.status)
      await billStore.fetchCustomerBills(
        currentUserInfo.value.userId,
        statusFilter,
        sortBy.value || undefined,
        sortDirection.value
      )
    } else if (isSuperAdmin.value) {
      // Superadmin: fetch all bills with filters
      const statusFilter = filter.value.status === 'all' ? undefined : Number(filter.value.status)
      await billStore.fetchAllBills({
        status: statusFilter,
        serviceName: filter.value.serviceName || undefined
      })
    } else if (isAccommodationOwner.value) {
      // Accommodation Owner: fetch bills for their service
      const statusFilter = filter.value.status === 'all' ? undefined : Number(filter.value.status)
      await billStore.fetchServiceBills('Accommodation', statusFilter)
    }
  } catch (err) {
    console.error('Failed to load bills:', err)
  }
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const goToBillDetail = (billId: string) => {
  router.push({ name: 'bill-detail', params: { id: billId } })
}

onMounted(() => {
  loadBills()
})
</script>
