import type { UserProfile, UserProfileRequest, UserRoleType } from '@/interfaces/auth/profile.interface'
import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import { useRouter } from 'vue-router'
import api from '@/lib/safe.api'

const baseUserProfileUrl = import.meta.env.VITE_API_URL + '/profile'

export const useUserProfileStore = defineStore('userProfile', {
  state: () => ({
    profiles: [] as UserProfile[],
    loading: false,
    error: null as null | string,
  }),
  actions: {
    async fetchProfiles( role? : UserRoleType ) : Promise<UserProfile[] | undefined> {
      this.loading = true
      this.error = null

      try {
        const allProfilesUrl = role ? `${baseUserProfileUrl}?role=${encodeURIComponent(role)}` : baseUserProfileUrl;
        const response = await axios.get<CommonResponseInterface<UserProfile[]>>(allProfilesUrl)
        this.profiles = response.data.data
        if (this.profiles.length === 0) {
          toast.warning('Data profil kosong')
        } else {
          toast.success('Data profil berhasil dimuat')
        }
        return response.data.data
      } catch (error) {
        toast.error(`Error saat memuat profil: ${this.error}`)
      } finally {
        this.loading = false
      }
    },

    async getProfileById(profileId: string) {
      this.loading = true
      this.error = null
      const router = useRouter()

      try {
        const response = await axios.get<CommonResponseInterface<UserProfile>>(`${baseUserProfileUrl}/${profileId}`)
        return response.data.data
      } catch (error) {
        
        toast.error(`Error saat memuat profil: ${this.error}`)
        return null
      } finally {
        this.loading = false
      }
    },

    async createProfile(profileData: UserProfileRequest) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post<CommonResponseInterface<UserProfile>>(
          `${baseUserProfileUrl}/create`,
          profileData,
        )
        if (response.status === 201) {
          this.profiles.push(response.data.data)
          toast.success('Profil berhasil dibuat')
          return response.data.data
        } else if (response.status === 400) {
          toast.warning(
            'Gagal membuat profil: Data tidak valid atau ada kesalahan pada permintaan.',
          )
        }
      } catch (error) {
    
        toast.error(`Error saat membuat profil: ${error}`)
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData: UserProfileRequest) {
      this.loading = true
      this.error = null
      const router = useRouter()

      try {
        console.log('DATA DIKIRIM:', profileData)
        const response = await axios.put<CommonResponseInterface<UserProfile>>(
          `${baseUserProfileUrl}/update`,
          profileData
        )

        if (response.status === 200) {
          toast.success('Profil berhasil diperbarui')
          return response.data.data
        } else if (response.status === 400) {
          toast.warning(
            'Gagal memperbarui profil: Data tidak valid atau ada kesalahan pada permintaan.',
          )
        } else if (response.status === 404) {
          toast.warning('Profil tidak ditemukan: Data profil yang akan diperbarui tidak ditemukan.')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Error saat memperbarui profil: ${this.error}`)
      } finally {
        this.loading = false
      }
    },
    async deleteProfile(profileId: string) {
      this.loading = true
      this.error = null
      const router = useRouter()

      try {
        const response = await axios.delete<CommonResponseInterface<UserProfile>>(
          `${baseUserProfileUrl}/delete/${profileId}`,
        )
        if (response.status === 200) {
          await this.fetchProfiles()
          toast.success('Profil berhasil dihapus: Data profil telah berhasil dihapus.')
        } else if (response.status === 404) {
          toast.warning('Profil tidak ditemukan: Data profil yang akan dihapus tidak ditemukan.')
        }
      } catch (error) {

        this.error = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Error saat menghapus profil: ${this.error}`)
      } finally {
        this.loading = false
      }
    },
    async fetchCustomers(filters?: { search?: string }) {
      this.loading = true
      this.error = null
      const router = useRouter()

      try {
        const params = new URLSearchParams()
        if (filters?.search) params.append('search', filters.search)

        const url = `${baseUserProfileUrl}/customers?${params.toString()}`

        const response = await axios.get<CommonResponseInterface<UserProfile[]>>(url)

        console.log('REQUEST:', url)
        this.profiles = response.data.data

        toast.success('Data customers berhasil dimuat!')

        return response.data.data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {

          if (error.response.status === 403) {
            toast.error('Anda tidak memiliki akses untuk melihat data customers.')
            return
          }
        }

        this.error = error instanceof Error ? error.message : 'Unknown error'
        toast.error(`Error saat memuat customers: ${this.error}`)
      } finally {
        this.loading = false
      }
    },
  },
})
