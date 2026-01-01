<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
          <p class="mt-4 text-gray-600 text-lg">Loading bill details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 class="text-xl font-semibold text-red-800 mb-2">Error Loading Bill</h2>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <div class="flex gap-4 justify-center">
            <button
              @click="fetchBillDetail"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Retry
            </button>
            <button
              @click="goBack"
              class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>

      <!-- Bill Detail -->
      <div v-else-if="currentBill" class="max-w-4xl mx-auto">
        <!-- Header Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <!-- Title and Status -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">Bill Details</h1>
              <p class="text-sm text-gray-500">
                Bill ID: <span class="font-mono">{{ currentBill.billId }}</span>
              </p>
            </div>

            <!-- Status Badge -->
            <span
              :class="[
                'px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full',
                {
                  'bg-yellow-100 text-yellow-800': currentBill.status === 0,
                  'bg-green-100 text-green-800': currentBill.status === 1
                }
              ]"
            >
              {{ currentBill.statusText }}
            </span>
          </div>

          <!-- Bill Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Service Info -->
            <div class="bg-purple-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-purple-900 mb-3">Service Information</h3>
              <div class="space-y-2">
                <div>
                  <label class="block text-sm font-medium text-purple-700">Service Name</label>
                  <p class="text-base font-semibold text-gray-800">{{ currentBill.serviceName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-purple-700">Service Reference ID</label>
                  <p class="text-xs font-mono text-gray-600 break-all">{{ currentBill.serviceReferenceId }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-purple-700">Description</label>
                  <p class="text-base text-gray-800">{{ currentBill.description }}</p>
                </div>
              </div>
            </div>

            <!-- Customer Info -->
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-blue-900 mb-3">Customer Information</h3>
              <div class="space-y-2">
                <div>
                  <label class="block text-sm font-medium text-blue-700">Customer ID</label>
                  <p class="text-xs font-mono text-gray-600 break-all">{{ currentBill.customerId }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-700">Customer Name</label>
                  <p class="text-base font-semibold text-gray-800">{{ currentBill.customerName }}</p>
                </div>
                <div v-if="currentBill.customerEmail">
                  <label class="block text-sm font-medium text-blue-700">Email</label>
                  <p class="text-base text-gray-800">{{ currentBill.customerEmail }}</p>
                </div>
              </div>
            </div>

            <!-- Amount Info -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
              <h3 class="text-lg font-semibold text-green-900 mb-3">Amount</h3>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-green-700">Total Amount</span>
                <span class="text-2xl font-bold text-green-600">
                  Rp {{ currentBill.amount.toLocaleString('id-ID') }}
                </span>
              </div>
            </div>

            <!-- Timestamps -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Timestamps</h3>
              <div class="space-y-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Created At</label>
                  <p class="text-sm text-gray-800">{{ formatDateTime(currentBill.createdAt) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Updated At</label>
                  <p class="text-sm text-gray-800">{{ formatDateTime(currentBill.updatedAt) }}</p>
                </div>
                <div v-if="currentBill.paymentTimestamp">
                  <label class="block text-sm font-medium text-gray-700">Payment Timestamp</label>
                  <p class="text-sm text-green-600 font-semibold">
                    {{ formatDateTime(currentBill.paymentTimestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Section (Only for Unpaid Bills and Customer) -->
        <div v-if="currentBill.status === 0 && isCustomer" class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Pay Bill</h2>

          <!-- Coupon Code Input (Optional) -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code (Optional)
            </label>
            <input
              v-model="couponCode"
              type="text"
              placeholder="Enter coupon code"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-1">If you have a coupon code, enter it here to get a discount</p>
          </div>

          <!-- Amount Summary -->
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-lg font-medium text-gray-700">Amount to Pay</span>
              <span class="text-3xl font-bold text-purple-600">
                Rp {{ currentBill.amount.toLocaleString('id-ID') }}
              </span>
            </div>
          </div>

          <!-- Pay Button -->
          <button
            @click="handlePayBill"
            :disabled="processingPayment"
            class="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="processingPayment" class="flex items-center justify-center gap-2">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing Payment...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pay Now
            </span>
          </button>
        </div>

        <!-- Paid Status Message -->
        <div v-else-if="currentBill.status === 1" class="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div class="text-green-500 text-6xl mb-4">✓</div>
          <h2 class="text-2xl font-semibold text-green-800 mb-2">Bill Already Paid</h2>
          <p class="text-green-600">This bill has been paid on {{ formatDateTime(currentBill.paymentTimestamp || '') }}</p>
        </div>

        <!-- Back Button -->
        <div class="mt-6 flex justify-center">
          <button
            @click="goBack"
            class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition"
          >
            Back to Bills
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Confirmation Dialog -->
    <VConfirmDialog
      v-model="showPaymentConfirm"
      title="Confirm Payment"
      :message="`Are you sure you want to pay Rp ${currentBill?.amount.toLocaleString('id-ID')}?`"
      confirmText="Pay Now"
      :loading="processingPayment"
      @confirm="confirmPayment"
      @cancel="showPaymentConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBillStore } from '@/stores/bill/bill.stores'
import { useAuthStore } from '@/stores/auth/auth.store'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import VConfirmDialog from '@/components/common/VConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const billStore = useBillStore()
const authStore = useAuthStore()

const { currentBill, loading, error } = storeToRefs(billStore)
const { userRole } = storeToRefs(authStore)

const couponCode = ref('')
const processingPayment = ref(false)
const showPaymentConfirm = ref(false)

const isCustomer = computed(() => userRole.value === 'CUSTOMER')

const billId = computed(() => route.params.id as string)

const fetchBillDetail = async () => {
  try {
    await billStore.fetchBillById(billId.value)
  } catch (err) {
    console.error('Failed to fetch bill detail:', err)
  }
}

const handlePayBill = () => {
  showPaymentConfirm.value = true
}

const confirmPayment = async () => {
  showPaymentConfirm.value = false
  processingPayment.value = true

  try {
    await billStore.payBill(billId.value, couponCode.value || undefined)
    
    // Refresh bill detail to show updated status
    await fetchBillDetail()
    
    toast.success('Payment successful!')
  } catch (err: any) {
    console.error('Payment failed:', err)
    toast.error(err.message || 'Payment failed. Please try again.')
  } finally {
    processingPayment.value = false
  }
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

const goBack = () => {
  router.push({ name: 'bills' })
}

onMounted(() => {
  fetchBillDetail()
})
</script>
