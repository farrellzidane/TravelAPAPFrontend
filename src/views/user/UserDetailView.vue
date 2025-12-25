<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user/user.store'
import { useAuthStore } from '@/stores/auth/auth.store'
import type { Customer } from '@/interfaces/user.interface'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const userId = computed(() => route.params.id as string)

const user = computed(() => userStore.currentUser)
const isCustomer = computed(() => user.value && 'saldo' in user.value)

const canEdit = computed(() => {
  if (!authStore.currentUserInfo) return false
  const currentRole = authStore.currentUserInfo.role
  const currentUserId = authStore.currentUserInfo.userId
  
  // Superadmin can edit anyone
  if (currentRole === 'SUPERADMIN') return true
  
  // Users can edit themselves
  if (currentUserId === userId.value) return true
  
  // Accommodation owners can edit customers
  if (currentRole === 'ACCOMMODATION_OWNER' && user.value?.role === 'CUSTOMER') return true
  
  return false
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount)
}

const handleEdit = () => {
  router.push(`/users/${userId.value}/edit`)
}

const handleBack = () => {
  router.back()
}

onMounted(async () => {
  if (userId.value) {
    await userStore.fetchUserByIdentifier(userId.value)
  }
})
</script>

<template>
  <main class="w-full min-h-screen pt-24 py-10 px-4">
    <div class="mx-auto w-full max-w-4xl">
      <div class="bg-white shadow-lg rounded-2xl p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900">User Details</h1>
          <div class="flex gap-3">
            <button
              @click="handleBack"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back
            </button>
            <button
              v-if="canEdit"
              @click="handleEdit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit User
            </button>
          </div>
        </div>

        <div v-if="userStore.loading" class="text-center py-10">
          <p class="text-gray-500">Loading user details...</p>
        </div>

        <div v-else-if="userStore.error" class="text-center py-10">
          <p class="text-red-500">{{ userStore.error }}</p>
        </div>

        <div v-else-if="user" class="space-y-6">
          <!-- Basic Information -->
          <div class="border-b pb-4">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Username</p>
                <p class="text-base font-medium">{{ user.username }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Name</p>
                <p class="text-base font-medium">{{ user.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="text-base font-medium">{{ user.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Gender</p>
                <p class="text-base font-medium">{{ user.gender || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Role Information -->
          <div class="border-b pb-4">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Role</h2>
            <span
              class="px-3 py-1 text-sm rounded-full font-medium"
              :class="{
                'bg-purple-100 text-purple-800': user.role === 'SUPERADMIN',
                'bg-blue-100 text-blue-800': user.role === 'ACCOMMODATION_OWNER',
                'bg-green-100 text-green-800': user.role === 'CUSTOMER',
              }"
            >
              {{ user.role }}
            </span>
          </div>

          <!-- Customer-specific Info -->
          <div v-if="isCustomer" class="border-b pb-4">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
            <div>
              <p class="text-sm text-gray-500">Account Balance</p>
              <p class="text-xl font-bold text-green-600">
                {{ formatCurrency((user as Customer).saldo) }}
              </p>
            </div>
          </div>

          <!-- Timestamps -->
          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Account Activity</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Created At</p>
                <p class="text-base font-medium">{{ formatDate(user.createdAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Last Updated</p>
                <p class="text-base font-medium">{{ formatDate(user.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
