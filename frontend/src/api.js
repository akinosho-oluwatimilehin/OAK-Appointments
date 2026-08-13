import axios from 'axios';

// Since Django serves React on the same origin (http://127.0.0.1:8000), 
// we can use window.location.origin or relative paths cleanly.
export const BASE_URL = window.location.origin;

export const api = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for resolving media image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

// API Methods
export const getStylists = async () => {
  const response = await api.get('stylists/');
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post('appointments/', appointmentData);
  return response.data;
};

export default api;