import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, Customer } from '@/interfaces/user.interface'
import { userService } from '@/services/user.service'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const customers = ref<Customer[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchAllUsers = async () => {
    loading.value = true
    error.value = null
    try {
      users.value = await userService.getAllUsers()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch users'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAllCustomers = async (search?: string, gender?: string) => {
    loading.value = true
    error.value = null
    try {
      customers.value = await userService.getAllCustomers(search, gender)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch customers'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserByIdentifier = async (identifier: string) => {
    loading.value = true
    error.value = null
    try {
      currentUser.value = await userService.getUserByIdentifier(identifier)
      return currentUser.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userId: string, data: any) => {
    loading.value = true
    error.value = null
    try {
      const updatedUser = await userService.updateUser(userId, data)
      
      // Update in users array if exists
      const userIndex = users.value.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex] = updatedUser
      }
      
      // Update in customers array if exists
      const customerIndex = customers.value.findIndex((c) => c.id === userId)
      if (customerIndex !== -1) {
        customers.value[customerIndex] = updatedUser as Customer
      }
      
      // Update current user if it's the same
      if (currentUser.value?.id === userId) {
        currentUser.value = updatedUser
      }
      
      return updatedUser
    } catch (err: any) {
      error.value = err.message || 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    users.value = []
    customers.value = []
    currentUser.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    users,
    customers,
    currentUser,
    loading,
    error,
    
    // Actions
    fetchAllUsers,
    fetchAllCustomers,
    fetchUserByIdentifier,
    updateUser,
    clearError,
    reset
  }
})
