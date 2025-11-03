'use client';

import ProtectedRoute from '@/app/components/protectedRoute';
import StoreDashboard from '../storeDashboard/page';

export default function StoreDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles="farmer">
      <StoreDashboard>{children}</StoreDashboard>
    </ProtectedRoute>
  );
}
