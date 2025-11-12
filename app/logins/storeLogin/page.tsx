'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, ShopOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, tokenUtils, type LoginRequest } from '../../components/apiEndpoints/login/login';
import MainLayout from '../../components/mainLayout/page';
import './storeLogin.css';

const { Title, Text } = Typography;

const AgriStoreLogin: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check if user has TENANT_ADMIN role
  const hasStoreAccess = (): boolean => {
    return tokenUtils.hasTenantAdminRole();
  };

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    setErrorMessage('');

    try {
      console.log('Agri Store login attempt:', values);

      // Login API call
      const response = await authApi.login(values);
      console.log('Login response received:', response);

      if (response.payload?.jwtToken) {
        console.log('JWT Token received and stored by tokenUtils');

        // Check user role
        if (!hasStoreAccess()) {
          const decodedToken = tokenUtils.getDecodedToken();
          const userRoles = decodedToken?.roles?.join(', ') || 'No roles assigned';
          tokenUtils.clearTokens(); // Clear invalid tokens
          throw new Error(`Access denied. Your role(s): ${userRoles}. Only TENANT_ADMIN can access the store dashboard.`);
        }

        // Store username
        if (typeof window !== 'undefined') {
          localStorage.setItem('userName', values.userName);
        }

        message.success('Login successful! Redirecting to store dashboard...');

        // ✅ Navigate to dashboard after token is set
        setTimeout(() => {
          router.push('/dashboards/storeDashboard');
        }, 300);
      } else {
        // Handle API error responses
        const errorMsg = response.message || 'Login failed. Please check your credentials.';
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Extract user-friendly error message
      let userFriendlyError = 'An error occurred during login. Please try again.';
      
      if (error.response?.status === 401) {
        userFriendlyError = 'Invalid email/username or password. Please check your credentials and try again.';
      } else if (error.message?.includes('401')) {
        userFriendlyError = 'Invalid email/username or password. Please check your credentials and try again.';
      } else if (error.message) {
        userFriendlyError = error.message;
      } else if (error.response?.data?.message) {
        userFriendlyError = error.response.data.message;
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
      sessionStorage.setItem('userType', 'store');
    }
    router.push('/resetPassword/sendResetEmail');
  };

  return (
    <MainLayout>
      {/* Background Image - scrolls with page */}
      <div className="agri-store-login-background"></div>
      
      {/* Background Overlay - scrolls with page */}
      <div className="agri-store-login-overlay"></div>

      <div className="agri-store-login-page">
        <Card className="agri-store-login-card">
          <div className="agri-store-header">
            <div className="agri-store-icon">
              <ShopOutlined style={{ fontSize: 28, color: 'white' }} />
            </div>
            <Title level={3} className="agri-store-title">
              Agri Store Login
            </Title>
            <Text className="agri-store-subtitle">Access your store dashboard</Text>
          </div>

          {errorMessage && (
            <Alert
              message="Login Error"
              description={errorMessage}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
              closable
              onClose={() => setErrorMessage('')}
            />
          )}

          <Form
            name="agri-store-login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="agri-store-form"
            disabled={loading}
          >
            <Form.Item
              label="Username or Email"
              name="userName"
              rules={[{ required: true, message: 'Please input your username or email!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter username or email"
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

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="agri-store-button"
                icon={<UserOutlined />}
              >
                {loading ? 'Logging in...' : 'Login to Store Dashboard'}
              </Button>
            </Form.Item>

            {loading && (
              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <Spin size="large" />
                <Text style={{ display: 'block', marginTop: 8, color: '#666' }}>
                  Authenticating, please wait...
                </Text>
              </div>
            )}
          </Form>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button
              type="link"
              icon={<MailOutlined />}
              onClick={handleForgotPassword}
              style={{ padding: 0, height: 'auto', color: '#1890ff' }}
            >
              Forgot Password?
            </Button>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Only TENANT_ADMIN roles can access the store dashboard
            </Text>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AgriStoreLogin;