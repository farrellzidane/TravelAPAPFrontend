<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Header Section -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Top-Up Management</h1>
          <p class="text-gray-600">Manage your top-up transactions</p>
        </div>

        <!-- Action Section -->
        <div class="mb-6">
          <button
            @click="goToCreateTopUp"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Top-Up
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="topUpStore.loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading top-up transactions...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="topUpStore.error" class="text-center py-12">
          <div class="text-red-500 text-xl mb-4">⚠️</div>
          <p class="text-red-600 mb-2">{{ topUpStore.error }}</p>
          <button
            @click="topUpStore.fetchAllTopUps()"
            class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="topUpStore.sortedTopUps.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">💳</div>
          <p class="text-gray-600 text-lg">No top-up transactions found</p>
          <p class="text-gray-500 text-sm mt-2">Start by creating a new top-up transaction</p>
        </div>

        <!-- Top-Ups Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-blue-50 border-b border-blue-100">
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer ID
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Payment Method
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="topUp in topUpStore.sortedTopUps"
                :key="topUp.transactionId"
                class="hover:bg-gray-50 transition duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ topUp.transactionId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ topUp.endUserId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ topUp.paymentMethodName || 'N/A' }}
                  <span v-if="topUp.provider" class="text-gray-500 text-xs block">{{ topUp.provider }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  Rp {{ formatCurrency(topUp.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      topUp.statusColor === 'success' ? 'bg-green-100 text-green-800' :
                      topUp.statusColor === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ topUp.statusText }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ formatDate(topUp.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="goToDetail(topUp.transactionId)"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Stats -->
        <div v-if="topUpStore.sortedTopUps.length > 0" class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <p class="text-gray-600 text-sm">Total Transactions</p>
            <p class="text-2xl font-bold text-gray-900">{{ topUpStore.totalTopUps }}</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-2xl font-bold text-yellow-600">{{ topUpStore.pendingTopUps }}</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <p class="text-gray-600 text-sm">Successful</p>
            <p class="text-2xl font-bold text-green-600">{{ topUpStore.successfulTopUps }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTopUpStore } from '@/stores/topup/topup.stores'

const router = useRouter()
const topUpStore = useTopUpStore()

onMounted(async () => {
  await topUpStore.fetchAllTopUps()
})

const goToCreateTopUp = () => {
  router.push({ name: 'create-topup' })
}

const goToDetail = (id: string) => {
  router.push({ name: 'topup-detail', params: { id } })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>
