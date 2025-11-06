'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ChangePasswordRedirect: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (token && email) {
      // Store values in sessionStorage for the change-password page
      sessionStorage.setItem('resetToken', token);
      sessionStorage.setItem('resetEmail', email);

      // ✅ Redirect to the actual change-password page
      router.replace('/change-password');
    } else {
      // ❌ Missing data → redirect back to reset email page
      router.replace('/resetPassword/sendResetEmail');
    }
  }, [searchParams, router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      Redirecting...
    </div>
  );
};

export default ChangePasswordRedirect;
