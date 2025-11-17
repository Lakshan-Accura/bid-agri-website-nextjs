'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '../components/protectedRoute';

const ChangePasswordRedirect: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (token && email) {
      sessionStorage.setItem('resetToken', token);
      sessionStorage.setItem('resetEmail', email);
      router.push('/resetPasswordForm');
    } else {
      router.push('/resetPassword/sendResetEmail');
    }
  }, [searchParams, router]);

  return (
    <ProtectedRoute>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      Redirecting...
    </div>
    </ProtectedRoute>
  );
};

export default ChangePasswordRedirect;
