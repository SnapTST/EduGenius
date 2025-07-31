'use client';

import React from 'react';
import { UserNav } from '@/components/user-nav'; // or remove if not needed

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Top navigation (optional) */}
      <header className="w-full px-4 py-3 shadow bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">EduGenius</h1>
          <UserNav /> {/* You can remove this if UserNav is not available */}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer (optional) */}
      <footer className="w-full py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} EduGenius. All rights reserved.
      </footer>
    </div>
  );
}
