import type { LoginRequest } from '@/interfaces/auth/auth.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import type { CurrentUser } from '@/interfaces/auth/profile.interface'
import type { LoginRequest as NewLoginRequest, LoginResponse } from '@/interfaces/user.interface'

import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { redirectToLogin } from '@/lib/auth'
import { userService } from '@/services/user.service'


const basePostUrl = "https://travel-apap-mock-server.vercel.app/api/auth"

interface loginResponse {
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as CurrentUser | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
    currentUserInfo: (localStorage.getItem('currentUserInfo') 
      ? JSON.parse(localStorage.getItem('currentUserInfo')!) 
      : null) as LoginResponse | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.currentUserInfo,
    userRole: (state) => state.currentUserInfo?.role || null,
  },

  actions: {
    
    async login(payload: NewLoginRequest) {
      this.loading = true

      try {
        const response = await userService.login(payload)

        this.currentUserInfo = response
        // Save to localStorage for persistence across page refreshes
        localStorage.setItem('currentUserInfo', JSON.stringify(response))

        toast.success(response.message || 'Login successful')

        this.error = null
        return response
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Error saat masuk: ${this.error}`)
        throw error
      } finally {
        this.loading = false
      }
    },

    /** ===================================
     *  LOGOUT
     *  =================================== */
    async logout() {
      try {
        this.loading = true

        await userService.logout()

        // Clear store and localStorage
        this.user = null
        this.token = null
        this.currentUserInfo = null
        localStorage.removeItem('currentUserInfo')

        toast.success('Logout successful')
        this.error = null
        
        // Redirect to login
        redirectToLogin()
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Error saat logout: ${this.error}`)
      } finally {
        this.loading = false
      }
    },

    /** ===================================
     *  REFRESH USER INFO
     *  =================================== */
    async refreshUserInfo() {
      if (!this.currentUserInfo?.username) {
        console.warn('No user info to refresh')
        return
      }

      try {
        const userData = await userService.getUserByIdentifier(this.currentUserInfo.username)
        
        // Update current user info with fresh data
        this.currentUserInfo = {
          ...this.currentUserInfo,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          username: userData.username,
          userId: userData.id
        }
        
        // Update localStorage
        localStorage.setItem('currentUserInfo', JSON.stringify(this.currentUserInfo))
      } catch (error: any) {
        console.error('Failed to refresh user info:', error)
        throw error
      }
    },

    /** ===================================
     *  LEGACY LOGIN (for backwards compatibility)
     *  =================================== */
    async legacyLogin(payload: LoginRequest) {
      this.loading = true

      try {
        const response = await axios.post<CommonResponseInterface<loginResponse>>(
          `${basePostUrl}/login`,
          payload
        )

        const respData = response.data.data.token

        this.token = respData

        toast.success(response.data.message || 'Login successful')

        this.error = null
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Error saat masuk: ${this.error}`)
      } finally {
        this.loading = false
      }
    },
  },
})