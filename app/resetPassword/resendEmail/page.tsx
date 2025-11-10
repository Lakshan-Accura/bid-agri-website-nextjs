'use client';
import { Suspense } from 'react';
import { Spin } from 'antd';
import EmailSendPageContent from './EmailSendPage';

export default function EmailSendPage() {
  return (
    <Suspense fallback={<Spin fullscreen tip="Loading email verification page..." />}>
      <EmailSendPageContent />
    </Suspense>
  );
}
