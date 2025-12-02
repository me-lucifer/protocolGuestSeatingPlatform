
'use client';

import { useState, useMemo } from 'react';
import { guests as allGuests, events as allEvents, type Guest, type Event } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Search, MapPin, ArrowLeft, QrCode, UserSearch, Users, UserCheck, Clock } from 'lucide-react';
import { format } from 'date-fns';
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


function EventSelection({ onSelectEvent }: { onSelectEvent: (event: Event) => void }) {
  const upcomingEvents = allEvents.filter(e => e.status !== 'Completed');

  const getStatusVariant = (status: Event['status']) => {
    switch (status) {
      case 'Live': return 'default';
      case 'Invitations Sent': return 'secondary';
      case 'Draft': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="border-0 shadow-none rounded-none">
      <CardHeader className="pt-2">
        <CardTitle className="text-xl font-bold tracking-tight">Select Event</CardTitle>
        <CardDescription>Choose an event to manage check-in.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingEvents.map(event => (
          <AlertDialog key={event.id}>
            <AlertDialogTrigger asChild>
                <Card className="w-full text-left hover:bg-accent cursor-pointer transition-colors">
                    <CardHeader>
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        <div className="flex items-center justify-between">
                            <CardDescription>{format(new Date(event.date), 'PPPP')}</CardDescription>
                             <Badge variant={getStatusVariant(event.status)} className="capitalize">
                                {event.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.venue}</span>
                        </div>
                    </CardContent>
                </Card>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Start check-in for this event?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to start managing check-ins for the event: <strong>{event.name}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onSelectEvent(event)}>Proceed to Check-in</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </CardContent>
    </Card>
  );
}


function ManualCheckIn({ event, onBack, setGuestList }: { event: Event, onBack: () => void, setGuestList: React.Dispatch<React.SetStateAction<Guest[]>> }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localGuests, setLocalGuests] = useState(() => allGuests.filter(g => g.eventId === event.id));
  const { toast } = useToast();

  const handleCheckIn = (guestId: string) => {
    let guestName = '';
    
    // Update local state for immediate feedback
    const updatedLocalGuests = localGuests.map((guest) => {
      if (guest.id === guestId) {
        guestName = guest.fullName;
        return { ...guest, checkInStatus: 'Checked-in' as const };
      }
      return guest;
    });
    setLocalGuests(updatedLocalGuests);

    // Update the "global" mock data state
    setGuestList(prevList => prevList.map(g => 
        g.id === guestId ? { ...g, checkInStatus: 'Checked-in' as const } : g
    ));

    toast({
      title: 'Saved (demo only)',
      description: `${guestName} has been checked in.`,
    });
  };

  const filteredGuests = localGuests.filter(
    (guest) =>
      guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-none rounded-none">
      <CardHeader className="pt-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="justify-start pl-0 mb-2 w-fit">
            <ArrowLeft className="mr-2" />
            Back to Dashboard
        </Button>
        <CardTitle className="text-xl font-bold tracking-tight">Manual Check-in</CardTitle>
        <CardDescription>
          Find a guest by name or organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guest list..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Seat</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    <div>{guest.fullName}</div>
                    <div className="text-xs text-muted-foreground">{guest.organization}</div>
                  </TableCell>
                  <TableCell className="font-mono">{guest.seatAssignment || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleCheckIn(guest.id)}
                      disabled={guest.checkInStatus === 'Checked-in'}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {guest.checkInStatus === 'Checked-in' ? 'Checked-in' : 'Check In'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredGuests.length === 0 && (
                <div className="text-center text-muted-foreground p-8">
                    No guests found matching your criteria.
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

function CheckInDashboard({ event, onBack, onShowManual, setGuestList }: { event: Event, onBack: () => void, onShowManual: () => void, setGuestList: React.Dispatch<React.SetStateAction<Guest[]>> }) {
    const { toast } = useToast();

    const eventGuests = useMemo(() => allGuests.filter(g => g.eventId === event.id), [event.id]);

    const stats = useMemo(() => {
        const expected = eventGuests.filter(g => g.rsvpStatus === 'Accepted').length;
        const checkedIn = eventGuests.filter(g => g.checkInStatus === 'Checked-in').length;
        return {
            expected,
            checkedIn,
            remaining: expected - checkedIn,
        };
    }, [eventGuests]);
    
    const recentCheckIns = useMemo(() => {
        return allGuests
            .filter(g => g.eventId === event.id && g.checkInStatus === 'Checked-in')
            .sort((a,b) => a.fullName.localeCompare(b.fullName)) // deterministic for demo
            .slice(0, 3);
    }, [event.id]);

    const handleStartScan = () => {
        toast({
            title: "Scanner not implemented",
            description: "In a real app, this would open the camera to scan QR codes.",
            variant: "default",
        });
    }

    return (
        <div className="flex flex-col h-full">
            <Card className="border-0 shadow-none rounded-none">
                 <CardHeader className="pt-2">
                    <Button variant="ghost" size="sm" onClick={onBack} className="justify-start pl-0 mb-2 w-fit">
                        <ArrowLeft className="mr-2" />
                        Back to Events
                    </Button>
                    <CardTitle className="text-xl font-bold tracking-tight">Check-in</CardTitle>
                    <CardDescription>
                        {event.name}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <Card>
                            <CardHeader className="p-2 pb-0">
                                <CardTitle className="text-2xl">{stats.expected}</CardTitle>
                                <CardDescription className="text-xs">Expected</CardDescription>
                            </CardHeader>
                        </Card>
                         <Card>
                            <CardHeader className="p-2 pb-0">
                                <CardTitle className="text-2xl text-green-600">{stats.checkedIn}</CardTitle>
                                <CardDescription className="text-xs">Checked-in</CardDescription>
                            </CardHeader>
                        </Card>
                         <Card>
                            <CardHeader className="p-2 pb-0">
                                <CardTitle className="text-2xl">{stats.remaining}</CardTitle>
                                <CardDescription className="text-xs">Remaining</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    <div className="space-y-3">
                        <Button size="lg" className="w-full h-16 text-lg" onClick={handleStartScan}>
                            <QrCode className="mr-4" />
                            Start Scanning QR
                        </Button>
                        <Button size="lg" variant="secondary" className="w-full" onClick={onShowManual}>
                            <UserSearch />
                            Find Guest Manually
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-auto bg-muted/50 p-3">
                <h3 className="text-sm font-semibold mb-2 px-1">Recent Check-ins</h3>
                <div className="space-y-2">
                    {recentCheckIns.length > 0 ? (
                        recentCheckIns.map(guest => (
                            <div key={guest.id} className="flex items-center justify-between bg-background p-2 rounded-md text-xs">
                                <div className="font-medium">{guest.fullName}</div>
                                <div className="text-muted-foreground flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    <span>{format(new Date(), 'HH:mm')}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-xs text-muted-foreground p-2">No check-ins yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}


export default function ProtocolOfficerInterface() {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [view, setView] = useState<'dashboard' | 'manual_checkin'>('dashboard');
  
  // This state is passed down to children to update the "global" mock data
  const [guestList, setGuestList] = useState<Guest[]>(allGuests);

  const handleSelectEvent = (event: Event) => {
    setActiveEvent(event);
    setView('dashboard');
  }

  const handleBackToEvents = () => {
    setActiveEvent(null);
  }
  
  const handleShowManual = () => {
    setView('manual_checkin');
  }

  const handleBackToDashboard = () => {
      setView('dashboard');
  }

  if (activeEvent) {
    if (view === 'manual_checkin') {
      return <ManualCheckIn event={activeEvent} onBack={handleBackToDashboard} setGuestList={setGuestList} />;
    }
    return <CheckInDashboard event={activeEvent} onBack={handleBackToEvents} onShowManual={handleShowManual} setGuestList={setGuestList} />;
  }

  return <EventSelection onSelectEvent={handleSelectEvent} />;
}
