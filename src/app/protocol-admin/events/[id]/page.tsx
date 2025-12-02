
'use client';

import { useParams } from 'next/navigation';
import { events, guests, type Event } from '@/lib/data';
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
  BarChart,
  Armchair,
  Mail,
  ClipboardCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import { useMemo } from 'react';

function PlaceholderContent({ title, icon: Icon }: { title: string, icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg">
      <Icon className="h-12 w-12 mb-4" />
      <h3 className="text-lg font-semibold section-title">Manage {title}</h3>
      <p className="mt-2 text-sm">
        This is a placeholder for the {title.toLowerCase()} management interface.
      </p>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const { id } = params;

  const event = events.find((e) => e.id === id);

  const eventGuests = useMemo(() => {
    return guests.filter((g) => g.eventId === id);
  }, [id]);

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

  const rsvpSummary = eventGuests.reduce(
    (acc, guest) => {
      acc[guest.rsvpStatus] = (acc[guest.rsvpStatus] || 0) + 1;
      return acc;
    },
    {} as Record<Event['status'], number>
  );

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
              <CardDescription className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-base">
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

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guest-list">Guest List</TabsTrigger>
          <TabsTrigger value="seating-plan">Seating Plan</TabsTrigger>
          <TabsTrigger value="invitations">Invitations &amp; RSVPs</TabsTrigger>
          <TabsTrigger value="day-of">Day-of Operations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="section-title">Event Overview</CardTitle>
              <CardDescription>Key statistics for this event.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guest-list" className="mt-6">
            <PlaceholderContent title="Guest List" icon={Users} />
        </TabsContent>
        <TabsContent value="seating-plan" className="mt-6">
            <PlaceholderContent title="Seating Plan" icon={Armchair} />
        </TabsContent>
        <TabsContent value="invitations" className="mt-6">
            <PlaceholderContent title="Invitations &amp; RSVPs" icon={Mail} />
        </TabsContent>
        <TabsContent value="day-of" className="mt-6">
            <PlaceholderContent title="Day-of Operations" icon={ClipboardCheck} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
