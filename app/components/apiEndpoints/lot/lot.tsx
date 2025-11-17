// productEndpoints/productApi.ts
import { tokenUtils, API_BASE_URL } from '../login/login';

// Product Category Interfaces
export interface Lot {
    status: string;
    farmerDTO: {
        id: number;
    },
    lotProducts: [
         {
            productDTO: {
                id: number;
            },
            quantity: number;
        }
    ]
    }

export interface ApiResponse<T = any> {
  payload?: T;
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
export const lotsApi = {
  async saveLots(): Promise<ApiResponse<Lot[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/lots`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Get lots failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get lots API call failed:', error);
      throw error;
    }
  },

};