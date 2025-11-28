<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <router-link
          to="/"
          class="text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
        >
          TravelAPAP
        </router-link>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/property"
            class="text-gray-700 hover:text-blue-600 font-medium transition"
            active-class="text-blue-600 font-semibold"
          >
            Property
          </router-link>
          <router-link
            to="/bookings"
            class="text-gray-700 hover:text-blue-600 font-medium transition"
            active-class="text-blue-600 font-semibold"
          >
            Bookings
          </router-link>
          <router-link
            to="/topup"
            class="text-gray-700 hover:text-blue-600 font-medium transition"
            active-class="text-blue-600 font-semibold"
          >
            Top-Up
          </router-link>
          <router-link
            to="/payment-method"
            class="text-gray-700 hover:text-blue-600 font-medium transition"
            active-class="text-blue-600 font-semibold"
          >
            Payment Method
          </router-link>
          <router-link
            to="/statistic"
            class="text-gray-700 hover:text-blue-600 font-medium transition"
            active-class="text-blue-600 font-semibold"
          >
            Statistic
          </router-link>
          <router-link
            v-if="isCustomer"
            to="/reviews/customer"
            class="text-gray-700 hover:text-blue-600 font-medium transition"
            active-class="text-blue-600 font-semibold"
          >
            My Reviews
          </router-link>

          <!-- Role Switcher -->
          <!-- <div class="relative">
            <select
              v-model="currentRole"
              @change="switchRole"
              class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
            >
              <option value="SUPERADMIN">Superadmin</option>
              <option value="ACCOMMODATION_OWNER">Owner</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div> -->
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden text-gray-700 hover:text-blue-600 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200">
        <div class="flex flex-col space-y-2">
          <router-link
            to="/property"
            @click="closeMobileMenu"
            class="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
            active-class="bg-blue-50 text-blue-600 font-semibold"
          >
            Property
          </router-link>
          <router-link
            to="/bookings"
            @click="closeMobileMenu"
            class="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
            active-class="bg-blue-50 text-blue-600 font-semibold"
          >
            Bookings
          </router-link>
          <router-link
            to="/topup"
            @click="closeMobileMenu"
            class="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
            active-class="bg-blue-50 text-blue-600 font-semibold"
          >
            Top-Up
          </router-link>
          <router-link
            to="/payment-method"
            @click="closeMobileMenu"
            class="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
            active-class="bg-blue-50 text-blue-600 font-semibold"
          >
            Payment Method
          </router-link>
          <router-link
            to="/statistic"
            @click="closeMobileMenu"
            class="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
            active-class="bg-blue-50 text-blue-600 font-semibold"
          >
            Statistic
          </router-link>
          <router-link
            v-if="isCustomer"
            to="/reviews/customer"
            @click="closeMobileMenu"
            class="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
            active-class="bg-blue-50 text-blue-600 font-semibold"
          >
            My Reviews
          </router-link>

          <!-- Mobile Role Switcher -->
          <!-- <div class="px-4 py-2">
            <label class="block text-xs text-gray-500 mb-1">Role:</label>
            <select
              v-model="currentRole"
              @change="switchRole"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="SUPERADMIN">👑 Superadmin</option>
              <option value="ACCOMMODATION_OWNER">🏨 Owner</option>
              <option value="CUSTOMER">👤 Customer</option>
            </select>
          </div> -->
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { setUserRole, getCurrentRole } from '@/config/axios.config'
import { toast } from 'vue-sonner'

const mobileMenuOpen = ref(false)
const currentRole = ref<string>('SUPERADMIN')

const isCustomer = computed(() => {
  return currentRole.value === 'CUSTOMER'
})

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// const switchRole = () => {
//   setUserRole(currentRole.value as any)
  
//   const roleNames: Record<string, string> = {
//     'SUPERADMIN': 'Superadmin',
//     'ACCOMMODATION_OWNER': 'Accommodation Owner',
//     'CUSTOMER': 'Customer'
//   }
  
//   toast.success(`Role switched to ${roleNames[currentRole.value]}`, {
//     description: 'Page will reload to apply changes'
//   })
  
//   // Reload page to apply new role
//   setTimeout(() => {
//     window.location.reload()
//   }, 1000)
// }

// onMounted(() => {
//   currentRole.value = getCurrentRole()
// })
</script>