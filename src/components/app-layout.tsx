'use client';

import React from 'react';
import { UserNav } from '@/components/user-nav'; // Optional: Remove if not using
import { cn } from '@/lib/utils'; // Optional: Only if you're using `cn()` utility

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-border bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">EduGenius</h1>
          {/* User Navigation */}
          <UserNav /> {/* Optional – remove if you're not using UserNav */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-6 py-8 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} EduGenius. All rights reserved.
      </footer>
    </div>
  );
}
