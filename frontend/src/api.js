import axios from 'axios'

export const BASE_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${BASE_URL}${imagePath}`
}

export const getStylists = async () => {
  const response = await api.get('stylists/')
  return response.data
}

export const createAppointment = async (appointmentData) => {
  const response = await api.post('appointments/', appointmentData)
  return response.data
}

export default api
