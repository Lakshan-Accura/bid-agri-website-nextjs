import React, { useState, useEffect } from 'react';
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  HomeOutlined,
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
import { tokenUtils } from '../apiEndpoints/login';
import Image from 'next/image';
import logo from '../../../public/logo.png';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface StoreDashboardProps {
  children?: React.ReactNode;
}

const StoreDashboard: React.FC<StoreDashboardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Navigation items
  const navItems = [
    {
      key: '/storeDashboard',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    {
      key: '/auctions',
      icon: <ShoppingOutlined />,
      label: 'Browse Auctions',
    },
    {
      key: '/commissions',
      icon: <ShoppingOutlined />,
      label: 'Commissions',
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
        router.push('/storeLogin');
        break;
      default:
        break;
    }
  };

  // Simple welcome content
  const renderWelcomeContent = () => (
    <div style={{ 
      textAlign: 'center', 
      padding: '80px 20px',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      <Title level={1} style={{ color: '#037e28ff', marginBottom: 16 }}>
        Welcome to Your Store
      </Title>
      <Text style={{ fontSize: '18px', color: '#666' }}>
        Manage your products and orders in one place. Get started by adding your first product!
      </Text>
    </div>
  );

  // Don't render navigation until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, marginRight: 8, backgroundColor: '#f0f0f0' }} />
            <Text strong style={{ fontSize: 20 }}>My Store</Text>
          </div>
        </Header>
        <Content style={{ padding: '20px' }}>
          {children || renderWelcomeContent()}
        </Content>
      </Layout>
    );
  }

  return (
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
            alt="My Store Logo" 
            width={32}
            height={32}
            style={{ marginRight: 8 }} 
          />
          <Text strong style={{ fontSize: 20 }}>My Store</Text>
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
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
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
          © 2025 My Store. All rights reserved.
        </Text>
      </Footer>
    </Layout>
  );
};

export default StoreDashboard;