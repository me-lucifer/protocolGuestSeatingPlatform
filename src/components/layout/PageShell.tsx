'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  ArrowLeft,
  Settings,
  Calendar,
  Ticket,
  Users,
  Building2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

const navItems: { [key: string]: NavItem[] } = {
  'Super Admin / IT Admin': [
    { href: '/super-admin', icon: Settings, label: 'Settings' },
  ],
  'Protocol Admin / Event Manager': [
    { href: '/protocol-admin/events', icon: Calendar, label: 'Events' },
    { href: '/protocol-admin/guests', icon: Users, label: 'Guests' },
  ],
  'Protocol Officer / Entrance Agent': [
    { href: '/protocol-officer', icon: Users, label: 'Guest Check-in' },
  ],
  'Guest / Invitee': [{ href: '/guest', icon: Ticket, label: 'My Invitation' }],
};

export function PageShell({
  role,
  children,
}: {
  role: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const currentNavItems = navItems[role] || [];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-semibold font-headline">Protocol</h2>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild variant="ghost">
                <Link href="/">
                  <ArrowLeft />
                  Back to Roles
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Separator className="my-2" />
            {currentNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    <item.icon />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4 text-center text-xs text-muted-foreground">
            &copy; 2024 Protocol Platform
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="outline" className="text-sm">
              {role}
            </Badge>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
