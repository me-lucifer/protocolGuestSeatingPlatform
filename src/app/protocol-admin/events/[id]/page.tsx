
'use client';

import { useParams } from 'next/navigation';
import { events, guests, type Event, type Guest } from '@/lib/data';
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
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { GuestListTab } from '@/components/protocol-admin/GuestListTab';
import { SeatingPlanTab } from '@/components/protocol-admin/SeatingPlanTab';
import { InvitationsTab } from '@/components/protocol-admin/InvitationsTab';
import { DayOfOperationsTab } from '@/components/protocol-admin/DayOfOperationsTab';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function EventDetailPage() {
  const params = useParams();
  const { id } = params;

  const [activeTab, setActiveTab] = useState('overview');
  const [guestToAssign, setGuestToAssign] = useState<Guest | null>(null);

  const event = events.find((e) => e.id === id);

  const eventGuests = useMemo(() => {
    return guests.filter((g) => g.eventId === id);
  }, [id]);

  const handleStartAssignment = (guest: Guest) => {
    setGuestToAssign(guest);
    setActiveTab('seating-plan');
  };

  const handleClearAssignment = () => {
    setGuestToAssign(null);
  };

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

  const rsvpSummary = useMemo(() => {
    if (!eventGuests) return { Accepted: 0, Declined: 0, Invited: 0 };
    return eventGuests.reduce(
      (acc, guest) => {
        acc[guest.rsvpStatus] = (acc[guest.rsvpStatus] || 0) + 1;
        return acc;
      },
      { Accepted: 0, Declined: 0, Invited: 0 } as Record<Guest['rsvpStatus'], number>
    )
  }, [eventGuests]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-4">
                <CardTitle className="page-title">{event.name}</CardTitle>
                <Badge variant={getStatusVariant(event.status)} className="capitalize">
                  {event.status}
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

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Event Management Hub</AlertTitle>
        <AlertDescription>
           Use the tabs to manage this event: <strong>Overview</strong> for stats, <strong>Guest List</strong> for attendees, <strong>Seating Plan</strong> for arrangement, <strong>Invitations</strong> for RSVPs, and <strong>Day-of Operations</strong> for live monitoring.
        </AlertDescription>
      </Alert>

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
                                <span className="absolute h-4 w-4 rounded-full bg-primary/30" />
                                <span className="relative block h-2 w-2 rounded-full bg-primary" />
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
