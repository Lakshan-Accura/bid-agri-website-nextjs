'use client';

import React, { useState } from 'react';
import { Form, Input, Button, message, Alert, Card } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { passwordApi, tokenUtils } from '../../components/apiEndpoints/login/login';
import type { ChangePasswordRequest } from '../../components/apiEndpoints/login/login';
import { useRouter } from 'next/navigation';
import MainLayout from '../../components/mainLayout/page';
import ProtectedRoute from '@/app/components/protectedRoute';

const ChangePasswordInit: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }) => {
    if (values.oldPassword === values.newPassword) {
      setErrorMessage('New password must be different from old password!');
      return;
    }

    setLoading(true);
    setErrorMessage(''); // Clear previous errors

    try {
      const requestData: ChangePasswordRequest = {
        email: values.email,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      };

      console.log('🔄 Sending change password request:', JSON.stringify(requestData, null, 2));

      const response = await passwordApi.changePassword(requestData);
      
      console.log('✅ API Response:', response);
      
      if (response.resultStatus === "SUCCESSFUL" || response.success) {
        message.success('Password changed successfully!');
        form.resetFields();
        setErrorMessage(''); // Clear any errors

        // Get user role before clearing tokens
        const decodedToken = tokenUtils.getDecodedToken();
        const userRoles = decodedToken?.roles || [];

        // Logout user after a short delay and redirect to '/'
        setTimeout(() => {
          tokenUtils.clearTokens();
          message.info('Please log in again with your new password');
          
          // Always navigate to '/' regardless of user role
          router.push('/logins/storeLogin');
        }, 1500);

      } else {
        // Handle specific error messages from API
        const errorMessage = response.message || 'Failed to change password. Please try again.';
        
        // Check if the error indicates wrong current password
        if (errorMessage.toLowerCase().includes('current password') || 
            errorMessage.toLowerCase().includes('old password') ||
            errorMessage.toLowerCase().includes('incorrect password') ||
            errorMessage.toLowerCase().includes('invalid password')) {
          setErrorMessage('Current password is incorrect. Please try again.');
        } else {
          setErrorMessage(errorMessage);
        }
      }
    } catch (error: any) {
      console.error('❌ Change password error details:', error);
      
      // Enhanced error handling for different error types
      let userFriendlyError = 'Failed to change password. Please try again.';
      
      // Check for HTTP status codes
      if (error.status === 401 || error.code === 401 || error.response?.status === 401) {
        userFriendlyError = 'Current password is incorrect. Please check your current password and try again.';
      }
      // Check for specific error messages in the error object
      else if (error.message) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('current password') || 
            errorMsg.includes('old password') ||
            errorMsg.includes('incorrect password') ||
            errorMsg.includes('invalid password') ||
            errorMsg.includes('401')) {
          userFriendlyError = 'Current password is incorrect. Please check your current password and try again.';
        } else {
          userFriendlyError = error.message;
        }
      }
      // Check for axios-like error response
      else if (error.response?.data?.message) {
        const errorMsg = error.response.data.message.toLowerCase();
        if (errorMsg.includes('current password') || 
            errorMsg.includes('old password') ||
            errorMsg.includes('incorrect password') ||
            errorMsg.includes('invalid password')) {
          userFriendlyError = 'Current password is incorrect. Please check your current password and try again.';
        } else {
          userFriendlyError = error.response.data.message;
        }
      }
      // Check for fetch-like error response
      else if (error.data?.message) {
        const errorMsg = error.data.message.toLowerCase();
        if (errorMsg.includes('current password') || 
            errorMsg.includes('old password') ||
            errorMsg.includes('incorrect password') ||
            errorMsg.includes('invalid password')) {
          userFriendlyError = 'Current password is incorrect. Please check your current password and try again.';
        } else {
          userFriendlyError = error.data.message;
        }
      }

      setErrorMessage(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <MainLayout>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 200px)',
        padding: '20px'
      }}>
        <Card
          title="Change Password"
          style={{
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}
          bodyStyle={{ padding: '24px' }}
        >
          {/* Error Alert - shows at the top of the popup */}
          {errorMessage && (
            <Alert
              message="Change Password Error"
              description={errorMessage}
              type="error"
              showIcon
              closable
              onClose={() => setErrorMessage('')}
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Enter your email" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="oldPassword"
              label="Current Password"
              rules={[
                { required: true, message: 'Please input your current password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter your current password" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter new password" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{
                  backgroundColor: '#338609ff',
                  borderColor: '#52c41a',
                  height: '40px'
                }}
              >
                {loading ? "Changing Password..." : "Change Password"}
              </Button>
            </Form.Item>
          </Form>

          <Alert
            message="Password Requirements"
            description="Password must be at least 6 characters long. New password must be different from current password."
            type="info"
            showIcon
            style={{ marginTop: '16px' }}
          />
        </Card>
      </div>
    </MainLayout>
    </ProtectedRoute>
  );
};

export default ChangePasswordInit;