
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
  Route,
  ListChecks,
  RotateCcw,
  TimerOff,
} from 'lucide-react';
import Link from 'next/link';
import { useTour } from '@/contexts/TourContext';
import { useDemo, useDemoData } from '@/contexts/DemoContext';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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

const demoScriptSteps = [
    'Choose Protocol Admin and open the main demo event.',
    'Show the guest list and then the seating plan.',
    'Switch to the Guest journey to RSVP.',
    'Switch to the Officer mobile view to perform a check-in.',
    'Return to the Admin Day-of Operations tab to see the live effect.'
]

// Handoff Note: This entire component is for demonstration purposes.
// It provides a quick way to navigate the prototype and access demo-specific features
// like the guided tour and data reset. It should be completely removed in a
// production build.
export function DemoHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { startTour } = useTour();
  const { isDemoMode, setIsDemoMode } = useDemo();
  const { resetDemoData } = useDemoData();
  const { toast } = useToast();

  const handleStartTour = () => {
    setIsOpen(false);
    startTour();
  }

  const handleReset = () => {
    resetDemoData();
    toast({
        title: 'Demo Data Reset',
        description: 'All prototype data has been reset to its initial state.'
    });
  }

  const handleSimulateTimeout = () => {
    setIsOpen(false);
    router.push('/session-expired');
  }
  
  if (!isDemoMode) {
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
                <SheetTitle>Demo Helper</SheetTitle>
                <SheetDescription>
                    Enable demo mode to access helpers and navigation shortcuts.
                </SheetDescription>
            </SheetHeader>
            <div className="mt-6 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="demo-mode-switch" className="font-semibold">Enable Demo Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Shows helpers and guides for the demo.
                  </p>
                </div>
                <Switch
                    id="demo-mode-switch"
                    checked={isDemoMode}
                    onCheckedChange={setIsDemoMode}
                />
            </div>
         </SheetContent>
       </Sheet>
    )
  }

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
            This is an interactive prototype. Use the links and script below to guide your demonstration.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-2">
            <Button className="w-full" onClick={handleStartTour}>
                <Route />
                Start Guided Tour
            </Button>

            <Separator className="!my-4" />
            
             <h3 className="mb-3 text-sm font-medium text-muted-foreground flex items-center gap-2"><ListChecks /> Demo Script Outline</h3>
            <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
                {demoScriptSteps.map((step, index) => (
                    <li key={index} className="text-muted-foreground">{step}</li>
                ))}
            </ol>

            <Separator className="!my-4" />

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

            <Separator className="!my-4" />

            <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={handleSimulateTimeout}>
                    <TimerOff /> Simulate Session Timeout
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                            <RotateCcw /> Reset Demo Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will reset all events, guests, and seating assignments to their original state. This cannot be undone within the current session.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReset}>Yes, reset data</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

             <div className="flex items-center justify-between rounded-lg border p-4 mt-4">
                <div>
                  <Label htmlFor="demo-mode-switch-panel" className="font-semibold">Demo Mode Active</Label>
                </div>
                <Switch
                    id="demo-mode-switch-panel"
                    checked={isDemoMode}
                    onCheckedChange={setIsDemoMode}
                />
            </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
