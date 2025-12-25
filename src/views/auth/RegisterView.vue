<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { RegisterRequest } from '@/interfaces/user.interface'
import { userService } from '@/services/user.service'
import { toast } from 'vue-sonner'

const router = useRouter()
const loading = ref(false)
const selectedRole = ref<'CUSTOMER' | 'ACCOMMODATION_OWNER' | null>(null)

const registerData = ref<RegisterRequest>({
  role: 'CUSTOMER',
  username: '',
  password: '',
  name: '',
  email: '',
  gender: undefined,
})

const selectRole = (role: 'CUSTOMER' | 'ACCOMMODATION_OWNER') => {
  selectedRole.value = role
  registerData.value.role = role
}

const handleRegister = async () => {
  if (!registerData.value.role) {
    toast.error('Please select account type')
    return
  }
  
  loading.value = true
  try {
    await userService.register(registerData.value)
    toast.success('Registration successful! Please login.')
    router.push('/login')
  } catch (error: any) {
    toast.error(error.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Logo and Welcome -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold text-blue-600 mb-2">TravelAPAP</h1>
        <p class="text-gray-600">Create your account to get started</p>
      </div>

      <!-- Register Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>

        <!-- Step 1: Role Selection (Always visible) -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 text-center">
            Choose Your Account Type
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Customer Button -->
            <button
              type="button"
              @click="selectRole('CUSTOMER')"
              :class="[
                'relative p-6 rounded-xl border-2 transition-all transform hover:scale-105',
                selectedRole === 'CUSTOMER'
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-300 bg-white hover:border-blue-400'
              ]"
            >
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 class="font-bold text-lg text-gray-800 mb-1">Customer</h4>
                <p class="text-sm text-gray-600">Search and book accommodations</p>
                
                <!-- Checkmark when selected -->
                <div 
                  v-if="selectedRole === 'CUSTOMER'"
                  class="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </button>

            <!-- Accommodation Owner Button -->
            <button
              type="button"
              @click="selectRole('ACCOMMODATION_OWNER')"
              :class="[
                'relative p-6 rounded-xl border-2 transition-all transform hover:scale-105',
                selectedRole === 'ACCOMMODATION_OWNER'
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-300 bg-white hover:border-blue-400'
              ]"
            >
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 class="font-bold text-lg text-gray-800 mb-1">Accommodation Owner</h4>
                <p class="text-sm text-gray-600">Manage and list your properties</p>
                
                <!-- Checkmark when selected -->
                <div 
                  v-if="selectedRole === 'ACCOMMODATION_OWNER'"
                  class="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 2: Registration Form (Only shows after role selection) -->
        <div 
          v-if="selectedRole"
          class="border-t border-gray-200 pt-6 animate-fadeIn"
        >
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Username -->
              <div>
                <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
                  Username <span class="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  v-model="registerData.username"
                  type="text"
                  required
                  minlength="3"
                  maxlength="50"
                  placeholder="Enter username"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <!-- Full Name -->
              <div>
                <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  v-model="registerData.name"
                  type="text"
                  required
                  maxlength="100"
                  placeholder="Enter full name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  v-model="registerData.email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span class="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  v-model="registerData.password"
                  type="password"
                  required
                  minlength="8"
                  placeholder="Min. 8 characters"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <!-- Gender -->
              <div class="md:col-span-2">
                <label for="gender" class="block text-sm font-semibold text-gray-700 mb-2">
                  Gender <span class="text-gray-400 text-xs">(Optional)</span>
                </label>
                <select
                  id="gender"
                  v-model="registerData.gender"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Gender...</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <!-- Register Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg transform transition-all hover:scale-[1.02]"
            >
              <span v-if="loading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
              <span v-else>Create Account</span>
            </button>

            <!-- Login Link -->
            <div class="text-center pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600">
                Already have an account?
                <RouterLink 
                  to="/login" 
                  class="text-blue-600 hover:text-blue-700 font-semibold hover:underline ml-1"
                >
                  Login here
                </RouterLink>
              </p>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-500 mt-6">
        © 2025 TravelAPAP. Your trusted travel partner.
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
</style>