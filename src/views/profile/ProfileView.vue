<template>
  <main class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Sidebar -->
        <aside class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <!-- User Header -->
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
              <div class="flex flex-col items-center">
                <div class="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold mb-3 border-4 border-white/30">
                  {{ userInitial }}
                </div>
                <h2 class="text-lg font-semibold text-center">{{ userName }}</h2>
                <p class="text-sm text-blue-100 mt-1">{{ userEmail }}</p>
                <span class="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium" :class="roleBadgeClass">
                  {{ userRoleName }}
                </span>
              </div>
            </div>

            <!-- Menu Items -->
            <nav class="p-3">
              <router-link
                to="/profile"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors bg-blue-50 text-blue-600"
                active-class="bg-blue-50 text-blue-600"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Account
              </router-link>
              
              <router-link
                v-if="isCustomer"
                to="/bookings"
                class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mt-1"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Bookings
              </router-link>

              <router-link
                v-if="isAccommodationOwner"
                to="/property"
                class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mt-1"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                My Properties
              </router-link>

              <router-link
                v-if="isCustomer"
                to="/topup"
                class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mt-1"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Wallet
              </router-link>

              <router-link
                v-if="isCustomer"
                to="/reviews/my"
                class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mt-1"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                My Reviews
              </router-link>

              <button
                @click="handleLogout"
                class="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-3 border-t border-gray-200 pt-4"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </button>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="lg:col-span-9">
          <div class="bg-white rounded-lg shadow-sm">
            <!-- Header -->
            <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Account Information</h1>
                <p class="text-sm text-gray-500 mt-1">Manage your personal information</p>
              </div>
              <router-link
                to="/profile/edit"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </router-link>
            </div>

            <div v-if="loading" class="p-8 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="text-gray-500 mt-4">Loading profile...</p>
            </div>

            <div v-else-if="error" class="p-8 text-center">
              <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-red-600 font-medium">{{ error }}</p>
            </div>

            <div v-else class="p-6">
              <!-- Personal Data Section -->
              <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Data
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Full Name -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                    <p class="text-base text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      {{ userName }}
                    </p>
                  </div>

                  <!-- Username -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Username</label>
                    <p class="text-base text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      {{ userInfo?.username || 'N/A' }}
                    </p>
                  </div>

                  <!-- Email -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                    <p class="text-base text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {{ userEmail }}
                    </p>
                  </div>

                  <!-- Gender -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</label>
                    <p class="text-base text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      {{ userInfo?.gender || 'Not specified' }}
                    </p>
                  </div>

                  <!-- Role -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Type</label>
                    <p class="text-base font-medium bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" :class="roleBadgeFullClass">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {{ userRoleName }}
                      </span>
                    </p>
                  </div>

                  <!-- Account Status -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Status</label>
                    <p class="text-base font-medium bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Active
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Wallet Section (Customer Only) -->
              <div v-if="isCustomer && userInfo && 'saldo' in userInfo" class="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Wallet Balance
                </h2>
                <div class="flex items-baseline">
                  <span class="text-sm text-gray-600 mr-2">Rp</span>
                  <span class="text-3xl font-bold text-green-600">
                    {{ (userInfo.saldo || 0).toLocaleString('id-ID') }}
                  </span>
                </div>
                <router-link
                  to="/topup"
                  class="inline-flex items-center mt-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Top Up
                </router-link>
              </div>

              <!-- Account Information -->
              <div class="pt-6 border-t border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Account Details
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div class="flex items-center text-gray-600">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      Joined: <strong class="text-gray-900">{{ formatDate(userInfo?.createdAt) }}</strong>
                    </span>
                  </div>
                  <div class="flex items-center text-gray-600">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Last updated: <strong class="text-gray-900">{{ formatDate(userInfo?.updatedAt) }}</strong>
                    </span>
                  </div>
                  <div class="flex items-center text-gray-600">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span>
                      User ID: <strong class="text-gray-900 font-mono text-xs">{{ userInfo?.id }}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth.store'
import { userService } from '@/services/user.service'
import type { User, Customer } from '@/interfaces/user.interface'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref<string | null>(null)
const userInfo = ref<User | Customer | null>(null)

// Get current user from auth store
const currentUser = computed(() => authStore.currentUserInfo)
const userName = computed(() => userInfo.value?.name || currentUser.value?.name || 'User')
const userEmail = computed(() => userInfo.value?.email || currentUser.value?.email || 'user@example.com')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const userRoleName = computed(() => {
  const role = userInfo.value?.role || currentUser.value?.role
  if (role === 'SUPERADMIN') return 'Superadmin'
  if (role === 'ACCOMMODATION_OWNER') return 'Accommodation Owner'
  if (role === 'CUSTOMER') return 'Customer'
  return role || 'Guest'
})

const roleBadgeClass = computed(() => {
  const role = userInfo.value?.role || currentUser.value?.role
  if (role === 'SUPERADMIN') return 'bg-purple-100 text-purple-800'
  if (role === 'ACCOMMODATION_OWNER') return 'bg-blue-100 text-blue-800'
  if (role === 'CUSTOMER') return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
})

const roleBadgeFullClass = computed(() => {
  const role = userInfo.value?.role || currentUser.value?.role
  if (role === 'SUPERADMIN') return 'bg-purple-100 text-purple-700 border border-purple-200'
  if (role === 'ACCOMMODATION_OWNER') return 'bg-blue-100 text-blue-700 border border-blue-200'
  if (role === 'CUSTOMER') return 'bg-green-100 text-green-700 border border-green-200'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
})

const isCustomer = computed(() => {
  const role = userInfo.value?.role || currentUser.value?.role
  return role === 'CUSTOMER'
})

const isAccommodationOwner = computed(() => {
  const role = userInfo.value?.role || currentUser.value?.role
  return role === 'ACCOMMODATION_OWNER'
})

const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const fetchProfile = async () => {
  if (!currentUser.value?.username) {
    error.value = 'User information not available. Please login again.'
    return
  }
  
  try {
    loading.value = true
    error.value = null
    const data = await userService.getUserByIdentifier(currentUser.value.username)
    userInfo.value = data
  } catch (err: any) {
    error.value = err.message || 'Failed to load profile data'
    console.error('Error fetching profile:', err)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}

onMounted(async () => {
  await fetchProfile()
})
</script>
