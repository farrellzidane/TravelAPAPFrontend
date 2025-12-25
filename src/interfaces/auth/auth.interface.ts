import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import type { CurrentUser } from '@/interfaces/auth/profile.interface'

import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'


const basePostUrl = import.meta.env.VITE_API_URL + '/auth'

export interface LoginRequest {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as CurrentUser | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    
    async login(payload: LoginRequest) {
      this.loading = true

      try {
        const response = await axios.post<CommonResponseInterface<{ token: string } & CurrentUser>>(
          `${basePostUrl}/login`,
          payload, {
            withCredentials: true,
          }
        )

        const respData = response.data.data

        this.token = respData.token
        const { token, ...userFields } = respData
        this.user = userFields as CurrentUser

        toast.success(response.data.message || 'Login successful')

        this.error = null
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Error saat masuk: ${this.error}`)
      } finally {
        this.loading = false
      }
    },

    /** ===================================
     *  LOGOUT
     *  =================================== */
    logout() {
      try {
        this.loading = true

        // Clear cookies handled by backend
        // Cookie is httpOnly and will be cleared on next request

        // Clear store
        this.user = null
        this.token = null

        toast.success('Logout successful')
        this.error = null
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Error saat logout: ${this.error}`)
      } finally {
        this.loading = false
      }
    },
  },
})
