<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Header Section -->
        <div class="mb-6">
          <button
            @click="router.push({ name: 'topup' })"
            class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Top-Up List
          </button>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Top-Up Transaction Detail</h1>
          <p class="text-gray-600">View and manage top-up transaction</p>
        </div>

        <!-- Loading State -->
        <div v-if="topUpStore.loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading transaction details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="topUpStore.error" class="text-center py-12">
          <div class="text-red-500 text-xl mb-4">⚠️</div>
          <p class="text-red-600 mb-2">{{ topUpStore.error }}</p>
          <button
            @click="loadTopUp"
            class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>

        <!-- Detail Content -->
        <div v-else-if="topUpStore.currentTopUp" class="space-y-6">
          <!-- Status Badge -->
          <div class="flex items-center justify-between">
            <span
              :class="[
                'px-4 py-2 inline-flex text-sm font-semibold rounded-lg',
                topUpStore.currentTopUp.statusColor === 'success' ? 'bg-green-100 text-green-800' :
                topUpStore.currentTopUp.statusColor === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              ]"
            >
              {{ topUpStore.currentTopUp.statusText }}
            </span>
              <span class="text-sm text-gray-500">
              {{ formatDate(topUpStore.currentTopUp.createdAt) }}
            </span>
          </div>

          <!-- Transaction Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Transaction ID</label>
                <p class="text-gray-900">{{ topUpStore.currentTopUp.transactionId }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Customer ID</label>
                <p class="text-gray-900">{{ topUpStore.currentTopUp.endUserId }}</p>
              </div>              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
                <p class="text-2xl font-bold text-blue-600">
                  Rp {{ formatCurrency(topUpStore.currentTopUp.amount) }}
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
                <p class="text-gray-900">{{ topUpStore.currentTopUp.paymentMethodName || 'N/A' }}</p>
              </div>

              <div v-if="topUpStore.currentTopUp.provider">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Provider</label>
                <p class="text-gray-900">{{ topUpStore.currentTopUp.provider }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Last Updated</label>
                <p class="text-gray-900">{{ formatDate(topUpStore.currentTopUp.updatedAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Admin Actions (for Superadmin only) -->
          <div v-if="topUpStore.currentTopUp.status === 'Pending'" class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Update Status</h3>
            <div class="flex gap-4">
              <button
                @click="updateStatus('Success')"
                :disabled="isUpdating"
                class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isUpdating ? 'Updating...' : 'Mark as Success' }}
              </button>
              <button
                @click="updateStatus('Failed')"
                :disabled="isUpdating"
                class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isUpdating ? 'Updating...' : 'Mark as Failed' }}
              </button>
            </div>
          </div>

          <!-- Delete Action (for Superadmin only) -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h3>
            <button
              @click="handleDelete"
              :disabled="isDeleting"
              class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete Transaction' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTopUpStore } from '@/stores/topup/topup.stores'
import type { UpdateTopUpStatusRequest } from '@/interfaces/topup.interface'

const router = useRouter()
const route = useRoute()
const topUpStore = useTopUpStore()

const isUpdating = ref(false)
const isDeleting = ref(false)

const topUpId = ref(route.params.id as string)

onMounted(async () => {
  await loadTopUp()
})

const loadTopUp = async () => {
  try {
    await topUpStore.fetchTopUpById(topUpId.value)
  } catch (error) {
    console.error('Failed to load top-up:', error)
  }
}

const updateStatus = async (status: string) => {
  if (!confirm(`Are you sure you want to mark this transaction as ${status}?`)) {
    return
  }

  isUpdating.value = true

  try {
    const data: UpdateTopUpStatusRequest = { 
      transactionId: topUpId.value,
      status 
    }
    await topUpStore.updateTopUpStatus(data)
  } catch (error) {
    console.error('Failed to update status:', error)
  } finally {
    isUpdating.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
    return
  }

  isDeleting.value = true

  try {
    await topUpStore.deleteTopUp(topUpId.value)
    router.push({ name: 'topup' })
  } catch (error) {
    console.error('Failed to delete top-up:', error)
  } finally {
    isDeleting.value = false
  }
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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}
</script>
