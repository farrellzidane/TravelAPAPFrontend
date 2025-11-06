import type { Property, Province, CreatePropertyRequest, ApiResponse } from '@/interfaces/property.interface'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/'
const WILAYAH_API = 'https://www.emsifa.com/api-wilayah-indonesia/api'

export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/property`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse<Property[]> = await response.json()
      
      // Return data dari response wrapper
      return result.data || []
    } catch (error) {
      console.error('Error in getAllProperties:', error)
      throw error
    }
  },

  async getPropertyById(id: string): Promise<Property> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/property/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse<Property> = await response.json()
      return result.data
    } catch (error) {
      console.error('Error in getPropertyById:', error)
      throw error
    }
  },

  async createProperty(data: CreatePropertyRequest): Promise<Property> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/property/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse<Property> = await response.json()
      return result.data
    } catch (error) {
      console.error('Error in createProperty:', error)
      throw error
    }
  },

  async getProvinces(): Promise<Province[]> {
    try {
      const response = await fetch(`${WILAYAH_API}/provinces.json`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch provinces')
      }
      
      const data = await response.json()
      return data.map((province: { id: string; name: string }) => ({
        code: province.id,
        name: province.name
      }))
    } catch (error) {
      console.error('Error fetching provinces:', error)
      // Return fallback data if API fails
      return [
        { code: '11', name: 'Aceh' },
        { code: '12', name: 'Sumatera Utara' },
        { code: '13', name: 'Sumatera Barat' },
        { code: '14', name: 'Riau' },
        { code: '15', name: 'Jambi' },
        { code: '16', name: 'Sumatera Selatan' },
        { code: '17', name: 'Bengkulu' },
        { code: '18', name: 'Lampung' },
        { code: '19', name: 'Kepulauan Bangka Belitung' },
        { code: '21', name: 'Kepulauan Riau' },
        { code: '31', name: 'DKI Jakarta' },
        { code: '32', name: 'Jawa Barat' },
        { code: '33', name: 'Jawa Tengah' },
        { code: '34', name: 'DI Yogyakarta' },
        { code: '35', name: 'Jawa Timur' },
        { code: '36', name: 'Banten' },
        { code: '51', name: 'Bali' },
        { code: '52', name: 'Nusa Tenggara Barat' },
        { code: '53', name: 'Nusa Tenggara Timur' },
        { code: '61', name: 'Kalimantan Barat' },
        { code: '62', name: 'Kalimantan Tengah' },
        { code: '63', name: 'Kalimantan Selatan' },
        { code: '64', name: 'Kalimantan Timur' },
        { code: '65', name: 'Kalimantan Utara' },
        { code: '71', name: 'Sulawesi Utara' },
        { code: '72', name: 'Sulawesi Tengah' },
        { code: '73', name: 'Sulawesi Selatan' },
        { code: '74', name: 'Sulawesi Tenggara' },
        { code: '75', name: 'Gorontalo' },
        { code: '76', name: 'Sulawesi Barat' },
        { code: '81', name: 'Maluku' },
        { code: '82', name: 'Maluku Utara' },
        { code: '91', name: 'Papua' },
        { code: '92', name: 'Papua Barat' },
      ]
    }
  },

  async deleteProperty(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/property/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error in deleteProperty:', error)
      throw error
    }
  }
}