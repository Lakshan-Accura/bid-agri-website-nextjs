// productEndpoints/productApi.ts
import { tokenUtils, API_BASE_URL } from '../login/login';

// Product Category Interfaces
export interface ProductCategory {
    id: number;
    name: string
    description: string;
    imageUrl: string;
    parentId: null | number;
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

// Lots API endpoints
export const productCategoriesApi = {
  async getAllProductCategories(): Promise<ApiResponse<ProductCategory[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/public/product-categories`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Get product categories failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get product categories API call failed:', error);
      throw error;
    }
  },

  // 🧩 GET /product-category/{id} (get product category by ID)
  async getAllProductCategoriesById(id: number): Promise<ApiResponse<ProductCategory>> {
    try {
      const response = await fetch(`${API_BASE_URL}/public/product-categories/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Get product categories failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get product categories API call failed:', error);
      throw error;
    }
  },

};