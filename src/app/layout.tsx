
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { DemoHelper } from '@/components/demo/DemoHelper';
import { TourProvider } from '@/contexts/TourContext';
import { DemoProvider } from '@/contexts/DemoContext';

export const metadata: Metadata = {
  title: 'Protocol Guest Seating Platform',
  description: 'Manage guest seating for diplomatic and official events.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {/*
          // Handoff Note:
          // DemoProvider and TourProvider are for demonstration purposes only.
          // In a production environment, these would be removed.
          // The core application structure begins inside these providers.
        */}
        <DemoProvider>
          <TourProvider>
            {children}
            <Toaster />
            {/* DemoHelper is a demo-only component for quick navigation and guides. */}
            <DemoHelper />
          </TourProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
