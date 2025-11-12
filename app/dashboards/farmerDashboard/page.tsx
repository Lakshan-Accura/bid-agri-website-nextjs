'use client';

import React, { useState } from 'react';
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { 
  Layout, 
  Menu, 
  Button, 
  Typography, 
  Avatar, 
  Dropdown, 
  Space 
} from 'antd';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { tokenUtils } from '../../components/apiEndpoints/login/login';
import logo from '../../../public/logo.png';
import ProtectedRoute from '@/app/components/protectedRoute';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface FarmerDashboardProps {
  children?: React.ReactNode;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  // Navigation items for farmer
  const navItems = [
    {
      key: '/farmerDashboard',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/view-auctions',
      icon: <AppstoreOutlined />,
      label: 'View Auctions',
    },

    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Generate Reports',
    },
  ];

  const handleNavClick = (e: { key: string }) => {
    router.push(e.key);
    setMobileMenuOpen(false);
  };

  const handleUserMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case 'profile':
        router.push('/profile');
        break;
      case 'logout':
        tokenUtils.clearTokens();
        router.push('/logins/farmerLogin');
        break;
      default:
        break;
    }
  };

  // Simple welcome content for farmer
  const renderWelcomeContent = () => (
    <div style={{ 
      textAlign: 'center', 
      padding: '80px 20px',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      <Title level={1} style={{ color: '#52c41a', marginBottom: 16 }}>
        Welcome Farmer!
      </Title>
      <Text style={{ fontSize: '18px', color: '#666' }}>
        Manage your farm products, track your sales, and grow your farming business.
      </Text>
     
    </div>
  );

  return (
  <ProtectedRoute requiredRoles="SYSTEM_USER">
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header with Navigation */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image 
          src={logo} 
          alt="Farmer Portal Logo" 
          style={{ 
            height: '32px', 
            marginRight: '8px' 
          }} 
        />
        <Text strong style={{ fontSize: '20px' }}>Farmer Portal</Text>
      </div>

        {/* Desktop Navigation */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            items={navItems}
            onClick={handleNavClick}
            style={{ border: 'none', background: 'transparent' }}
          />
        </div>

        {/* User Menu */}
        <Space>
          <Dropdown
            menu={{ 
              items: userMenuItems,
              onClick: handleUserMenuClick
            }}
            placement="bottomRight"
          >
            <Avatar 
              icon={<UserOutlined />} 
              style={{ 
                cursor: 'pointer',
                backgroundColor: '#52c41a' 
              }} 
            />
          </Dropdown>

          {/* Mobile Menu Button */}
          <Button 
            type="text"
            icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
            className="mobile-menu-btn"
          />
        </Space>
      </Header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <Menu
            mode="vertical"
            selectedKeys={[pathname]}
            items={navItems}
            onClick={handleNavClick}
            style={{ border: 'none' }}
          />
        </div>
      )}

      {/* Main Content */}
      <Content style={{ padding: '20px' }}>
        {children || renderWelcomeContent()}
      </Content>

      {/* Simple Footer */}
      <Footer style={{ 
        textAlign: 'center', 
        background: '#f0f2f5',
        borderTop: '1px solid #d9d9d9'
      }}>
        <Text type="secondary">
          © 2025 Farmer Portal. All rights reserved.
        </Text>
      </Footer>
    </Layout>
    </ProtectedRoute>
  );
};

export default FarmerDashboard;