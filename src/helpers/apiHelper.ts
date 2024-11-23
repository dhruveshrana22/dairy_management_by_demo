import { siteConfig } from '@/config/siteconfig';
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// Define types for the response from the API
interface ApiResponse<T> {
  status: boolean;
  data?: T;
  message?: string;
}

// Axios instance with CORS support
const axiosInstance = axios.create({
  baseURL: siteConfig.apiUrl, // Use the base URL from your siteConfig
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global Error Handler
const handleError = (error: AxiosError): ApiResponse<undefined> => {
  if (error?.response) {
    // Server responded with a status other than 2xx
    console.log(
      `API Error: ${error.response.data?.message || error.response.statusText || 'Unknown error'}`,
    );
    return {
      status: false,
      message: error?.response.data?.message || 'An error occurred on the server',
    };
  } else if (error?.request) {
    // No response received from the server
    console.log('No response received:', error.request);
    return { status: false, message: 'No response from server' };
  } else if (error?.code === 'ECONNABORTED' || error?.code === 'ENOTFOUND') {
    // Network error (e.g., offline or DNS issues)
    console.log('Network Error:', error.message);
    return { status: false, message: 'Network issue. Please check your connection' };
  } else {
    // Something happened in setting up the request
    console.log('Request Error:', error.message);
    return { status: false, message: error.message || 'Request setup error' };
  }
};

// Axios request interceptor for adding additional headers (optional)
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Example of adding token if available
    const token = localStorage.getItem('token'); // Or get it from Redux, etc.
    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error), // Pass the error for handling in catch blocks
);

// General function to make any API request (GET, POST, PUT, DELETE)
const getApiData = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  endpoint: string,
  data: object = {},
): Promise<ApiResponse<T>> => {
  try {
    if (!endpoint) {
      throw new Error('Endpoint is required');
    }

    let response: AxiosResponse<T>;

    switch (method.toLowerCase()) {
      case 'get':
        response = await axiosInstance.get<T>(endpoint);
        break;
      case 'post':
        response = await axiosInstance.post<T>(endpoint, data);
        break;
      case 'put':
        response = await axiosInstance.put<T>(endpoint, data);
        break;
      case 'delete':
        response = await axiosInstance.delete<T>(endpoint);
        break;
      default:
        throw new Error('Invalid method type. Use GET, POST, PUT, or DELETE.');
    }

    // Return the response data
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    // Pass error handling to the centralized handler
    return handleError(error as AxiosError);
  }
};

export { getApiData };
