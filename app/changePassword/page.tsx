'use client';

import React, { useState } from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { passwordApi, tokenUtils } from '../components/apiEndpoints/login/login';
import type { ChangePasswordRequest } from '../components/apiEndpoints/login/login';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/protectedRoute';

interface ChangePasswordProps {
  userEmail: string;
  onSuccess: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ userEmail, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  React.useEffect(() => {
    form.setFieldsValue({ email: userEmail });
  }, [userEmail, form]);

  const onFinish = async (values: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }) => {
    if (values.oldPassword === values.newPassword) {
      message.error('New password must be different from old password!');
      return;
    }

    setLoading(true);
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

        // Get user role before clearing tokens
        const decodedToken = tokenUtils.getDecodedToken();
        const userRoles = decodedToken?.roles || [];

        onSuccess();

        // Logout user after a short delay
        setTimeout(() => {
          tokenUtils.clearTokens();
          message.info('Please log in again with your new password');
          
          // Redirect based on user role
          if (userRoles.includes('TENANT_ADMIN') || userRoles.includes('ROLE_TENANT_ADMIN')) {
            router.push('/logins/storeLogin');
          } else if (userRoles.includes('SYSTEM_USER') || userRoles.includes('ROLE_SYSTEM_USER')) {
            router.push('/logins/farmerLogin');
          } else {
            // Default fallback
            router.push('/');
          }
        }, 1500);

      } else {
        message.error(response.message || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('❌ Change password error details:', error);
      message.error(
        error instanceof Error 
          ? `Change password failed: ${error.message}` 
          : 'Failed to change password. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <div style={{ padding: '10px 0' }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        initialValues={{ email: userEmail }}
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            style={{
              backgroundColor: '#338609ff', // green background
              borderColor: '#52c41a',     // green border
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
    </div>
    </ProtectedRoute>
  );
};

export default ChangePassword;