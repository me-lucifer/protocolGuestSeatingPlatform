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
  UserCircle,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumbs } from './Breadcrumbs';


type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

const navItems: { [key: string]: NavItem[] } = {
  'Super Admin / IT Admin': [
    { href: '/super-admin', icon: Settings, label: 'Dashboard' },
    { href: '/super-admin/settings', icon: Settings, label: 'Settings' },
  ],
  'Protocol Admin / Event Manager': [
    { href: '/protocol-admin', icon: Calendar, label: 'Events' },
    { href: '/protocol-admin/guests', icon: Users, label: 'Guests' },
  ],
  'Protocol Officer / Entrance Agent': [
    { href: '/protocol-officer', icon: Users, label: 'Guest Check-in' },
  ],
  'Guest / Invitee': [{ href: '/guest-invitee', icon: Ticket, label: 'My Invitation' }],
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
  
  const isRoleHomePage = pathname === `/super-admin` || pathname === `/protocol-admin` || pathname === `/protocol-officer` || pathname === `/guest-invitee`;

  const getAdjustedPath = (path: string) => {
    if (path === '/protocol-admin/events' || path === '/protocol-admin') return '/protocol-admin';
    return path;
  }
  
  const adjustedPathname = getAdjustedPath(pathname);
  
  const getNavItems = () => {
    if (role === 'Guest / Invitee') {
      return [{ href: '/guest-invitee/invitation/sample', icon: Ticket, label: 'My Invitation' }];
    }
    return currentNavItems;
  }
  
  const finalNavItems = getNavItems();


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
            {finalNavItems.map((item) => {
               let isActive = false;
               if (role === 'Protocol Admin / Event Manager') {
                 isActive = item.href === '/protocol-admin' ? adjustedPathname === '/protocol-admin' || pathname.startsWith('/protocol-admin/events') : pathname.startsWith(item.href);
               } else if (role === 'Super Admin / IT Admin') {
                 isActive = item.href === '/super-admin' ? (pathname === '/super-admin' || isRoleHomePage) : pathname.startsWith(item.href);
               } else if (role === 'Guest / Invitee') {
                 isActive = pathname.startsWith(item.href);
               }
               else {
                 isActive = pathname.startsWith(item.href);
               }
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4 text-center text-xs text-muted-foreground">
            &copy; 2024 Protocol Platform
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
             <Breadcrumbs />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Badge variant="outline" className="hidden sm:flex text-sm">
              {role}
            </Badge>
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User avatar" />
              <AvatarFallback>
                <UserCircle />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
