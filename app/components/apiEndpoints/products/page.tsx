// productEndpoints/productApi.ts
import { tokenUtils, API_BASE_URL } from '../login/login';

// Product Interfaces
export interface product {
    name: String;
    productCategoryDTO: {
        id: number;
    },
    description: String;
    sizeOrVolume: String;
    quantity: number;
    unit: String;
    startPrice: number;
    endPrice: number;
    status: String;
    brandDTO: {
        id: number;
    }
}

export interface ApiResponse<T = any> {
  payloadDto?: T;
  message?: string;
  status?: number;
  success?: boolean;
  resultStatus?: string;
  httpStatus?: string;
  httpCode?: string;
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  size?: number;
  number?: number;
  sort?: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements?: number;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = tokenUtils.getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Lots API endpoints
export const productApi = {
  async getAllProduct(): Promise<ApiResponse<product[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/public/products`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Get product failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get product API call failed:', error);
      throw error;
    }
  },

  // 🧩 GET /product/{id} (get product by ID)
  async getAllProductById(id: number): Promise<ApiResponse<product>> {
    try {
      const response = await fetch(`${API_BASE_URL}/public/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Get product failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get product API call failed:', error);
      throw error;
    }
  },

};