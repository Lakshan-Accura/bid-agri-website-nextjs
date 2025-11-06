'use client';

import React, { useEffect, useState } from "react";
import { Result, Button, Spin, Space } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const EmailVerification: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your email, please wait...");

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("✅ Verification token from URL:", token);

    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem("emailVerificationToken", token);
    }

    const verifyEmail = async () => {
      try {
        const API_BASE_URL = 'http://localhost:8080/api/v1';
        const response = await fetch(
          `${API_BASE_URL}/user/verifyRegistration?token=${encodeURIComponent(token)}`
        );

        if (!response.ok) {
          throw new Error("Verification failed. Invalid or expired token.");
        }

        const data = await response.json();
        console.log("📦 Verification API response:", data);

        if (data.resultStatus === "SUCCESSFUL" || data.success) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. Please try again.");
        }
      } catch (error: any) {
        console.error("❌ Error verifying email:", error);
        setStatus("error");
        setMessage(error.message || "An unexpected error occurred.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <Spin fullscreen tip="Verifying your email..." />
    );
  }

  return (
    <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
      {status === "success" ? (
        <Result
          status="success"
          title="Email Verified Successfully!"
          subTitle={message}
          extra={[
            <Space key="buttons" direction="vertical" style={{ width: '100%' }} size="middle">
              <Button
                type="primary"
                key="farmer-login"
                onClick={() => router.push('/logins/farmerLogin')}
                style={{
                  background: '#52c41a',
                  borderColor: '#52c41a',
                  width: '200px'
                }}
              >
                Login as Farmer
              </Button>,
              <Button
                type="primary"
                key="store-login"
                onClick={() => router.push('/resetPassword/changePasswordInit')}
                style={{
                  background: '#1890ff',
                  borderColor: '#1890ff',
                  width: '200px'
                }}
              >
                Login as Store
              </Button>
            </Space>
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Email Verification Failed"
          subTitle={message}
          extra={[
            <Button type="primary" key="home" onClick={() => router.push("/")}>
              Go Home
            </Button>,
          ]}
        />
      )}
    </div>
  );
};

export default EmailVerification;
