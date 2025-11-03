// stores/authStore.tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { tokenUtils, authApi } from '../components/apiEndpoints/login';

interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

interface AuthState {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Registration state (new)
  pendingVerificationEmail: string | null;
  pendingUserType: 'farmer' | 'store' | null;
  lastResendTime: number | null;
  
  // Authentication Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  setLoading: (loading: boolean) => void;
  hasTenantAdminRole: () => boolean;
  hasFarmerRole: () => boolean;
  hasRole: (roles: string | string[]) => boolean;
  getLoginRedirect: () => string;
  getDashboardRoute: () => string;
  
  // Registration Actions (new)
  setRegistrationData: (email: string, userType: 'farmer' | 'store') => void;
  clearRegistrationData: () => void;
  setLastResendTime: (timestamp: number) => void;
  clearLastResendTime: () => void;
  getVerificationLoginRoute: () => string;
}

// Custom storage object for Next.js compatibility
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      pendingVerificationEmail: null,
      pendingUserType: null,
      lastResendTime: null,

      // Login action with role validation
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({
            userName: email,
            password: password
          });
          
          const decodedToken = tokenUtils.getDecodedToken();
          
          if (decodedToken) {
            // Check if user has allowed roles (TENANT_ADMIN or SYSTEM_USER)
            const hasTenantAdmin = decodedToken.roles?.includes('TENANT_ADMIN') || decodedToken.roles?.includes('ROLE_TENANT_ADMIN');
            const hasFarmer = decodedToken.roles?.includes('SYSTEM_USER') || decodedToken.roles?.includes('ROLE_SYSTEM_USER');
            
            if (!hasTenantAdmin && !hasFarmer) {
              // Clear tokens and throw error if user doesn't have allowed roles
              tokenUtils.clearTokens();
              set({ 
                isLoading: false,
                user: null,
                isAuthenticated: false
              });
              throw new Error('Access denied. Only users with TENANT_ADMIN or SYSTEM_USER roles are allowed to login.');
            }

            set({
              user: {
                id: decodedToken.sub,
                email: decodedToken.email || decodedToken.sub,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                roles: decodedToken.roles,
              },
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ 
            isLoading: false,
            user: null,
            isAuthenticated: false
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        tokenUtils.clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // Check authentication status with role validation
      checkAuth: () => {
        set({ isLoading: true });
        
        const isValid = tokenUtils.isTokenValid();
        const decodedToken = tokenUtils.getDecodedToken();
        
        if (isValid && decodedToken) {
          // Check if user has allowed roles
          const hasTenantAdmin = decodedToken.roles?.includes('TENANT_ADMIN') || decodedToken.roles?.includes('ROLE_TENANT_ADMIN');
          const hasFarmer = decodedToken.roles?.includes('SYSTEM_USER') || decodedToken.roles?.includes('ROLE_SYSTEM_USER');
          
          if (hasTenantAdmin || hasFarmer) {
            set({
              user: {
                id: decodedToken.sub,
                email: decodedToken.email || decodedToken.sub,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                roles: decodedToken.roles,
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Clear tokens and logout if user doesn't have allowed roles
            tokenUtils.clearTokens();
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Check if current user has TENANT_ADMIN role
      hasTenantAdminRole: () => {
        const { user } = get();
        return user?.roles?.includes('TENANT_ADMIN') || user?.roles?.includes('ROLE_TENANT_ADMIN') || false;
      },

      // Check if current user has FARMER role
      hasFarmerRole: () => {
        const { user } = get();
        return user?.roles?.includes('SYSTEM_USER') || user?.roles?.includes('ROLE_SYSTEM_USER') || false;
      },

      // Check if user has specific role(s)
      hasRole: (roles: string | string[]) => {
        const { user } = get();
        const roleArray = Array.isArray(roles) ? roles : [roles];
        
        return roleArray.some(role => 
          user?.roles?.includes(role) || 
          user?.roles?.includes(`ROLE_${role}`)
        );
      },

      // Get appropriate login redirect based on user role
      getLoginRedirect: () => {
        const { user } = get();
        if (user?.roles?.includes('TENANT_ADMIN') || user?.roles?.includes('ROLE_TENANT_ADMIN')) {
          return `logins/storeLogin`;
        } else if (user?.roles?.includes('SYSTEM_USER') || user?.roles?.includes('ROLE_SYSTEM_USER')) {
          return `/logins/farmerLogin`;
        }
        return '/';
      },

      // Get appropriate dashboard route based on user role
      getDashboardRoute: () => {
        const { user } = get();
        if (user?.roles?.includes('TENANT_ADMIN') || user?.roles?.includes('ROLE_TENANT_ADMIN')) {
          return `dashboards/storeDashboard`;
        } else if (user?.roles?.includes('SYSTEM_USER') || user?.roles?.includes('ROLE_SYSTEM_USER')) {
          return `/dashboards/farmerDashboard`;
        }
        return '/';
      },

      // ✅ NEW: Registration Actions

      // Set registration data after successful signup
      setRegistrationData: (email: string, userType: 'farmer' | 'store') => {
        set({ 
          pendingVerificationEmail: email, 
          pendingUserType: userType 
        });
      },

      // Clear registration data
      clearRegistrationData: () => {
        set({ 
          pendingVerificationEmail: null, 
          pendingUserType: null 
        });
      },

      // Set last resend time for cooldown
      setLastResendTime: (timestamp: number) => {
        set({ lastResendTime: timestamp });
      },

      // Clear last resend time
      clearLastResendTime: () => {
        set({ lastResendTime: null });
      },

      // ✅ NEW: Get login route for verification page (doesn't require authentication)
      getVerificationLoginRoute: () => {
        const { pendingUserType } = get();
        return pendingUserType === 'store' ? `logins/storeLogin` : `/logins/farmerLogin`;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        pendingVerificationEmail: state.pendingVerificationEmail,
        pendingUserType: state.pendingUserType,
        lastResendTime: state.lastResendTime,
      }),
    }
  )
);