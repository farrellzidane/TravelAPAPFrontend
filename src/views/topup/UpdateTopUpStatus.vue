<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <!-- Back Button -->
        <button
          @click="goBack"
          class="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Top-Up List
        </button>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Update Top-Up Status</h1>
          <p class="text-gray-600 mb-6">Change the status of the top-up transaction</p>

          <!-- Loading State -->
          <div v-if="topUpStore.loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Loading...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="topUpStore.error" class="text-center py-8">
            <div class="text-red-500 text-xl mb-4">⚠️</div>
            <p class="text-red-600">{{ topUpStore.error }}</p>
          </div>

          <!-- Form -->
          <div v-else-if="topUpStore.currentTopUp" class="space-y-6">
            <!-- Transaction Details -->
            <div class="bg-gray-50 rounded-lg p-6 space-y-3">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Transaction ID</p>
                  <p class="font-medium text-gray-900">{{ topUpStore.currentTopUp.transactionId }}</p>
                </div>
                
                <div>
                  <p class="text-sm text-gray-600">Customer ID</p>
                  <p class="font-medium text-gray-900">{{ topUpStore.currentTopUp.endUserId }}</p>
                </div>
                
                <div>
                  <p class="text-sm text-gray-600">Amount</p>
                  <p class="font-medium text-gray-900">Rp {{ formatCurrency(topUpStore.currentTopUp.amount) }}</p>
                </div>
                
                <div>
                  <p class="text-sm text-gray-600">Payment Method</p>
                  <p class="font-medium text-gray-900">{{ topUpStore.currentTopUp.paymentMethodName || 'N/A' }}</p>
                  <p v-if="topUpStore.currentTopUp.provider" class="text-xs text-gray-500">{{ topUpStore.currentTopUp.provider }}</p>
                </div>
                
                <div>
                  <p class="text-sm text-gray-600">Current Status</p>
                  <span :class="getStatusClass(topUpStore.currentTopUp.status)" class="inline-block px-3 py-1 text-xs font-semibold rounded-full">
                    {{ topUpStore.currentTopUp.status }}
                  </span>
                </div>
                
                <div>
                  <p class="text-sm text-gray-600">Created At</p>
                  <p class="font-medium text-gray-900">{{ formatDate(topUpStore.currentTopUp.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Status Update Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- New Status Selection -->
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                  New Status <span class="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  v-model="formData.status"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  :disabled="topUpStore.currentTopUp.status !== 'Pending'"
                >
                  <option value="" disabled>Select status</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                </select>
                <p v-if="topUpStore.currentTopUp.status !== 'Pending'" class="mt-2 text-sm text-red-600">
                  ⚠️ Only transactions with 'Pending' status can be updated
                </p>
              </div>

              <!-- Status Description -->
              <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p class="text-sm text-blue-800 font-medium mb-2">Status Update Information:</p>
                <ul class="text-sm text-blue-700 space-y-1 ml-4 list-disc">
                  <li><strong>Success:</strong> The system will add balance to the customer's profile</li>
                  <li><strong>Failed:</strong> No changes will be made to the balance</li>
                </ul>
              </div>

              <!-- Confirm Dialog -->
              <VConfirmDialog
                v-model="showConfirmDialog"
                :title="`Update Status to ${formData.status}?`"
                :message="getConfirmMessage()"
                variant="warning"
                confirm-text="Confirm"
                cancel-text="Cancel"
                @confirm="confirmUpdate"
                @cancel="showConfirmDialog = false"
              />

              <!-- Action Buttons -->
              <div class="flex gap-4 pt-4">
                <button
                  type="submit"
                  :disabled="topUpStore.loading || topUpStore.currentTopUp.status !== 'Pending' || !formData.status"
                  class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {{ topUpStore.loading ? 'Updating...' : 'Update Status' }}
                </button>
                
                <button
                  type="button"
                  @click="goBack"
                  class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Not Found State -->
          <div v-else class="text-center py-8">
            <p class="text-gray-600">Top-up transaction not found</p>
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
import { useAuthStore } from '@/stores/auth/auth.store'
import VConfirmDialog from '@/components/common/VConfirmDialog.vue'

const router = useRouter()
const route = useRoute()
const topUpStore = useTopUpStore()
const authStore = useAuthStore()
const showConfirmDialog = ref(false)

const formData = ref({
  status: ''
})

onMounted(async () => {
  // Check if user is superadmin
  if (authStore.currentUserInfo?.role !== 'SUPERADMIN') {
    router.push({ name: 'topup-list' })
    return
  }

  const transactionId = route.params.id as string
  if (transactionId) {
    await topUpStore.fetchTopUpById(transactionId)
  }
})

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
    minute: '2-digit'
  }).format(date)
}

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    'Success': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Failed': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getConfirmMessage = (): string => {
  const amount = formatCurrency(topUpStore.currentTopUp?.amount || 0)
  if (formData.value.status === 'Success') {
    return `Are you sure you want to mark this transaction as Success? This will add Rp ${amount} to the customer's balance.`
  } else if (formData.value.status === 'Failed') {
    return `Are you sure you want to mark this transaction as Failed? No changes will be made to the customer's balance.`
  }
  return 'Are you sure you want to update this transaction status?'
}

const handleSubmit = () => {
  if (!formData.value.status) {
    return
  }
  showConfirmDialog.value = true
}

const confirmUpdate = async () => {
  showConfirmDialog.value = false
  
  if (!topUpStore.currentTopUp) return

  try {
    await topUpStore.updateTopUpStatus({
      transactionId: topUpStore.currentTopUp.transactionId,
      status: formData.value.status
    })
    
    // Redirect to detail page or list page
    router.push({ name: 'topup-detail', params: { id: topUpStore.currentTopUp.transactionId } })
  } catch (error) {
    console.error('Error updating top-up status:', error)
  }
}

const goBack = () => {
  router.push({ name: 'topup-list' })
}
</script>
