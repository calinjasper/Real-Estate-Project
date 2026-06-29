import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/providers/AuthProvider';

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: 'EstateHub - Find Your Dream Property',
  description: 'Real Estate Listing Platform - Find, Buy, Rent Properties',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
