
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
  Warehouse,
  Palette,
  ScrollText,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumbs } from './Breadcrumbs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useTour } from '@/contexts/TourContext';
import { useDemo } from '@/contexts/DemoContext';


type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

const navItems: { [key: string]: NavItem[] } = {
  'Super Admin / IT Admin': [
    { href: '/super-admin', icon: Settings, label: 'Dashboard' },
    { href: '/super-admin/organizations', icon: Warehouse, label: 'Organizations' },
    { href: '/super-admin/users', icon: Users, label: 'Users & Roles' },
    { href: '/super-admin/branding', icon: Palette, label: 'Branding' },
    { href: '/super-admin/settings', icon: Settings, label: 'Settings' },
    { href: '/super-admin/audit', icon: ScrollText, label: 'Audit & Logs' },
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

function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1">
            <Button
                variant={language === 'en' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                className="px-2"
            >
                EN
            </Button>
            <Button
                variant={language === 'fr' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('fr')}
                className="px-2"
            >
                FR
            </Button>
        </div>
    );
}

function GuestNav() {
    const { t } = useLanguage();
    const pathname = usePathname();

    const getNavLabel = (labelKey: string) => {
        if (labelKey === 'My Invitation') return t.openSampleInvitation;
        return labelKey;
    }
    
    const getNavItems = () => {
       return [{ href: '/guest-invitee/invitation/sample', icon: Ticket, label: 'My Invitation' }];
    }
    
    const finalNavItems = getNavItems();

    return (
        <>
            <Separator className="my-2" />
            {finalNavItems.map((item) => {
               let isActive = pathname.startsWith('/guest-invitee/invitation');
               
              return (
                <SidebarMenuItem key={item.label} id="tour-step-4">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      {getNavLabel(item.label)}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
        </>
    );
}


export function PageShell({
  role,
  children,
}: {
  role: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { isTourActive, TourStep } = useTour();
  const { isDemoMode } = useDemo();
  
  const currentNavItems = navItems[role] || [];
  
  const isRoleHomePage = pathname === `/super-admin` || pathname === `/protocol-admin` || pathname === `/protocol-officer` || pathname === `/guest-invitee`;

  const getAdjustedPath = (path: string) => {
    if (path === '/protocol-admin/events' || path === '/protocol-admin') return '/protocol-admin';
    return path;
  }
  
  const adjustedPathname = getAdjustedPath(pathname);
  
  const isMobileEmulation = role === 'Protocol Officer / Entrance Agent';

  return (
    <div className="page-shell-container">
      <SidebarProvider>
        {isTourActive && <TourStep />}
        <Sidebar className={cn(isMobileEmulation && 'hidden')}>
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
                    {role === 'Guest / Invitee' ? <GuestBackButtonText /> : 'Back to Roles'}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {role === 'Guest / Invitee' ? (
                  <GuestNav />
              ) : (
                  <>
                  <Separator className="my-2" />
                  {currentNavItems.map((item) => {
                    let isActive = false;
                    if (role === 'Protocol Admin / Event Manager') {
                      isActive = item.href === '/protocol-admin' ? adjustedPathname === '/protocol-admin' || pathname.startsWith('/protocol-admin/events') : pathname.startsWith(item.href);
                    } else if (role === 'Super Admin / IT Admin') {
                      isActive = item.href === '/super-admin' ? (pathname === '/super-admin' && isRoleHomePage) : pathname.startsWith(item.href);
                    } else {
                      isActive = pathname.startsWith(item.href);
                    }
                    return (
                      <SidebarMenuItem key={item.label} id={item.href === '/protocol-officer' ? 'tour-step-5' : ''}>
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
                  </>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4 text-center text-xs text-muted-foreground">
              &copy; 2024 Protocol Platform
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className={cn(
              "sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6",
              isMobileEmulation && "hidden"
          )}>
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <Breadcrumbs />
            </div>
            <div className="flex items-center gap-4 ml-auto">
              {role === 'Guest / Invitee' && <LanguageToggle />}
              {isDemoMode && <Badge variant="destructive">DEMO</Badge>}
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
          <main className={cn(
              "flex-1 p-4 sm:p-6",
              isMobileEmulation && 'p-0'
              )}>
            <div id="main-content" className={cn("mx-auto w-full max-w-7xl", isMobileEmulation && 'max-w-full h-full')}>
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

function GuestBackButtonText() {
    const { t } = useLanguage();
    return <>{t.backToRoleSelection}</>;
}
