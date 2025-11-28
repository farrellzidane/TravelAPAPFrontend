import axios, { type AxiosResponse } from 'axios'
import type { Property, Province, CreatePropertyRequest, ApiResponse, DateFilter, UpdatePropertyRequest } from '@/interfaces/property.interface'
import type { AddRoomTypeRequest } from '@/interfaces/room.interface'
import api from '@/lib/safe.api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const WILAYAH_API = 'https://www.emsifa.com/api-wilayah-indonesia/api'

export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    try {
      const response: AxiosResponse<ApiResponse<Property[]>> = 
        await api.get(`${API_BASE_URL}/api/property`)
      
      return response.data.data || []
    } catch (error) {
      console.error('Error in getAllProperties:', error)
      throw error
    }
  },

  async getPropertyById(id: string, filter?: DateFilter): Promise<Property> {
    try {
      let url = `${API_BASE_URL}/api/property/${id}`
      
      // Add query params if filter is provided
      if (filter?.checkIn && filter?.checkOut) {
        const params = new URLSearchParams({
          checkIn: filter.checkIn,
          checkOut: filter.checkOut
        })
        url += `?${params.toString()}`
      }
      
      console.log('Fetching property detail from:', url)
      
      const response: AxiosResponse<ApiResponse<Property>> = 
        await api.get(url)
      
      console.log('Property detail response:', response.data)
      
      return response.data.data
    } catch (error) {
      console.error('Error in getPropertyById:', error)
      throw error
    }
  },

  async createProperty(data: CreatePropertyRequest): Promise<Property> {
    try {
      console.log('Creating property with data:', data)
      
      const response: AxiosResponse<ApiResponse<Property>> = 
        await api.post(`${API_BASE_URL}/api/property/create`, data)
      
      console.log('Create property response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in createProperty:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async updateProperty(id: string, data: UpdatePropertyRequest): Promise<Property> {
    try {
      console.log('Updating property with data:', data)
      
      const response: AxiosResponse<ApiResponse<Property>> = 
        await api.put(`${API_BASE_URL}/api/property/update/${id}`, data)
      
      console.log('Update property response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in updateProperty:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async deleteProperty(id: string): Promise<Property> {
    try {
      console.log('Deleting property:', id)
      
      const response: AxiosResponse<ApiResponse<Property>> = 
        await api.delete(`${API_BASE_URL}/api/property/delete/${id}`)
      
      console.log('Delete property response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in deleteProperty:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async addRoomTypes(propertyId: string, data: AddRoomTypeRequest): Promise<Property> {
    try {
      console.log('Adding room types to property:', propertyId, data)
      
      const response: AxiosResponse<ApiResponse<Property>> = 
        await api.post(`${API_BASE_URL}/api/property/updateroom`, data)
      
      console.log('Add room types response:', response.data)
      
      return response.data.data
    } catch (error: any) {
      console.error('Error in addRoomTypes:', error)
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  },

  async getProvinces(): Promise<Province[]> {
    try {
      const response = await api.get(`${WILAYAH_API}/provinces.json`)
      
      return response.data.map((province: { id: string; name: string }) => ({
        code: province.id,
        name: province.name
      }))
    } catch (error) {
      console.error('Error fetching provinces:', error)
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
  }
}