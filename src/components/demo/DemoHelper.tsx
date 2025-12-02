'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  LifeBuoy,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Ticket,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const demoRoutes = [
  {
    href: '/super-admin',
    icon: ShieldCheck,
    label: 'Super Admin Dashboard',
    description: 'Platform-wide settings and tools.',
  },
  {
    href: '/protocol-admin',
    icon: Briefcase,
    label: 'Protocol Admin Dashboard',
    description: 'Event and guest management.',
  },
  {
    href: '/protocol-officer',
    icon: UserCheck,
    label: 'Protocol Officer Check-in',
    description: 'On-site guest check-in interface.',
  },
  {
    href: '/guest-invitee/invitation/sample',
    icon: Ticket,
    label: 'Guest Invitation View',
    description: 'What the event guest sees.',
  },
];

export function DemoHelper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg border-2 border-primary/20 bg-background/80 backdrop-blur-md hover:bg-accent"
        >
          <LifeBuoy className="h-6 w-6 text-primary" />
          <span className="sr-only">Open Demo Helper</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Protocol Platform Demo</SheetTitle>
          <SheetDescription>
            This is an interactive prototype. Use the links below to quickly navigate between the different user roles and key screens.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Quick Navigation</h3>
          {demoRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg p-3 transition-colors hover:bg-accent"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-md bg-muted p-2">
                    <route.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{route.label}</p>
                    <p className="text-sm text-muted-foreground">{route.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
