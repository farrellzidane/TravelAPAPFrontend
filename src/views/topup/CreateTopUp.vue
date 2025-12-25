<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Header Section -->
        <div class="mb-6">
          <button
            @click="router.back()"
            class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Create Top-Up Transaction</h1>
          <p class="text-gray-600">Fill in the form to create a new top-up transaction</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Customer ID -->
          <div>
            <label for="customerId" class="block text-sm font-semibold text-gray-700 mb-2">
              Customer ID <span class="text-red-500">*</span>
            </label>
            <input
              id="customerId"
              v-model="formData.customerId"
              type="text"
              required
              readonly
              placeholder="Customer ID"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
            <p v-if="isCustomer" class="mt-1 text-sm text-gray-500">Your customer ID is automatically filled</p>
          </div>

          <!-- Payment Method -->
          <div>
            <label for="paymentMethodId" class="block text-sm font-semibold text-gray-700 mb-2">
              Payment Method <span class="text-red-500">*</span>
            </label>
            <div v-if="paymentMethodStore.loading" class="text-gray-500">Loading payment methods...</div>
            <select
              v-else
              id="paymentMethodId"
              v-model="formData.paymentMethodId"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select payment method</option>
              <option
                v-for="method in paymentMethodStore.activePaymentMethodsList"
                :key="method.paymentMethodId"
                :value="method.paymentMethodId"
              >
                {{ method.methodName }} - {{ method.provider }}
              </option>
            </select>
          </div>

          <!-- Amount -->
          <div>
            <label for="amount" class="block text-sm font-semibold text-gray-700 mb-2">
              Amount <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
              <input
                id="amount"
                v-model.number="formData.amount"
                type="number"
                min="1"
                step="1"
                required
                placeholder="0"
                class="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">Enter amount in Rupiah (minimum Rp 1)</p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-800 text-sm">{{ errorMessage }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {{ isSubmitting ? 'Creating...' : 'Create Top-Up' }}
            </button>
            <button
              type="button"
              @click="router.back()"
              :disabled="isSubmitting"
              class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTopUpStore } from '@/stores/topup/topup.stores'
import { usePaymentMethodStore } from '@/stores/paymentmethod/paymentmethod.stores'
import { useAuthStore } from '@/stores/auth/auth.store'
import type { CreateTopUpRequest } from '@/interfaces/topup.interface'

const router = useRouter()
const topUpStore = useTopUpStore()
const paymentMethodStore = usePaymentMethodStore()
const authStore = useAuthStore()

const formData = reactive<CreateTopUpRequest>({
  customerId: '',
  amount: 0,
  paymentMethodId: ''
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const isCustomer = computed(() => {
  return authStore.currentUserInfo?.role === 'CUSTOMER'
})

onMounted(async () => {
  // Redirect non-Customer users back to top-up list
  if (!isCustomer.value) {
    alert('Only customers can create top-up transactions')
    router.push({ name: 'topup' })
    return
  }
  
  // Auto-fill customer ID if user is customer
  if (isCustomer.value && authStore.currentUserInfo?.userId) {
    formData.customerId = authStore.currentUserInfo.userId
  } else {
    console.error('Failed to get user ID from auth store')
    errorMessage.value = 'Failed to retrieve customer information. Please try logging in again.'
  }
  
  // Load payment methods
  await paymentMethodStore.fetchAllPaymentMethods()
})

const handleSubmit = async () => {
  errorMessage.value = ''
  
  // Validation
  if (!formData.customerId.trim()) {
    errorMessage.value = 'Customer ID is required'
    return
  }

  if (!formData.paymentMethodId) {
    errorMessage.value = 'Please select a payment method'
    return
  }

  if (formData.amount <= 0) {
    errorMessage.value = 'Amount must be greater than 0'
    return
  }

  isSubmitting.value = true

  try {
    const newTopUp = await topUpStore.createTopUp(formData)
    
    if (newTopUp) {
      router.push({ name: 'topup-detail', params: { id: newTopUp.transactionId } })
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to create top-up transaction'
  } finally {
    isSubmitting.value = false
  }
}
</script>
