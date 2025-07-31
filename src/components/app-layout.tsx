

'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';
import { LayoutDashboard, FileText, BookOpen, Layers, ScanLine, BrainCircuit, Bot, HelpCircle, Target, ListOrdered, PenSquare, LifeBuoy, Mail } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/ai-tutor', icon: Bot, label: 'AI Tutor' },
  { href: '/doubt-solver', icon: HelpCircle, label: 'Doubt Solver' },
  { href: '/daily-practice', icon: Target, label: 'Daily Practice' },
  { href: '/project-assistant', icon: BrainCircuit, label: 'Project Assistant' },
  { href: '/homework-helper', icon: ListOrdered, label: 'Homework Helper' },
  { href: '/chapter-scanner', icon: ScanLine, label: 'Chapter Scanner' },
  { href: '/test-generator', icon: FileText, label: 'AI Test Generator' },
  { href: '/essay-writer', icon: PenSquare, label: 'Essay Writer' },
  { href: '/interactive-notes', icon: BookOpen, label: 'Interactive Notes' },
  { href: '/flashcard-creator', icon: Layers, label: 'Flashcard Creator' },
];

const helpNavItems = [
    { href: '/help', icon: LifeBuoy, label: 'Help Center' },
    { href: '/support', icon: LifeBuoy, label: 'Support' },
    { href: '/contact', icon: Mail, label: 'Contact Us' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarRail />
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo />
              <h1 className="text-xl font-headline font-semibold">EduGenius</h1>
            </div>
          </SidebarHeader>
          <SidebarMenu className="flex-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href} prefetch={true}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          
          <SidebarMenu>
            {helpNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href} prefetch={true}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarFooter>
            <UserNav />
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
                {/* We can add a page title here if needed */}
            </div>
        </header>
        <div className="p-4 sm:p-6 md:p-8 flex-grow">
            {children}
        </div>
        <footer className="p-4 text-center text-sm text-muted-foreground border-t">
            © {new Date().getFullYear()} Prashant Pandey. All rights reserved.
        </footer>
      </main>
    </SidebarProvider>
  );
}
