'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, KeyOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { passwordApi } from '../components/apiEndpoints/login/login';
import type { ResetPasswordRequest } from '../components/apiEndpoints/login/login';

const { Title, Text } = Typography;

const ResetPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const token = sessionStorage.getItem('resetToken');
      const email = sessionStorage.getItem('resetEmail');

      if (token && email) {
        form.setFieldsValue({
          userName: email,
          token: token
        });
      } else {
        // No data found, redirect back to forgot-password
        router.push('/changePasswordRedirect');
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
        document.documentElement.style.overflow = 'unset';
      }
    };
  }, [form, router]);

  const onFinish = async (values: { userName: string; password: string; token: string }) => {
    setLoading(true);
    try {
      const requestData: ResetPasswordRequest = {
        userName: values.userName,
        password: values.password,
        token: values.token
      };

      const response = await passwordApi.resetPassword(requestData);

      if (response && response.resultStatus === "SUCCESSFUL") {
        message.success('Password reset successfully! Redirecting to login...');
        setTimeout(() => router.push('/'), 2000);
      } else {
        message.error('Password reset failed. Please try again.');
      }
    } catch (error) {
      console.error('Reset error:', error);
      message.error(
        error instanceof Error ? error.message : 'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 50%, #2f855a 100%)',
      padding: '20px',
      position: 'fixed',
      inset: 0
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <Card
          style={{
            width: '100%',
            boxShadow: '0 20px 60px rgba(72, 187, 120, 0.3)',
            borderRadius: '16px',
            border: 'none'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              backgroundColor: '#f0fff4',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '3px solid #c6f6d5'
            }}>
              <KeyOutlined style={{ fontSize: '30px', color: '#38a169' }} />
            </div>
            <Title level={2} style={{ color: '#2d3748', marginBottom: '8px' }}>
              Reset Password
            </Title>
            <Text style={{ color: '#718096' }}>
              Enter your new password below to reset your account
            </Text>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Hidden fields */}
            <Form.Item name="userName" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="token" hidden>
              <Input />
            </Form.Item>

            {/* Only one visible field: new password */}
            <Form.Item
              name="password"
              label={<Text strong>New Password</Text>}
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
                size="large"
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0'
                }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              icon={!loading && <CheckCircleOutlined />}
              style={{
                height: '44px',
                borderRadius: '8px',
                backgroundColor: '#38a169',
                border: 'none',
                fontSize: '15px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Form>

          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '20px'
          }}>
            <Link href="/" style={{ color: '#38a169', fontWeight: '500' }}>
              <ArrowLeftOutlined /> Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordForm;