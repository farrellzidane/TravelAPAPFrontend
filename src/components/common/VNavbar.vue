<template>
  <nav class="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 shadow-sm">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <!-- Logo/Brand -->
      <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="self-center text-2xl font-bold text-gray-800 whitespace-nowrap">TravelAPAP</span>
      </router-link>
      
      <!-- User Menu & Mobile Toggle -->
      <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <!-- User Profile Dropdown -->
        <button
          @click="toggleUserDropdown"
          type="button"
          class="flex text-sm bg-gray-200 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 hover:bg-gray-300 transition"
          id="user-menu-button"
          aria-expanded="false"
        >
          <span class="sr-only">Open user menu</span>
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
            {{ userInitial }}
          </div>
        </button>
        
        <!-- Dropdown menu -->
        <div
          v-if="userDropdownOpen"
          @click.stop
          class="absolute right-4 top-16 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-56"
          id="user-dropdown"
        >
          <div class="px-4 py-3 text-sm border-b border-gray-200">
            <span class="block text-gray-900 font-semibold">{{ userName }}</span>
            <span class="block text-gray-500 truncate text-xs mt-1">{{ userEmail }}</span>
            <span class="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full" :class="roleBadgeClass">
              {{ userRole }}
            </span>
          </div>
          <ul class="p-2 text-sm text-gray-700 font-medium" aria-labelledby="user-menu-button">
            <li>
              <router-link
                to="/profile"
                @click="closeUserDropdown"
                class="flex items-center w-full px-3 py-2 hover:bg-gray-100 hover:text-blue-600 rounded transition"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </router-link>
            </li>
            <li>
              <router-link
                to="/profile/edit"
                @click="closeUserDropdown"
                class="flex items-center w-full px-3 py-2 hover:bg-gray-100 hover:text-blue-600 rounded transition"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </router-link>
            </li>
            <li class="border-t border-gray-200 mt-2 pt-2">
              <button
                @click="handleLogout"
                class="flex items-center w-full px-3 py-2 hover:bg-red-50 hover:text-red-600 rounded transition text-left"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </button>
            </li>
          </ul>
        </div>
        
        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-user"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Navigation Links -->
      <div
        :class="{ hidden: !mobileMenuOpen }"
        class="items-center justify-between w-full md:flex md:w-auto md:order-1"
        id="navbar-user"
      >
        <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
          <li>
            <router-link
              to="/"
              @click="closeMobileMenu"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 transition"
              active-class="text-white bg-blue-600 md:bg-transparent md:text-blue-600"
              aria-current="page"
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link
              to="/property"
              @click="closeMobileMenu"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 transition"
              active-class="text-blue-600"
            >
              Property
            </router-link>
          </li>
          <li>
            <router-link
              to="/bookings"
              @click="closeMobileMenu"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 transition"
              active-class="text-blue-600"
            >
              Bookings
            </router-link>
          </li>
          <li v-if="!isAccommodationOwner">
            <router-link
              to="/topup"
              @click="closeMobileMenu"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 transition"
              active-class="text-blue-600"
            >
              Top-Up
            </router-link>
          </li>
          <li v-if="isSuperadmin">
            <router-link
              to="/payment-method"
              @click="closeMobileMenu"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 transition"
              active-class="text-blue-600"
            >
              Payment
            </router-link>
          </li>
          <li v-if="isSuperadmin">
            <router-link
              to="/users"
              @click="closeMobileMenu"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 transition"
              active-class="text-blue-600"
            >
              Users
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth/auth.store'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)
const userDropdownOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    userDropdownOpen.value = false
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleUserDropdown = () => {
  userDropdownOpen.value = !userDropdownOpen.value
  if (userDropdownOpen.value) {
    mobileMenuOpen.value = false
  }
}

const closeUserDropdown = () => {
  userDropdownOpen.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  closeUserDropdown()
  closeMobileMenu()
}

// User info computed properties
const userName = computed(() => authStore.currentUserInfo?.name || 'User')
const userEmail = computed(() => authStore.currentUserInfo?.email || 'user@example.com')
const userRole = computed(() => {
  const role = authStore.currentUserInfo?.role
  if (role === 'SUPERADMIN') return 'Superadmin'
  if (role === 'ACCOMMODATION_OWNER') return 'Accommodation Owner'
  if (role === 'CUSTOMER') return 'Customer'
  return role || 'Guest'
})

const userInitial = computed(() => {
  const name = userName.value
  return name.charAt(0).toUpperCase()
})

const roleBadgeClass = computed(() => {
  const role = authStore.currentUserInfo?.role
  if (role === 'SUPERADMIN') return 'bg-purple-100 text-purple-800'
  if (role === 'ACCOMMODATION_OWNER') return 'bg-blue-100 text-blue-800'
  if (role === 'CUSTOMER') return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
})

const isAccommodationOwner = computed(() => {
  return authStore.currentUserInfo?.role === 'ACCOMMODATION_OWNER'
})

const isSuperadmin = computed(() => {
  return authStore.currentUserInfo?.role === 'SUPERADMIN'
})

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('#user-menu-button') && !target.closest('#user-dropdown')) {
    userDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
