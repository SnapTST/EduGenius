
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import ProgressBar from '@/components/progress-bar';

export const metadata: Metadata = {
  title: 'EduGenius',
  description: 'Your AI-powered study partner',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1141286894515635"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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
          </ThemeProvider>
        </body>
    </html>
  );
}
