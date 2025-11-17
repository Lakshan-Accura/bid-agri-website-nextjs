'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/authStore';
import { useRouter } from 'next/navigation';
import StoreDashboard from '@/app/dashboards/storeDashboard/page';
import FarmerDashboard from '@/app/dashboards/farmerDashboard/page';
import Profile from '@/app/profile/page';
import ProtectedRoute from '@/app/components/protectedRoute';

export default function ProtectedProfileDashboard() {
  const router = useRouter();
  const { isAuthenticated, hasTenantAdminRole, hasFarmerRole, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [userRole, setUserRole] = useState<'store' | 'farmer' | null>(null);

  useEffect(() => {
    // ✅ Check auth once component mounts
    checkAuth();

    // Small delay to simulate check completion
    setTimeout(() => setIsChecking(false), 300);
  }, [checkAuth]);

  useEffect(() => {
    if (!isChecking) {
      if (!isAuthenticated) {
        router.replace('/');
      } else if (hasTenantAdminRole()) {
        setUserRole('store');
      } else if (hasFarmerRole()) {
        setUserRole('farmer');
      } else {
        router.replace('/');
      }
    }
  }, [isChecking, isAuthenticated, hasTenantAdminRole, hasFarmerRole, router]);

  if (isChecking) {
    return (
      <ProtectedRoute>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
</ProtectedRoute>

    );
  }

  // ✅ Render based on user role
  if (userRole === 'store') {
    return (
      <StoreDashboard>
        <Profile />
      </StoreDashboard>
    );
  }

  if (userRole === 'farmer') {
    return (
      <FarmerDashboard>
        <Profile />
      </FarmerDashboard>
    );
  }

  return null;
}
