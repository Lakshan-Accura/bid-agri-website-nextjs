'use client';

import React, { useState, useEffect } from "react";
import { 
  Card, 
  Descriptions, 
  Button, 
  Modal,
  Tag,
  message
} from "antd";
import { 
  LockOutlined,
  UserOutlined
} from "@ant-design/icons";
import ChangePassword from "../resetPassword/changePassword/page";
import { tokenUtils } from "../components/apiEndpoints/login";

interface UserProfile {
  email: string;
  roles: string[];
  name: string;
}

// Function to format roles (special case for TENANT_ADMIN)
const formatRole = (role: string): string => {
  if (!role) return "";

  const normalizedRole = role.toUpperCase();

  if (normalizedRole === "TENANT_ADMIN") {
    return "Store Admin";
  }

   if (normalizedRole === "SYSTEM_USER") {
    return "Farmer";
  }

  // Default formatting (replace underscores and capitalize)
  return role
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    email: "",
    roles: [],
    name: "",
  });

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Get user data from decoded JWT token
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const decodedToken = tokenUtils.getDecodedToken();
      if (decodedToken) {
        console.log("Decoded JWT Token in Profile:", decodedToken);
        setUser({
          email: decodedToken.sub || "",
          roles: decodedToken.roles || [],
          name: decodedToken.name,
        });
      }
    }
  }, []);

  // Show loading or not authenticated message during SSR
  if (!isClient) {
    return (
      <div className="profile-container">
        <Card className="profile-card">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading profile...</p>
          </div>
        </Card>
      </div>
    );
  }

  const decodedToken = tokenUtils.getDecodedToken();
  if (!decodedToken) {
    return (
      <div className="profile-container">
        <Card className="profile-card">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Please log in to view your profile.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Card
        className="profile-card"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <UserOutlined style={{ color: '#1890ff' }} />
            <span>User Profile</span>
          </div>
        }
        extra={
          <Button
            icon={<LockOutlined />}
            onClick={() => setChangePasswordModal(true)}
            type="primary"
            style={{
              backgroundColor: '#379608ff', // green background
              borderColor: '#52c41a',     // green border
            }}
          >
            Change Password
          </Button>
        }
      >
        <Descriptions 
          column={1}
          bordered 
          size="middle"
          labelStyle={{ fontWeight: 'bold', width: '120px', backgroundColor: '#fafafa' }}
          contentStyle={{ backgroundColor: '#fff' }}
        >
          <Descriptions.Item label="Name">
            {user.name}
          </Descriptions.Item>
          
          <Descriptions.Item label="Email">
            {user.email}
          </Descriptions.Item>

          <Descriptions.Item label="Role">
            {user.roles.map(role => (
              <Tag 
                key={role} 
                color="blue"
                style={{ marginRight: 4, marginBottom: 4 }}
              >
                {formatRole(role)}
              </Tag>
            ))}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={changePasswordModal}
        onCancel={() => setChangePasswordModal(false)}
        footer={null}
        width={500}
      >
        <ChangePassword 
          userEmail={user.email}
          onSuccess={() => {
            setChangePasswordModal(false);
            message.success("Password changed successfully!");
          }}
        />
      </Modal>
    </div>
  );
};

export default Profile;