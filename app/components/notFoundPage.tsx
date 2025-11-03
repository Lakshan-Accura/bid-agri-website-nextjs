'use client';

import React from 'react';
import { Result, Button, Card, Space, Typography, Row, Col } from 'antd';
import { HomeOutlined, RocketOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  const quickActions = [
    {
      title: 'Go Home',
      description: 'Return to the main dashboard',
      icon: <HomeOutlined />,
      path: '/storeDashboard',
      color: '#52c41a'
    },
    {
      title: 'Browse Products',
      description: 'Explore available products',
      icon: <RocketOutlined />,
      path: '/storeDashboard',
      color: '#73d13d'
    },
    {
      title: 'Get Help',
      description: 'Contact support team',
      icon: <CustomerServiceOutlined />,
      path: '/storeDashboard',
      color: '#389e0d'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1f7a3d 0%, #2d8c4d 100%)', // Darker green gradient
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          maxWidth: 800, 
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: 'none',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        {/* Main Result Component */}
        <Result
          status="404"
          title={
            <Title level={1} style={{ color: '#262626', marginBottom: 8 }}>
              404
            </Title>
          }
          subTitle={
            <Space direction="vertical" size="large" style={{ textAlign: 'center', width: '100%' }}>
              <Title level={3} style={{ color: '#595959', margin: 0 }}>
                Page Not Found
              </Title>
              <Paragraph style={{ color: '#8c8c8c', fontSize: '16px', margin: 0 }}>
                Sorry, the page you are looking for doesn't exist or has been moved.
              </Paragraph>
            </Space>
          }
          extra={
            <Button 
              type="primary" 
              size="large" 
              icon={<HomeOutlined />}
              onClick={() => router.push('/storeDashboard')}
              style={{
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                border: 'none'
              }}
              className="notfound-home-button"
            >
              Back to Home
            </Button>
          }
        />

        {/* Quick Actions Section */}
        <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ textAlign: 'center', marginBottom: '32px', color: '#262626' }}>
            Quick Actions
          </Title>
          <Row gutter={[16, 16]}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={8} key={index}>
                <Card
                  hoverable
                  style={{ 
                    textAlign: 'center',
                    border: `1px solid ${action.color}20`,
                    borderRadius: '12px',
                    transition: 'all 0.3s ease'
                  }}
                  bodyStyle={{ padding: '24px 16px' }}
                  onClick={() => router.push(action.path)}
                >
                  <div style={{ 
                    fontSize: '32px', 
                    color: action.color,
                    marginBottom: '16px'
                  }}>
                    {action.icon}
                  </div>
                  <Title level={5} style={{ marginBottom: '8px', color: '#262626' }}>
                    {action.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    {action.description}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Help Section */}
        <div style={{ 
          marginTop: '32px', 
          padding: '20px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Space direction="vertical" size="small">
            <Text strong>Need help?</Text>
            <Text type="secondary">
              Contact our support team at{' '}
              <a href="mailto:support@agristore.com" style={{ color: '#389e0d' }}> {/* Green link */}
                support@agristore.com
              </a>
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;