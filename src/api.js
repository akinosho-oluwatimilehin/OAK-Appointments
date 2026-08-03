// src/api.js
import axios from 'axios';

// Base URL pointing to your local Django server
export const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to resolve media image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-avatar.png'; // Fallback if no image uploaded
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

// API Endpoints
export const getStylists = async () => {
  const response = await api.get('stylists/');
  return response.data;
};

export const getHairstyles = async () => {
  const response = await api.get('hairstyles/');
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post('appointments/', appointmentData);
  return response.data;
};

export default api;