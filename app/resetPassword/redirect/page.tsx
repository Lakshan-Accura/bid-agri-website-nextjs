'use client';
import { Suspense } from 'react';
import ChangePasswordRedirect from './ChangePasswordRedirect';
import { Spin } from 'antd';

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<Spin fullscreen tip="Redirecting..." />}>
      <ChangePasswordRedirect />
    </Suspense>
  );
}
