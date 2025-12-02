
'use client';

import { useParams } from 'next/navigation';
import { type Event, type Guest } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Users,
  ClipboardCheck,
  Info,
  Ticket,
  Archive,
} from 'lucide-react';
import { format } from 'date-fns';
import { useMemo, useState, useEffect } from 'react';
import { GuestListTab } from '@/components/protocol-admin/GuestListTab';
import { SeatingPlanTab } from '@/components/protocol-admin/SeatingPlanTab';
import { InvitationsTab } from '@/components/protocol-admin/InvitationsTab';
import { DayOfOperationsTab } from '@/components/protocol-admin/DayOfOperationsTab';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDemoData } from '@/contexts/DemoContext';
import { Skeleton } from '@/components/ui/skeleton';

// Handoff Note:
// This page uses a simulated loading state (`useState` and `useEffect` with a timeout)
// to demonstrate skeleton loading. In a production app, this would be replaced with a
// proper data fetching library (e.g., React Query, SWR) where the `isLoading` state
// would be managed by the library.
function EventDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardHeader>
      </Card>
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


// Handoff Note: This is the main page for managing a single event.
// It's a container for several tabs, each handling a different aspect of event management.
// The `useDemoData` hook is for the prototype; in production, this page would fetch
// event data from an API based on the `id` from the URL parameters (`useParams`).
// Each tab component (`GuestListTab`, `SeatingPlanTab`, etc.) would similarly fetch
// its own required data.
export default function EventDetailPage() {
  const params = useParams();
  const { id } = params;
  // Handoff Note: Using a demo context to get and manage data.
  // Replace with a data fetching library like React Query or SWR.
  const { events, guests } = useDemoData();
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');
  // Handoff Note: `guestToAssign` is a piece of local state used for the demo
  // to pass a guest from the GuestListTab to the SeatingPlanTab to initiate assignment.
  // A production implementation might use a more robust state management solution or URL state.
  const [guestToAssign, setGuestToAssign] = useState<Guest | null>(null);

  useEffect(() => {
    // Simulate data fetching for demo purposes
    const timer = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(timer);
  }, []);

  const event = useMemo(() => events.find((e) => e.id === id), [events, id]);

  const eventGuests = useMemo(() => {
    return guests.filter((g) => g.eventId === id);
  }, [guests, id]);

  useEffect(() => {
    // Handoff Note: This is a demo-specific check to simulate an expired or invalid invitation.
    // In production, this logic would likely be handled by a server or middleware
    // before the page even loads, redirecting based on the event's actual status.
    if (event?.status === 'Completed') {
      // Logic for admin is to show archived view, no redirect needed here.
    }
  }, [event]);

  const handleStartAssignment = (guest: Guest) => {
    setGuestToAssign(guest);
    setActiveTab('seating-plan');
  };

  const handleClearAssignment = () => {
    setGuestToAssign(null);
  };
  
  // Handoff Note: `rsvpSummary` is calculated on the client side for the demo.
  // In production, these aggregate values should be calculated on the backend
  // and fetched, or calculated via a performant client-side selector if using a state management library.
  const rsvpSummary = useMemo(() => {
    if (!eventGuests) return { Accepted: 0, Declined: 0, Invited: 0 };
    return eventGuests.reduce(
      (acc, guest) => {
        acc[guest.rsvpStatus] = (acc[guest.rsvpStatus] || 0) + 1;
        return acc;
      },
      { Accepted: 0, Declined: 0, Invited: 0, 'Not Invited': 0, 'Removed': 0 } as Record<Guest['rsvpStatus'], number>
    )
  }, [eventGuests]);

  if (loading) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested event could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = (status: Event['status']) => {
    switch (status) {
      case 'Live': return 'default';
      case 'Invitations Sent': return 'secondary';
      case 'Completed': return 'outline';
      case 'Draft': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <CardTitle className="page-title">{event.name}</CardTitle>
                <Badge variant={getStatusVariant(event.status)} className="capitalize">
                  {event.status}
                </Badge>
                <Badge variant="outline" className="hidden sm:flex">
                    <Ticket className="mr-2 h-4 w-4" />
                    Scenario: {event.type}
                </Badge>
              </div>
              <CardDescription as="div" className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-base">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(event.date), 'PPPP p')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.venue}</span>
                </div>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{eventGuests.length} Guests</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {event.status === 'Completed' ? (
         <Alert>
            <Archive className="h-4 w-4" />
            <AlertTitle>This event is archived</AlertTitle>
            <AlertDescription>
                Modifications are disabled (demo). You can view the final details and reports.
            </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Event Management Hub</AlertTitle>
          <AlertDescription>
            Use the tabs to manage this event: <strong>Overview</strong> for stats, <strong>Guest List</strong> for attendees, <strong>Seating Plan</strong> for arrangement, <strong>Invitations &amp; RSVPs</strong>, and <strong>Day-of Operations</strong> for live monitoring.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guest-list">Guest List</TabsTrigger>
          <TabsTrigger value="seating-plan">Seating Plan</TabsTrigger>
          <TabsTrigger value="invitations">Invitations &amp; RSVPs</TabsTrigger>
          <TabsTrigger value="day-of">Day-of Operations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 data-[state=active]:animate-fade-in">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="section-title">Event Overview</CardTitle>
                <CardDescription>Key statistics and timeline for this event.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{eventGuests.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{rsvpSummary['Accepted'] || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Pending</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{rsvpSummary['Invited'] || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Declined</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{rsvpSummary['Declined'] || 0}</div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                    <h3 className="text-base font-semibold text-foreground mb-2">Protocol Notes</h3>
                    <p className="text-sm text-muted-foreground">
                        This event involves multiple Heads of State. Seating precedence must be strictly followed. The press area is limited and requires special credentials. All dietary restrictions must be confirmed with the respective embassies two weeks prior to the event.
                    </p>
                </div>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="section-title">Event Timeline</CardTitle>
                    <CardDescription>Current stage of the event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"><ClipboardCheck className="h-4 w-4" /></div>
                            <span className="font-medium text-foreground">Draft Created</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"><ClipboardCheck className="h-4 w-4" /></div>
                            <span className="font-medium text-foreground">Guest List Imported</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"><ClipboardCheck className="h-4 w-4" /></div>
                            <span className="font-medium text-foreground">Invitations Sent</span>
                        </li>
                         <li className="flex items-center gap-3">
                            <div className="relative flex h-6 w-6 items-center justify-center">
                                <span className="absolute h-4 w-4 rounded-full bg-primary/30" aria-hidden="true" />
                                <span className="relative block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                            </div>
                            <span className="font-medium text-primary">RSVPs in Progress</span>
                        </li>
                        <li className="flex items-center gap-3">
                           <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/30" />
                            <span className="text-muted-foreground">Seating Finalized</span>
                        </li>
                        <li className="flex items-center gap-3">
                           <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/30" />
                            <span className="text-muted-foreground">Event Live</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guest-list" className="mt-6 data-[state=active]:animate-fade-in">
            <GuestListTab eventId={id as string} onAssignSeat={handleStartAssignment} />
        </TabsContent>
        <TabsContent value="seating-plan" className="mt-6 data-[state=active]:animate-fade-in">
            <SeatingPlanTab eventId={id as string} guestToAssign={guestToAssign} onAssignmentComplete={handleClearAssignment} />
        </TabsContent>
        <TabsContent value="invitations" className="mt-6 data-[state=active]:animate-fade-in">
            <InvitationsTab eventId={id as string} />
        </TabsContent>
        <TabsContent value="day-of" className="mt-6 data-[state=active]:animate-fade-in">
            <DayOfOperationsTab eventId={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
