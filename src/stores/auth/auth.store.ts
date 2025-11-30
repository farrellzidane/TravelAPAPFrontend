import type { LoginRequest } from '@/interfaces/auth/auth.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import type { CurrentUser } from '@/interfaces/auth/profile.interface'

import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { clearToken, setToken } from '@/lib/auth'


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
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    
    async login(payload: LoginRequest) {
      this.loading = true

      try {
        const response = await axios.post<CommonResponseInterface<loginResponse>>(
          `${basePostUrl}/login`,
          payload
        )

        const respData = response.data.data.token

        this.token = respData
        setToken(respData);

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

        // Remove cookies
        clearToken();

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