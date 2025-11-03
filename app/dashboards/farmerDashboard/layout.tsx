'use client';

import ProtectedRoute from '@/app/components/protectedRoute';
import FarmerDashboard from '../farmerDashboard/page';

export default function FarmerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles="farmer">
      <FarmerDashboard>{children}</FarmerDashboard>
    </ProtectedRoute>
  );
}
