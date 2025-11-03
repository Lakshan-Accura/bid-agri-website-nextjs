'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Alert, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, TruckOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, tokenUtils, type LoginRequest } from '../../components/apiEndpoints/login';
import MainLayout from '../../components/mainLayout/page';
import backgroundImage from '../../../public/background.jpg';
import "./farmerLogin.css"

const { Title, Text } = Typography;

const FarmerLogin: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Prevent scrolling when component mounts
  useEffect(() => {
    // Add class to body to prevent scrolling
    document.body.classList.add('farmer-login-active');
    
    return () => {
      // Remove class when component unmounts
      document.body.classList.remove('farmer-login-active');
    };
  }, []);

  const hasFarmerAccess = (): boolean => {
    return tokenUtils.hasFarmerRole();
  };

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    setErrorMessage('');

    try {
      console.log('Farmer login attempt:', values);
      
      const response = await authApi.login(values);
      console.log('Login response received:', response);

      if (response.payload?.jwtToken) {
        console.log('JWT Token received and stored by tokenUtils');
        
        if (!hasFarmerAccess()) {
          const decodedToken = tokenUtils.getDecodedToken();
          const userRoles = decodedToken?.roles?.join(', ') || 'No roles assigned';
          tokenUtils.clearTokens();
          throw new Error(`Access denied. Your role(s): ${userRoles}. Only SYSTEM_USER can access the farmer dashboard.`);
        }

        localStorage.setItem('userName', values.userName);
        
        console.log('Login successful, redirecting to farmer dashboard');
        message.success('Login successful! Redirecting to farmer dashboard...');
        
        setTimeout(() => {
          router.push('/dashboards/farmerDashboard');
        }, 1500);
      } else {
        // Handle API error responses
        const errorMsg = response.message || 'Invalid email/username or password. Please check your credentials.';
        throw new Error(errorMsg);
      }

    } catch (error: any) {
      console.error('Login error details:', error);
      
      // Enhanced error message extraction
      let userFriendlyError = 'Invalid email/username or password. Please check your credentials and try again.';
      
      // Check for HTTP status codes
      if (error.status === 401 || error.code === 401 || error.response?.status === 401) {
        userFriendlyError = 'Invalid email/username or password. Please check your credentials and try again.';
      }
      // Check for API response message
      else if (error.message) {
        userFriendlyError = error.message;
      }
      // Check for axios-like error response
      else if (error.response?.data?.message) {
        userFriendlyError = error.response.data.message;
      }
      // Check for fetch-like error response
      else if (error.data?.message) {
        userFriendlyError = error.data.message;
      }
      // Check for network errors
      else if (error.message?.includes('Network Error') || error.message?.includes('network')) {
        userFriendlyError = 'Network error. Please check your internet connection and try again.';
      }

      setErrorMessage(userFriendlyError);
      message.error(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Store user type for redirect after password reset
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userType', 'farmer');
    }
    router.push('/resetPassword/sendResetEmail');
  };

  return (
    <MainLayout>
      {/* Background Image - starts below navbar */}
      <div className="farmer-login-background"></div>
        <div
      className="background-image"
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        top: '72px',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        height: '685px',}}
    ></div>
      {/* Background Overlay - starts below navbar */}
      <div className="farmer-login-overlay"></div>

      <div className="farmer-login-page">
        <Card className="farmer-login-card">
          <div className="farmer-login-header">
            <div className="farmer-login-icon">
              <TruckOutlined style={{ fontSize: 28, color: 'white' }} />
            </div>
            <Title level={3} className="farmer-login-title">
              Farmer Login
            </Title>
            <Text className="farmer-login-subtitle">Access your farming account</Text>
          </div>

          {errorMessage && (
            <Alert
              message="Login Error"
              description={errorMessage}
              type="error"
              showIcon
              style={{ marginBottom: '24px' }}
              closable
              onClose={() => setErrorMessage('')}
            />
          )}

          <Form
            name="farmer-login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="farmer-login-form"
            disabled={loading}
          >
            <Form.Item
              label="Username or Email"
              name="userName"
              rules={[{ required: true, message: 'Please input your username or email!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter your username or email" 
                size="large" 
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter your password" 
                size="large" 
                disabled={loading}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '8px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="farmer-login-button"
                loading={loading}
                disabled={loading}
                block
              >
                {loading ? 'Logging in...' : 'Login as Farmer'}
              </Button>
            </Form.Item>

            {/* Forgot Password Link */}
            <Form.Item style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Button 
                type="link" 
                onClick={handleForgotPassword}
                icon={<MailOutlined />}
                style={{ padding: '4px 0', height: 'auto' }}
              >
                Forgot Password?
              </Button>
            </Form.Item>

            {loading && (
              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <Spin size="large" />
                <Text style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                  Authenticating, please wait...
                </Text>
              </div>
            )}
          </Form>

          <Divider>Or</Divider>

          <div className="farmer-login-footer">
            <Text type="secondary">
              Don't have an account? <Link href="/logins/farmerSignup">Sign up here</Link>
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
              Only SYSTEM_USER roles can access the farmer dashboard
            </Text>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FarmerLogin;