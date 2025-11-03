'use client';

import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Result,
  Space,
  Divider,
  Spin,
  message
} from 'antd';
import {
  KeyOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  MailOutlined
} from '@ant-design/icons';
import { verifyRegistration } from '../../components/apiEndpoints/login';
import router from 'next/router'; 
import Link from 'next/link';

const { Title, Text } = Typography;



const VerifyStoreRegister: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onFinish = async (values: { token: string }) => {
    setLoading(true);
    setErrorMessage('');
    setVerificationStatus('idle');
    
    try {
      console.log('Starting verification for token:', values.token);
      
      const response = await verifyRegistration(values.token);
      
      console.log('Verification response received:', response);
      
      if (response.resultStatus === "SUCCESSFUL") {
        console.log('Verification successful, setting success state');
        setVerificationStatus('success');
        message.success('Store registration verified successfully!');
        
        setTimeout(() => {
          router.push('/FarmerLogin');
        }, 3000);
      } else {
        console.log('Verification failed with response:', response);
        setVerificationStatus('error');
        setErrorMessage(response.message || 'Verification failed. Please check the token and try again.');
      }
    } catch (error: any) {
      console.error('Error during verification:', error);
      setVerificationStatus('error');
      
      if (error.message?.includes('Failed to fetch')) {
        setErrorMessage('Network error: Cannot connect to the server. Please check your connection and try again.');
      } else if (error.message?.includes('403')) {
        setErrorMessage('Access denied. Please make sure you have proper permissions.');
      } else if (error.message?.includes('404')) {
        setErrorMessage('Verification endpoint not found. Please contact support.');
      } else {
        setErrorMessage(error.message || 'Failed to verify token. Please check the token and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = (): void => {
    router.push('/storeLogin');
  };

  const handleTryAgain = (): void => {
    setVerificationStatus('idle');
    setErrorMessage('');
    form.resetFields();
  };

  // Success view
  if (verificationStatus === 'success') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 50%, #2f855a 100%)',
        padding: '20px'
      }}>
        <Card style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="Store Registration Verified Successfully!"
            subTitle="Your store registration has been verified. Redirecting to login..."
            extra={[
              <Button 
                key="login" 
                type="primary" 
                onClick={handleBackToLogin}
              >
                Go to Login Now
              </Button>
            ]}
          />
          <div style={{ marginTop: '24px' }}>
            <Spin size="large" />
            <Text style={{ display: 'block', marginTop: '16px', color: '#666' }}>
              Redirecting to login page...
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  // Error view
  if (verificationStatus === 'error') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 50%, #2f855a 100%)',
        padding: '20px'
      }}>
        <Card style={{ maxWidth: 500, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <KeyOutlined style={{ fontSize: '48px', color: '#e53e3e', marginBottom: '16px' }} />
            <Title level={2} style={{ color: '#2d3748', marginBottom: '8px' }}>
              Verification Failed
            </Title>
            <Text style={{ color: '#718096' }}>
              {errorMessage}
            </Text>
          </div>

          <Alert
            message="Verification Error"
            description={errorMessage}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Button onClick={handleTryAgain}>
              Try Again
            </Button>
            <Button type="primary" onClick={handleBackToLogin}>
              Go to Login
            </Button>
          </Space>

          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fff2f0', borderRadius: '6px' }}>
            <Text type="secondary">
              <strong>Troubleshooting tips:</strong>
              <ul style={{ textAlign: 'left', margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>Make sure the token is copied correctly from your email</li>
                <li>Check if the token has expired (usually valid for 24 hours)</li>
                <li>Try copying and pasting the token instead of typing</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  // Main form view
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
          maxWidth: 480, 
          boxShadow: '0 20px 60px rgba(72, 187, 120, 0.3)',
          borderRadius: '16px',
          border: 'none',
        }}
        bodyStyle={{ padding: '32px' }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
          <Title level={2} style={{ color: '#2d3748', marginBottom: '8px', fontSize: '24px' }}>
            Verify Store Registration
          </Title>
          <Text style={{ color: '#718096', fontSize: '14px' }}>
            Enter the verification token sent to your email
          </Text>
        </div>

        {/* Instructions */}
        <Alert
          message="Check Your Email"
          description="We sent a verification token to your email address. Please enter it below to verify your store registration."
          type="info"
          showIcon
          icon={<MailOutlined />}
          style={{ marginBottom: '24px' }}
        />

        {/* Verification Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Verification Token"
            name="token"
            rules={[
              { required: true, message: 'Please enter the verification token!' },
              { min: 10, message: 'Token must be at least 10 characters!' }
            ]}
          >
            <Input 
              prefix={<KeyOutlined style={{ color: '#718096' }} />}
              placeholder="Enter verification token from email"
              size="large"
              style={{
                height: '44px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                padding: '0 16px',
                fontSize: '14px'
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
                height: '44px',
                borderRadius: '8px',
                backgroundColor: '#38a169',
                border: 'none',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(56, 161, 105, 0.4)',
              }}
            >
              {loading ? 'Verifying...' : "Verify Store Registration"}
            </Button>
          </Form.Item>
        </Form>

        {loading && (
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <Spin size="large" />
            <Text style={{ display: 'block', marginTop: '8px', color: '#666' }}>
              Verifying your token, please wait...
            </Text>
          </div>
        )}

        <Divider />

        {/* Footer Section */}
        <div style={{ textAlign: 'center' }}>
          <Space direction="vertical" size="small">
            <Text type="secondary">
              Didn't receive the token?{' '}
              <Link href="/resend-verification">Resend verification email</Link>
            </Text>
            <Link href="/">
              <Button icon={<ArrowLeftOutlined />} type="link">
                Back to Login
              </Button>
            </Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default VerifyStoreRegister;