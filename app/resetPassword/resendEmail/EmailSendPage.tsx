'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Result, 
  Button, 
  Typography, 
  Space, 
  Alert
} from 'antd';
import { 
  CheckCircleOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

const { Text } = Typography;

const EmailSendPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  
  // Get Zustand state and actions
  const { 
    pendingVerificationEmail, 
    pendingUserType,
    lastResendTime,
    setLastResendTime,
    clearRegistrationData,
    getVerificationLoginRoute
  } = useAuthStore();

  // Get email from Zustand store or URL parameters
  const [userEmail, setUserEmail] = useState<string>('');
  const [userType, setUserType] = useState<'farmer' | 'store'>('farmer');

  useEffect(() => {
    if (pendingVerificationEmail) {
      setUserEmail(pendingVerificationEmail);
      console.log('📧 Email retrieved from Zustand store:', pendingVerificationEmail);
    } else {
      const paramEmail = searchParams.get('email');
      if (paramEmail) {
        setUserEmail(paramEmail);
      }
    }
    
    if (pendingUserType) {
      setUserType(pendingUserType);
    } else {
      const paramType = searchParams.get('type');
      if (paramType === 'store') {
        setUserType('store');
      }
    }
  }, [pendingVerificationEmail, pendingUserType, searchParams]);

  // Actual API call for resending verification email
  const handleResendVerification = async () => {
    if (!userEmail) {
      setResendError('No email address found. Please sign up again.');
      return;
    }

    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const response = await fetch(
        `${API_BASE_URL}/user/resendVerifyToken?email=${encodeURIComponent(userEmail)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to resend verification email. Please try again.');
      }

      const data = await response.json();
      console.log('📩 Resend response:', data);

      if (data.isSuccess || data.success || data.status === 'OK' || data.resultStatus === "SUCCESSFUL") {
        setResendSuccess(true);
        setLastResendTime(Date.now());
      } else {
        throw new Error(data.message || 'Failed to resend verification email.');
      }
    } catch (error: any) {
      console.error('❌ Resend error:', error);
      setResendError(error.message || 'An error occurred while resending email.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    const loginRoute = getVerificationLoginRoute();
    router.push(loginRoute);
  };

  const handleCreateNewAccount = () => {
    clearRegistrationData();
    const signupRoute = userType === 'store' ? '/logins/storeSignup' : '/logins/farmerSignup';
    router.push(signupRoute);
  };

  const getSuccessTitle = () => {
    if (userType === 'store') {
      return 'Store Account Created Successfully!';
    } else {
      return 'Farmer Account Created Successfully!';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1f7a3d 0%, #2d8c4d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          maxWidth: 600, 
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: 'none',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title={getSuccessTitle()}
          subTitle={`A verification email has been sent to ${userEmail}`}
          extra={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              {/* First row: two buttons side by side */}
              <Space>
                <Button
                  key="resend"
                  type="primary"
                  icon={<ReloadOutlined />}
                  loading={isResending}
                  onClick={handleResendVerification}
                  style={{
                    backgroundColor: '#389e0d',
                    borderColor: '#389e0d',
                  }}
                >
                  Resend Verification Email
                </Button>

                <Button key="login" onClick={handleBackToLogin}>
                  Go to Login
                </Button>
              </Space>
            </div>
          }
        />

        {/* Resend Status Alerts */}
        {resendSuccess && (
          <Alert
            message="Verification email sent successfully!"
            description="Please check your inbox for the new verification link."
            type="success"
            showIcon
            style={{ marginTop: 24 }}
          />
        )}

        {resendError && (
          <Alert
            message="Failed to send email"
            description={resendError}
            type="error"
            showIcon
            style={{ marginTop: 24 }}
          />
        )}

        <Alert
          message="Email Verification Required"
          description={
            <div>
              <p>You must verify your email address before you can login.</p>
              <p>If you didn't receive the email:</p>
              <ul>
                <li>Check spam or junk folder</li>
                <li>Verify the email address is correct: <strong>{userEmail}</strong></li>
                <li>Click "Resend Verification Email" above</li>
                <li>The verification link expires in 24 hours</li>
              </ul>
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: 24 }}
        />
      </Card>
    </div>
  );
};

export default EmailSendPage;