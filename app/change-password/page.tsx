'use client';
import { Suspense } from 'react';
import ChangePasswordRedirect from './redirect';

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordRedirect />
    </Suspense>
  );
}
