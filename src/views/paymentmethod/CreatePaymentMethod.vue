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
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Create Payment Method</h1>
          <p class="text-gray-600">Add a new payment method to the system</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Method Name -->
          <div>
            <label for="methodName" class="block text-sm font-semibold text-gray-700 mb-2">
              Method Name <span class="text-red-500">*</span>
            </label>
            <input
              id="methodName"
              v-model="formData.methodName"
              type="text"
              required
              placeholder="e.g., QRIS, Virtual Account, E-Wallet"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="mt-1 text-sm text-gray-500">Enter the payment method name</p>
          </div>

          <!-- Provider -->
          <div>
            <label for="provider" class="block text-sm font-semibold text-gray-700 mb-2">
              Provider <span class="text-red-500">*</span>
            </label>
            <input
              id="provider"
              v-model="formData.provider"
              type="text"
              required
              placeholder="e.g., BCA, Mandiri, GoPay, OVO"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="mt-1 text-sm text-gray-500">Enter the provider name</p>
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
              {{ isSubmitting ? 'Creating...' : 'Create Payment Method' }}
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

        <!-- Info Box -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-blue-800 text-sm">
            <strong>Note:</strong> New payment methods will be created with "Active" status by default and can be used immediately for top-up transactions.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentMethodStore } from '@/stores/paymentmethod/paymentmethod.stores'
import type { CreatePaymentMethodRequest } from '@/interfaces/paymentmethod.interface'

const router = useRouter()
const paymentMethodStore = usePaymentMethodStore()

const formData = reactive<CreatePaymentMethodRequest>({
  methodName: '',
  provider: ''
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  
  // Validation
  if (!formData.methodName.trim()) {
    errorMessage.value = 'Method name is required'
    return
  }

  if (!formData.provider.trim()) {
    errorMessage.value = 'Provider is required'
    return
  }

  isSubmitting.value = true

  try {
    const newPaymentMethod = await paymentMethodStore.createPaymentMethod(formData)
    
    if (newPaymentMethod) {
      router.push({ name: 'payment-method' })
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to create payment method'
  } finally {
    isSubmitting.value = false
  }
}
</script>
