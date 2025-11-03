import pako from "pako";
import { jwtDecode } from "jwt-decode";

// Types
export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  payload?: {
    jwtToken?: string;
  };
  message?: string;
  status?: number;
}

export interface DecodedToken {
  [key: string]: any;
  exp?: number;
  iat?: number;
  sub?: string;
  email?: string;
  roles?: string[];
  permissions?: Array<{ authority: string }>;
}

// Password related interfaces
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  userName: string;
  password: string;
  token: string;
}

export interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface ApiResponse<T = any> {
  payload?: T;
  message?: string;
  status?: number;
  success?: boolean;
  resultStatus?: string;
  httpStatus?: string;
  httpCode?: string;
}

// Registration related interfaces
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  matchingPassword: string;
  tenantDTO: {
    id: number;
  };
  roleDTOs: Array<{
    id: number;
  }>;
}

export interface RegisterResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleDTOs: Array<{
    id: number;
    name: string;
    code: string;
    createdDate: number;
    modifiedDate: number;
  }>;
  createdDate: number;
  modifiedDate: number;
  enabled: boolean;
  tenantDTO: {
    id: number;
    tenantCode: string;
    enabled: boolean;
    tenantName: string;
    tenantApiKey: string;
    isDelete: boolean;
    modifiedDate: number;
    createdBy: string;
    modifiedBy: string;
    createdDate: number;
    multitenancy: boolean;
  };
  admin: boolean;
  active: boolean;
  replaceUser: boolean;
}

export interface VerifyRegistrationResponse {
  message: string | null;
  resultStatus: string;
  httpStatus: string;
  httpCode: string;
  payload: string;
}

// Client-side storage utility
const storageUtils = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Token utility functions
export const tokenUtils = {
  decodeAndStoreToken(jwtToken: string): DecodedToken {
    if (!jwtToken) {
      throw new Error('No JWT token provided');
    }

    try {
      // Store the original compressed token
      storageUtils.setItem("UserjwtToken", jwtToken);

      // Decompress the token
      const compressedData = Uint8Array.from(
        atob(jwtToken),
        (c) => c.charCodeAt(0)
      );
      
      const decompressedData = pako.inflate(compressedData, { to: "string" });
      
      // Decode the JWT token using jwtDecode (named import)
      const decodedToken = jwtDecode<DecodedToken>(decompressedData);
      
      // Store the decoded token
      storageUtils.setItem("decodedToken", JSON.stringify(decodedToken));
      
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      this.clearTokens();
      throw error;
    }
  },

  getStoredToken(): string | null {
    return storageUtils.getItem("UserjwtToken");
  },

  getDecodedToken(): DecodedToken | null {
    const stored = storageUtils.getItem("decodedToken");
    return stored ? JSON.parse(stored) : null;
  },

  clearTokens(): void {
    storageUtils.removeItem("UserjwtToken");
    storageUtils.removeItem("decodedToken");
  },

  isTokenValid(): boolean {
    const token = this.getStoredToken();
    const decodedToken = this.getDecodedToken();
    
    if (!token || !decodedToken) {
      return false;
    }
    
    // Check expiration
    if (decodedToken.exp) {
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    }
    
    // If no expiration, assume valid
    return true;
  },

  // New method to check if user has SUPER_ADMIN role
  hasSuperAdminRole(): boolean {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.roles?.includes('SUPER_ADMIN') || false;
  },

  hasTenantAdminRole(): boolean {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.roles?.includes('TENANT_ADMIN') || false;
  },

  hasFarmerRole(): boolean {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.roles?.includes('SYSTEM_USER') || false;
  }
};

// API endpoints
export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();
      
      // Automatically decode and store the token if present
      if (data?.payload?.jwtToken) {
        tokenUtils.decodeAndStoreToken(data.payload.jwtToken);
      }
      
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      tokenUtils.clearTokens();
      throw error;
    }
  },
};

// Password API endpoints
export const passwordApi = {
  async resetPasswordToken(emailData: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`Forgot password failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Forgot password API call failed:', error);
      throw error;
    }
  },

  async resetPassword(resetData: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/reset/password?token=${resetData.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: resetData.userName,
          password: resetData.password
        }),
      });

      if (!response.ok) {
        throw new Error(`Reset password failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Reset password API call failed:', error);
      throw error;
    }
  },

  async changePassword(changeData: ChangePasswordRequest): Promise<ApiResponse> {
    try {
      const token = tokenUtils.getStoredToken();
      
      const response = await fetch(`${API_BASE_URL}/user/changePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(changeData),
      });

      if (!response.ok) {
        throw new Error(`Change password failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Change password API call failed:', error);
      throw error;
    }
  },
};

// Registration API endpoints
export const registerApi = {
  async farmerRegister(userData: Omit<RegisterRequest, 'tenantDTO' | 'roleDTOs'>): Promise<ApiResponse<RegisterResponse>> {
    try {
      const registerData: RegisterRequest = {
        ...userData,
        tenantDTO: {
          id: 1 // Fixed tenant ID
        },
        roleDTOs: [
          {
            id: 3 // Fixed role ID for SYSTEM_USER (Farmer)
          }
        ]
      };

      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Registration API call failed:', error);
      throw error;
    }
  },
};


// Verify Registration API function
export const verifyRegistration = async (token: string): Promise<VerifyRegistrationResponse> => {
  const response = await fetch(`${API_BASE_URL}/user/verifyRegistration?token=${encodeURIComponent(token)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Verification failed: ${response.status}`);
  }

  return await response.json();
};