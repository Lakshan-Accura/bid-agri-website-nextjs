import './globals.css';

export const metadata = {
  title: 'Your App Name',
  description: 'Agricultural Trading Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}