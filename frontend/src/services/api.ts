import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, User, Property, Inquiry, PaginatedResponse } from '@/types';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing to avoid parallel refresh calls
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Never retry for auth endpoints — avoids infinite loops and noise
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/refresh-token') ||
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/logout') ||
      originalRequest?.url?.includes('/auth/me');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint &&
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await authService.refreshToken();
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Refresh failed — user session expired or unauthenticated
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const response = await api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/auth/login', data);
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh-token');
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};

export const propertyService = {
  getAllProperties: async (params?: any) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Property>>>('/properties', { params });
    return response.data;
  },

  getPropertyById: async (id: number) => {
    const response = await api.get<ApiResponse<Property>>(`/properties/${id}`);
    return response.data;
  },

  getSimilarProperties: async (id: number) => {
    const response = await api.get<ApiResponse<Property[]>>(`/properties/${id}/similar`);
    return response.data;
  },

  getMyProperties: async (params?: any) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Property>>>('/properties/my', { params });
    return response.data;
  },

  createProperty: async (data: FormData) => {
    const response = await api.post<ApiResponse<Property>>('/properties', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateProperty: async (id: number, data: any) => {
    const response = await api.put<ApiResponse<Property>>(`/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/properties/${id}`);
    return response.data;
  },
};

export const inquiryService = {
  createInquiry: async (propertyId: number, message: string) => {
    const response = await api.post<ApiResponse<Inquiry>>(`/inquiries/property/${propertyId}`, { message });
    return response.data;
  },

  getInquiriesForProperty: async (propertyId: number) => {
    const response = await api.get<ApiResponse<Inquiry[]>>(`/inquiries/property/${propertyId}`);
    return response.data;
  },

  getMyInquiries: async () => {
    const response = await api.get<ApiResponse<Inquiry[]>>('/inquiries/my');
    return response.data;
  },
};

export default api;
