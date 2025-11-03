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
      // Store in sessionStorage to pass to ResetPasswordForm
      sessionStorage.setItem('resetToken', token);
      sessionStorage.setItem('resetEmail', email);
      
      // Redirect to reset-password
      router.push('/resetPassword/resetPasswordForm');
    } else {
      // If no parameters, redirect to forgot-password
      router.push('/resetPassword/sendResetEmail');
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