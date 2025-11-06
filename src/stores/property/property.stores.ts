import type { Property, PropertyFilter, CreatePropertyRequest } from '@/interfaces/property.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from "axios";
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface PropertyState {
  properties: Property[]
  currentProperty: Property | null
  filters: PropertyFilter
  loading: boolean
  error: string | null
}

export const usePropertyStore = defineStore('property', {
  state: (): PropertyState => ({
    properties: [],
    currentProperty: null,
    filters: {
      search: '',
      type: '',
      status: ''
    },
    loading: false,
    error: null
  }),

  getters: {
    // Filter properties berdasarkan filter yang aktif
    filteredProperties: (state): Property[] => {
      let result = [...state.properties]

      // Filter by search
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        result = result.filter(p =>
          p.propertyName.toLowerCase().includes(searchLower) ||
          p.propertyID?.toLowerCase().includes(searchLower)
        )
      }

      // Filter by type
      if (state.filters.type) {
        result = result.filter(p => p.typeName === state.filters.type)
      }

      // Filter by status
      if (state.filters.status) {
        result = result.filter(p => p.activeStatusName === state.filters.status)
      }

      // Sort by updatedDate (newest first)
      result.sort((a, b) => {
        const dateA = new Date(a.updatedDate || a.createdDate).getTime()
        const dateB = new Date(b.updatedDate || b.createdDate).getTime()
        return dateB - dateA
      })

      return result
    },

    // Get total properties count
    totalProperties: (state): number => state.properties.length,

    // Get active properties count
    activeProperties: (state): number => 
      state.properties.filter(p => p.activeStatusName === 'Active').length,

    // Get property by ID
    getPropertyById: (state) => (id: string): Property | undefined => 
      state.properties.find(p => p.propertyID === id)
  },

  actions: {
    // Fetch all properties
    async fetchAllProperties(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<Property[]>> = 
          await axios.get(`${API_BASE_URL}/api/property`)

        if (response.data.status === 200 && response.data.data) {
          this.properties = response.data.data
          
          if (this.properties.length > 0) {
            toast.success(`${this.properties.length} properties loaded successfully`)
          } else {
            toast.info('No properties found')
          }
        } else {
          throw new Error(response.data.message || 'Failed to fetch properties')
        }
      } catch (error: any) {
        console.error('Error fetching properties:', error)
        this.error = error.message || 'Failed to load properties'
        toast.error('Failed to load properties')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Fetch property by ID
    async fetchPropertyById(id: string): Promise<Property> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<Property>> = 
          await axios.get(`${API_BASE_URL}/api/property/view/${id}`)

        if (response.data.status === 200 && response.data.data) {
          this.currentProperty = response.data.data
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Property not found')
        }
      } catch (error: any) {
        console.error('Error fetching property:', error)
        this.error = error.message || 'Failed to load property'
        toast.error('Failed to load property details')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Create new property
    async createProperty(data: CreatePropertyRequest): Promise<Property> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<Property>> = 
          await axios.post(`${API_BASE_URL}/api/property/create`, data)

        if (response.data.status === 200 && response.data.data) {
          // Add new property to store
          this.properties.unshift(response.data.data)
          
          toast.success('Property created successfully!')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to create property')
        }
      } catch (error: any) {
        console.error('Error creating property:', error)
        
        // Handle validation errors from backend
        if (error.response?.data?.message) {
          this.error = error.response.data.message
          toast.error(error.response.data.message)
        } else {
          this.error = error.message || 'Failed to create property'
          toast.error('Failed to create property')
        }
        
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update property
    async updateProperty(id: string, data: Partial<CreatePropertyRequest>): Promise<Property> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<Property>> = 
          await axios.put(`${API_BASE_URL}/api/property/update/${id}`, data)

        if (response.data.status === 200 && response.data.data) {
          // Update property in store
          const index = this.properties.findIndex(p => p.propertyID === id)
          if (index !== -1) {
            this.properties[index] = response.data.data
          }
          
          this.currentProperty = response.data.data
          
          toast.success('Property updated successfully!')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to update property')
        }
      } catch (error: any) {
        console.error('Error updating property:', error)
        this.error = error.message || 'Failed to update property'
        toast.error('Failed to update property')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete property
    async deleteProperty(id: string): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response: AxiosResponse<CommonResponseInterface<null>> = 
          await axios.delete(`${API_BASE_URL}/api/property/delete/${id}`)

        if (response.data.status === 200) {
          // Remove property from store
          this.properties = this.properties.filter(p => p.propertyID !== id)
          
          toast.success('Property deleted successfully!')
        } else {
          throw new Error(response.data.message || 'Failed to delete property')
        }
      } catch (error: any) {
        console.error('Error deleting property:', error)
        this.error = error.message || 'Failed to delete property'
        toast.error('Failed to delete property')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update filters
    updateFilters(filters: Partial<PropertyFilter>): void {
      this.filters = { ...this.filters, ...filters }
    },

    // Reset filters
    resetFilters(): void {
      this.filters = {
        search: '',
        type: '',
        status: ''
      }
    },

    // Clear error
    clearError(): void {
      this.error = null
    },

    // Reset store
    resetStore(): void {
      this.properties = []
      this.currentProperty = null
      this.filters = {
        search: '',
        type: '',
        status: ''
      }
      this.loading = false
      this.error = null
    }
  }
})