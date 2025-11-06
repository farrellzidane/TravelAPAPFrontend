<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <router-link 
          to="/" 
          class="text-xl font-bold text-blue-600 hover:text-blue-700 transition duration-200"
        >
          TravelAPAP
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/property"
            class="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            active-class="text-blue-600"
          >
            Property
          </router-link>
          <router-link
            to="/booking"
            class="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            active-class="text-blue-600"
          >
            Booking
          </router-link>
          <router-link
            to="/statistic"
            class="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            active-class="text-blue-600"
          >
            Statistic
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!isMobileMenuOpen"
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

      <!-- Mobile Navigation -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden py-4 border-t border-gray-200"
      >
        <router-link
          to="/property"
          class="block py-2 text-gray-700 hover:text-blue-600 font-medium transition duration-200"
          active-class="text-blue-600"
          @click="closeMobileMenu"
        >
          Property
        </router-link>
        <router-link
          to="/booking"
          class="block py-2 text-gray-700 hover:text-blue-600 font-medium transition duration-200"
          active-class="text-blue-600"
          @click="closeMobileMenu"
        >
          Booking
        </router-link>
        <router-link
          to="/statistic"
          class="block py-2 text-gray-700 hover:text-blue-600 font-medium transition duration-200"
          active-class="text-blue-600"
          @click="closeMobileMenu"
        >
          Statistic
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>