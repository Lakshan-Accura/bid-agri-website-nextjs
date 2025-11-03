'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Alert, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerApi } from '../../components/apiEndpoints/login';
import { useAuthStore } from '../../store/authStore';
import MainLayout from '../../components/mainLayout/mainLayout';
import backgroundImage from '../../../public/background.jpg';
import "./farmerSignup.css"

const { Title, Text } = Typography;

interface FarmerSignupValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  matchingPassword: string;
}

const FarmerSignup: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Get Zustand actions
  const setRegistrationData = useAuthStore((state) => state.setRegistrationData);

  // Prevent scrolling when component mounts
  useEffect(() => {
    document.body.classList.add('farmer-signup-active');
    
    return () => {
      document.body.classList.remove('farmer-signup-active');
    };
  }, []);

  const onFinish = async (values: FarmerSignupValues) => {
    setLoading(true);
    setErrorMessage('');

    try {
      console.log('Farmer signup attempt:', values);

      const response = await registerApi.farmerRegister({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        matchingPassword: values.matchingPassword
      });

      console.log('Signup response:', response);

      if (response.resultStatus === "SUCCESSFUL") {
        console.log('Farmer registration successful');
        
        // Save registration data to Zustand store
        setRegistrationData(values.email, 'farmer');
        console.log('Registration data saved to Zustand store');
        
        message.success('Registration successful! Please check your email for verification.');
        
        // Redirect to verification page
        setTimeout(() => {
          router.push('/send-email');
        }, 2000);
      } else {
        throw new Error(response.message || 'Registration failed. Please try again.');
      }

    } catch (error: any) {
      console.error('Signup error:', error);
      setErrorMessage(error.message || 'An error occurred during registration. Please try again.');
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Background Image - starts below navbar */}
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
          height: '914px',
        }}
      ></div>

      <div className="farmer-signup-page">
        <Card className="farmer-signup-card">
          <div className="farmer-signup-header">
            <div className="farmer-signup-icon">
              <UserOutlined style={{ fontSize: 28, color: 'white' }} />
            </div>
            <Title level={3} className="farmer-signup-title">
              Farmer Registration
            </Title>
            <Text className="farmer-signup-subtitle">Create your farming account</Text>
          </div>

          {errorMessage && (
            <Alert
              message="Registration Error"
              description={errorMessage}
              type="error"
              showIcon
              style={{ marginBottom: '24px' }}
              closable
              onClose={() => setErrorMessage('')}
            />
          )}

          <Form
            form={form}
            name="farmer-signup"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="farmer-signup-form"
            scrollToFirstError
            disabled={loading}
          >
            {/* Personal Information */}
            <div className="form-section">
              <div className="form-row">
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'Please input your first name!' }]}
                  className="form-item-half"
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="First name" 
                    size="large" 
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: 'Please input your last name!' }]}
                  className="form-item-half"
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Last name" 
                    size="large" 
                    disabled={loading}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Enter your email" 
                  size="large" 
                  disabled={loading}
                />
              </Form.Item>
            </div>

            <Divider />

            {/* Account Information */}
            <div className="form-section">
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
                hasFeedback
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Create a password" 
                  size="large" 
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="matchingPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Confirm your password" 
                  size="large" 
                  disabled={loading}
                />
              </Form.Item>
            </div>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="farmer-signup-button"
                loading={loading}
                disabled={loading}
                block
              >
                {loading ? 'Creating Account...' : 'Create Farmer Account'}
              </Button>
            </Form.Item>

            {loading && (
              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <Spin size="large" />
                <Text style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                  Creating your account, please wait...
                </Text>
              </div>
            )}
          </Form>

          <Divider>Already have an account?</Divider>

          <div className="farmer-signup-footer">
            <Text type="secondary">
              Already registered? <Link href="/farmerLogin">Login here</Link>
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
              After registration, you'll need to verify your email to access the farmer dashboard
            </Text>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FarmerSignup;