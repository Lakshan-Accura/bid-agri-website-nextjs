'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRouter, usePathname } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const {
    isAuthenticated,
    isLoading,
    checkAuth,
    hasRole,
    hasTenantAdminRole,
    hasFarmerRole,
  } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Get dashboard route based on roles
  const getDashboardRoute = () => {
    if (hasTenantAdminRole()) return '/storeDashboard';
    if (hasFarmerRole()) return '/farmerDashboard';
    return '/';
  };

  // ✅ Run auth check on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkAuth();
      setIsChecking(false);
    }
  }, [checkAuth]);

  // ✅ Handle redirects after auth state is known
  useEffect(() => {
    if (isChecking || isLoading) return; // Wait for auth check

    // ❌ Not authenticated → go to login
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    // 🔄 Redirect from root path to dashboard if logged in
    if (pathname === '/') {
      const dashboardRoute = getDashboardRoute();
      if (dashboardRoute !== pathname) {
        router.replace(dashboardRoute);
      }
      return;
    }

    // ❌ Role mismatch → redirect to dashboard
    if (requiredRoles && !hasRole(requiredRoles)) {
      const dashboardRoute = getDashboardRoute();
      if (dashboardRoute !== pathname) {
        router.replace(dashboardRoute);
      }
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    isChecking,
    requiredRoles,
    hasRole,
    router,
    pathname,
    hasTenantAdminRole,
    hasFarmerRole,
  ]);

  // 🌀 Show loading spinner while auth check is in progress
  if (isChecking || isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Checking authentication...</div>
      </div>
    );
  }

  // 🚫 Access denied screen for role mismatch
  if (requiredRoles && !hasRole(requiredRoles)) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Access Denied. You don't have permission to view this page.</div>
      </div>
    );
  }

  // ✅ Authenticated + authorized → render children
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;