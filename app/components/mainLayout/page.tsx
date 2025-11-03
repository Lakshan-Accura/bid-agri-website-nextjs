'use client';

// components/layout/MainLayout.tsx
import React from 'react';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import { useRouter } from 'next/navigation';
import { 
  Layout, 
  Typography, 
  Button, 
  Space,
  Menu
} from 'antd';
import { 
  ShopOutlined, 
  UserOutlined, 
  EnvironmentOutlined 
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './mainLayout.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

// Add props interface for MainLayout
interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();

  // Navigation items for landing page
  const navItems = [
    {
      key: '/',
      label: 'Home',
    },
    {
      key: '/about',
      label: 'About',
    },
    {
      key: '/features',
      label: 'Features',
    },
  ];

  const handleNavClick = (e: { key: string }) => {
    router.push(e.key);
  };

  const handleFarmerLogin = () => {
    router.push('/logins/farmerLogin');
  };

  const handleStoreLogin = () => {
    router.push('/logins/storeLogin');
  };

  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: 'transparent', // Changed to transparent
    }}>
      {/* Header with Navigation */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src={logo} 
            alt="BidStore Logo" 
            width={32}
            height={32}
            style={{ marginRight: 8 }} 
          />
          <Text strong style={{ fontSize: 20 }}>BidStore</Text>
        </div>

        {/* Desktop Navigation */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Menu
            mode="horizontal"
            selectedKeys={['/']}
            items={navItems}
            onClick={handleNavClick}
            style={{ 
              border: 'none', 
              background: 'transparent',
              fontWeight: '500'
            }}
          />
        </div>

        {/* Login Buttons */}
        <Space>
          <Button 
            type="default" 
            icon={<UserOutlined />}
            onClick={handleFarmerLogin}
            style={{ 
              background: '#fff',
              border: '1px solid #d9d9d9',
              fontWeight: '500'
            }}
          >
            Farmer Login
          </Button>
          <Button 
            type="primary" 
            icon={<ShopOutlined />}
            onClick={handleStoreLogin}
            style={{ 
              background: '#067527ff',
              border: 'none',
              fontWeight: '500'
            }}
          >
            Store Login
          </Button>
        </Space>
      </Header>

      {/* Main Content - Now renders children */}
      <Content style={{ 
        flex: 1,
        padding: '0', // Removed padding
        background: 'transparent' // Changed to transparent
      }}>
        {children || (
          <div style={{ 
            textAlign: 'center',
            color: '#333',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '40px 20px' // Added padding to the inner div instead
          }}>
            <ShopOutlined style={{ 
              fontSize: '80px', 
              marginBottom: '32px',
              display: 'block',
              color: '#52c41a'
            }} />
            
            <Title level={1} style={{ 
              color: '#333',
              margin: 0,
              marginBottom: '16px',
              fontSize: '3.5rem',
              fontWeight: 'bold',
              lineHeight: 1.2
            }}>
              Welcome to BidStore
            </Title>
            
            <Text style={{ 
              fontSize: '1.3rem', 
              color: '#666',
              display: 'block',
              marginBottom: '48px'
            }}>
              Agricultural Trading Platform
            </Text>

            {/* Call to Action Buttons */}
            <Space size="large" style={{ marginTop: '32px' }}>
              <Button 
                type="default" 
                size="large"
                icon={<UserOutlined />}
                onClick={handleFarmerLogin}
                style={{ 
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  fontWeight: '600',
                  padding: '0 32px',
                  height: '48px',
                  fontSize: '16px'
                }}
              >
                Start as Farmer
              </Button>
              <Button 
                type="primary" 
                size="large"
                icon={<ShopOutlined />}
                onClick={handleStoreLogin}
                style={{ 
                  background: '#006d21ff',
                  border: 'none',
                  fontWeight: '600',
                  padding: '0 32px',
                  height: '48px',
                  fontSize: '16px'
                }}
              >
                Start as Store
              </Button>
            </Space>
          </div>
        )}
      </Content>

      {/* Footer */}
      <Footer style={{ 
        textAlign: 'center', 
        background: '#fafafa',
        borderTop: '1px solid #f0f0f0'
      }}>
        <Text type="secondary">
          © 2025 BidStore Agricultural Trading Platform. All rights reserved.
        </Text>
      </Footer>
    </Layout>
  );
};

export default MainLayout;