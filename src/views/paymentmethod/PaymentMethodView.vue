<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Header Section -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Payment Method Management</h1>
          <p class="text-gray-600">Manage available payment methods</p>
        </div>

        <!-- Action Section -->
        <div class="mb-6">
          <!-- Add Payment Method Button - Hidden for Customer -->
          <button
            v-if="!isCustomer"
            @click="goToCreatePaymentMethod"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Payment Method
          </button>

          <!-- Info for Customer -->
          <div v-else class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-blue-800">View Only Access</p>
                <p class="text-xs text-blue-600 mt-1">As a customer, you can view available payment methods but cannot modify them.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="paymentMethodStore.loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading payment methods...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="paymentMethodStore.error" class="text-center py-12">
          <div class="text-red-500 text-xl mb-4">⚠️</div>
          <p class="text-red-600 mb-2">{{ paymentMethodStore.error }}</p>
          <button
            @click="paymentMethodStore.fetchAllPaymentMethods()"
            class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="paymentMethodStore.sortedPaymentMethods.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">💳</div>
          <p class="text-gray-600 text-lg">No payment methods found</p>
          <p class="text-gray-500 text-sm mt-2">Start by adding a new payment method</p>
        </div>

        <!-- Payment Methods Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-blue-50 border-b border-blue-100">
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Method Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Provider
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created Date
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="method in paymentMethodStore.sortedPaymentMethods"
                :key="method.paymentMethodId"
                class="hover:bg-gray-50 transition duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ method.paymentMethodId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ method.methodName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ method.provider }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      method.statusColor === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ method.statusText }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ formatDate(method.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center space-x-2">
                  <!-- Action buttons hidden for Customer -->
                  <template v-if="!isCustomer">
                    <button
                      @click="toggleStatus(method)"
                      :disabled="updatingId === method.paymentMethodId"
                      :class="[
                        'px-4 py-2 text-white text-sm font-semibold rounded-lg shadow transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed',
                        method.status === 'Active' 
                          ? 'bg-yellow-600 hover:bg-yellow-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      ]"
                    >
                      {{ updatingId === method.paymentMethodId 
                        ? 'Updating...' 
                        : method.status === 'Active' ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button
                      @click="handleDelete(method.paymentMethodId)"
                      :disabled="deletingId === method.paymentMethodId"
                      class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ deletingId === method.paymentMethodId ? 'Deleting...' : 'Delete' }}
                    </button>
                  </template>
                  <span v-else class="text-sm text-gray-500 italic">View Only</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Stats -->
        <div v-if="paymentMethodStore.sortedPaymentMethods.length > 0" class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <p class="text-gray-600 text-sm">Total Payment Methods</p>
            <p class="text-2xl font-bold text-gray-900">{{ paymentMethodStore.totalPaymentMethods }}</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <p class="text-gray-600 text-sm">Active Payment Methods</p>
            <p class="text-2xl font-bold text-green-600">{{ paymentMethodStore.activePaymentMethods }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentMethodStore } from '@/stores/paymentmethod/paymentmethod.stores'
import { getCurrentRole } from '@/config/axios.config'
import type { PaymentMethod, UpdatePaymentMethodStatusRequest } from '@/interfaces/paymentmethod.interface'

const router = useRouter()
const paymentMethodStore = usePaymentMethodStore()

const currentRole = computed(() => getCurrentRole())
const isCustomer = computed(() => currentRole.value === 'CUSTOMER' || currentRole.value === 'Customer')

const updatingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)

onMounted(async () => {
  await paymentMethodStore.fetchAllPaymentMethods()
})

const goToCreatePaymentMethod = () => {
  router.push({ name: 'create-payment-method' })
}

const toggleStatus = async (method: PaymentMethod) => {
  const newStatus = method.status === 'Active' ? 'Inactive' : 'Active'
  const action = newStatus === 'Active' ? 'activate' : 'deactivate'
  
  if (!confirm(`Are you sure you want to ${action} this payment method?`)) {
    return
  }

  updatingId.value = method.paymentMethodId

  try {
    const data: UpdatePaymentMethodStatusRequest = { 
      paymentMethodId: method.paymentMethodId,
      status: newStatus 
    }
    await paymentMethodStore.updatePaymentMethodStatus(data)
  } catch (error) {
    console.error('Failed to update status:', error)
  } finally {
    updatingId.value = null
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this payment method? This action cannot be undone.')) {
    return
  }

  deletingId.value = id

  try {
    await paymentMethodStore.deletePaymentMethod(id)
  } catch (error) {
    console.error('Failed to delete payment method:', error)
  } finally {
    deletingId.value = null
  }
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
