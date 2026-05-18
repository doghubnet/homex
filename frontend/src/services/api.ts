import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:3000/api';
export const MOCKS_ENABLED = import.meta.env.VITE_ENABLE_MOCKS !== 'false';
export const APP_NAME = import.meta.env.VITE_APP_NAME?.trim() || 'Home-X Inventory';

export class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('homex_access_token');
}

export function setAccessToken(token: string) {
  window.localStorage.setItem('homex_access_token', token);
}

export function clearAccessToken() {
  window.localStorage.removeItem('homex_access_token');
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function toApiError(error: unknown): ApiRequestError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const status = axiosError.response?.status;
    const serverMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;

    if (serverMessage) {
      return new ApiRequestError(serverMessage, status);
    }

    if (axiosError.code === 'ECONNABORTED') {
      return new ApiRequestError('The Home-X API request timed out. Please try again.', status);
    }

    if (!axiosError.response) {
      return new ApiRequestError('The Home-X API is unavailable. Demo data can still be used while the backend is offline.', status);
    }

    return new ApiRequestError(`Home-X API request failed with status ${status}.`, status);
  }

  if (error instanceof Error) {
    return new ApiRequestError(error.message);
  }

  return new ApiRequestError('An unexpected Home-X API error occurred.');
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await api.get<T>(url, config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function apiPost<TResponse, TPayload = unknown>(url: string, data?: TPayload, config?: AxiosRequestConfig): Promise<TResponse> {
  try {
    const response = await api.post<TResponse>(url, data, config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function apiPut<TResponse, TPayload = unknown>(url: string, data?: TPayload, config?: AxiosRequestConfig): Promise<TResponse> {
  try {
    const response = await api.put<TResponse>(url, data, config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function apiDelete<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
  try {
    const response = await api.delete<TResponse>(url, config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}
