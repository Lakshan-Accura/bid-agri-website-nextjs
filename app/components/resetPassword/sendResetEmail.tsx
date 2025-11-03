import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { passwordApi } from '../apiEndpoints/login';
import type { ForgotPasswordRequest } from '../apiEndpoints/login';

const { Title, Text } = Typography;

const SendResetEmail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      const requestData: ForgotPasswordRequest = {
        email: values.email
      };

      await passwordApi.resetPasswordToken(requestData);

      // ✅ Show success message instead of redirecting
      setEmailSent(true);
      setEmailAddress(values.email);
      message.success('Password reset email sent successfully!');
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : 'Failed to send reset email. Please try again.'
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
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 20px 60px rgba(72, 187, 120, 0.3)',
          borderRadius: '16px',
          border: 'none',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        {!emailSent ? (
          <>
            {/* Email Input Form */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#f0fff4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                border: '3px solid #c6f6d5'
              }}>
                <MailOutlined style={{ fontSize: '36px', color: '#38a169' }} />
              </div>
              <Title level={2} style={{ color: '#2d3748', marginBottom: '8px' }}>
                Reset Password
              </Title>
              <Text style={{ color: '#718096', fontSize: '16px' }}>
                Enter your email to receive a password reset link
              </Text>
            </div>

            <Form onFinish={onFinish} layout="vertical">
              <Form.Item
                name="email"
                label={<Text strong style={{ color: '#2d3748' }}>Email Address</Text>}
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#718096' }} />}
                  placeholder="Enter your registered email"
                  size="large"
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    padding: '0 16px'
                  }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: '16px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: '#38a169',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(56, 161, 105, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? "Sending Reset Link..." : "Send Reset Link"}
                </Button>
              </Form.Item>
            </Form>

            <div style={{
              textAlign: 'center',
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <Link
                href="/"
                style={{
                  color: '#38a169',
                  textDecoration: 'none',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color 0.3s ease'
                }}
              >
                <ArrowLeftOutlined />
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* ✅ Email Sent Confirmation */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <CheckCircleOutlined style={{ fontSize: '60px', color: '#38a169', marginBottom: '20px' }} />
              <Title level={3} style={{ color: '#2d3748' }}>Email Sent!</Title>
              <Text style={{ color: '#4a5568', fontSize: '15px' }}>
                A password reset link has been sent to <b>{emailAddress}</b>.
              </Text>
              <div style={{ marginTop: '20px' }}>
                <Link
                  href="/"
                  style={{
                    color: '#38a169',
                    fontWeight: '500',
                    textDecoration: 'none',
                    fontSize: '16px'
                  }}
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default SendResetEmail;