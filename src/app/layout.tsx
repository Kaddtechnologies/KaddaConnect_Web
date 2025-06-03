
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { UserDataProvider } from '@/contexts/user-data-context';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'KaddaConnect',
  description: 'Connecting the Kadda community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <UserDataProvider>
            {children}
            <Toaster />
          </UserDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
