import './globals.css';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import AdScript from '@/components/ad-script';
import { Toaster } from '@/components/ui/toaster';
import ProgressBar from '@/components/progress-bar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EduGenius',
  description: 'Your AI-Powered Study Partner',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProgressBar />
          {children}
          <Toaster />
          <AdScript />
        </ThemeProvider>
      </body>
    </html>
  );
