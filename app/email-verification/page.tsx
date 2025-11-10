'use client';
import { Suspense } from 'react';
import EmailVerification from './EmailVerification';

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <EmailVerification />
    </Suspense>
  );
}
