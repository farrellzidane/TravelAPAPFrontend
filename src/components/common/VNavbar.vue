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
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>