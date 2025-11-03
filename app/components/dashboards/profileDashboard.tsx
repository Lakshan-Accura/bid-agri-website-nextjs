// protectedProfileDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';
import StoreDashboard from '../dashboards/storeDashboard';
import FarmerDashboard from './farmerDashboard';
import Profile from '../../profile/page';

function ProtectedProfileDashboard() {
  const router = useRouter();
  const { isAuthenticated, hasTenantAdminRole, hasFarmerRole, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication on component mount
    if (typeof window !== 'undefined') {
      checkAuth();
      setIsChecking(false);
    }
  }, [checkAuth]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.replace('/');
    return null;
  }

  // Render appropriate dashboard based on role
  if (hasTenantAdminRole()) {
    return (
      <StoreDashboard>
        <Profile />
      </StoreDashboard>
    );
  }

  if (hasFarmerRole()) {
    return (
      <FarmerDashboard>
        <Profile />
      </FarmerDashboard>
    );
  }

  // If user doesn't have required roles, redirect to home
  router.replace('/');
  return null;
}

export default ProtectedProfileDashboard;