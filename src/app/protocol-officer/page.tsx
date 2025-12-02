
'use client';

import { useState, useMemo, useEffect } from 'react';
import { type Guest, type Event } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { Search, MapPin, ArrowLeft, QrCode, UserSearch, Star, Clock, WifiOff, MoreVertical, DoorOpen } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useDemoData } from '@/contexts/DemoContext';


function EventSelection({ onSelectEvent }: { onSelectEvent: (event: Event) => void }) {
  const { events } = useDemoData();
  const upcomingEvents = events.filter(e => e.status !== 'Completed');

  const getStatusVariant = (status: Event['status']) => {
    switch (status) {
      case 'Live': return 'default';
      case 'Invitations Sent': return 'secondary';
      case 'Draft': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="border-0 shadow-none rounded-none bg-transparent">
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


function ManualCheckIn({ event, onBack, isOffline }: { event: Event, onBack: () => void, isOffline: boolean }) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { guests: allGuests } = useDemoData();
  
  const localGuests = useMemo(() => allGuests.filter(g => g.eventId === event.id), [allGuests, event.id]);

  const filteredGuests = localGuests.filter(
    (guest) =>
      guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusVariant = (status: Guest['checkInStatus']) => {
    switch (status) {
      case 'Checked-in':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const handleGuestSelect = (guestId: string) => {
    if (isOffline) {
        toast({
            title: "Offline Mode (Demo)",
            description: "Check-in will be synced when you're back online.",
        });
    }
    router.push(`/protocol-officer/scan-result?guestId=${guestId}`);
  };

  return (
    <Card className="border-0 shadow-none rounded-none bg-transparent">
      <CardHeader className="pt-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="justify-start pl-0 mb-2 w-fit h-auto">
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
                <TableHead>Guest</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id} onClick={() => handleGuestSelect(guest.id)} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <div>{guest.fullName}</div>
                    <div className="text-xs text-muted-foreground">{guest.organization}</div>
                    <Badge variant="outline" className="mt-1">{guest.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusVariant(guest.checkInStatus)}>
                      {guest.checkInStatus}
                    </Badge>
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

function CheckInDashboard({ event, onBack, onShowManual, onStartScan }: { event: Event, onBack: () => void, onShowManual: () => void, onStartScan: () => void}) {
    const { guests: allGuests } = useDemoData();
    const eventGuests = useMemo(() => allGuests.filter(g => g.eventId === event.id), [allGuests, event.id]);

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
            .filter(g => g.eventId === event.id && g.checkInStatus === 'Checked-in' && g.checkInTime)
            .sort((a,b) => new Date(b.checkInTime!).getTime() - new Date(a.checkInTime!).getTime())
            .slice(0, 10);
    }, [event.id, allGuests]);


    return (
        <div className="flex flex-col h-full bg-muted/20">
            <Card className="border-0 shadow-none rounded-none bg-transparent">
                 <CardHeader className="pt-2">
                    <Button variant="ghost" size="sm" onClick={onBack} className="justify-start pl-0 mb-2 w-fit h-auto">
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
                        <Button size="lg" className="w-full h-16 text-lg" onClick={onStartScan}>
                            <QrCode className="mr-4" />
                            Start Scanning
                        </Button>
                        <Button size="lg" variant="secondary" className="w-full" onClick={onShowManual}>
                            <UserSearch />
                            Find Guest Manually
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-auto bg-background p-3 flex flex-col border-t">
                <h3 className="text-sm font-semibold mb-2 px-1">Recent Check-ins</h3>
                <ScrollArea className="h-48">
                    <div className="space-y-2 pr-4">
                        {recentCheckIns.length > 0 ? (
                            recentCheckIns.map(guest => (
                                <div key={guest.id} className={cn("flex items-center justify-between bg-muted/50 p-2 rounded-md text-xs", guest.category === 'VIP' && "border-l-4 border-yellow-400")}>
                                    <div>
                                        <div className="font-medium flex items-center gap-1.5">
                                            {guest.category === 'VIP' && <Star className="h-3 w-3 text-yellow-500" />}
                                            {guest.fullName}
                                        </div>
                                        <Badge variant="outline" className="mt-1">{guest.category}</Badge>
                                    </div>
                                    <div className="text-muted-foreground flex items-center">
                                        <Clock className="mr-1 h-3 w-3" />
                                        <span>{format(new Date(guest.checkInTime!), 'HH:mm')}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-xs text-muted-foreground p-2">No check-ins yet.</p>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

function QRScanner({ onBack, isOffline }: { onBack: () => void, isOffline: boolean }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleSimulateScan = (guestId: string) => {
    if (isOffline) {
        toast({
            title: "Offline Mode (Demo)",
            description: "Scan data captured. Will sync when online.",
        });
    }
    router.push(`/protocol-officer/scan-result?guestId=${guestId}`);
  };

  return (
    <Card className="border-0 shadow-none rounded-none h-full flex flex-col bg-transparent">
      <CardHeader className="pt-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="justify-start pl-0 mb-2 w-fit h-auto">
            <ArrowLeft className="mr-2" />
            Back to Dashboard
        </Button>
        <CardTitle className="text-xl font-bold tracking-tight">Scan QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center">
        <div className="w-64 h-64 bg-muted border-4 border-dashed rounded-lg flex items-center justify-center animate-pulse">
           <QrCode className="h-16 w-16 text-muted-foreground" />
        </div>
        <p className="mt-4 text-center text-muted-foreground">
          Point the camera at a guest's QR code.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground mb-2">For demo purposes:</p>
        <Button size="sm" className="w-full" onClick={() => handleSimulateScan('gst-002')}>Simulate: VIP Guest</Button>
        <Button size="sm" className="w-full" variant="secondary" onClick={() => handleSimulateScan('gst-007')}>Simulate: Regular Guest</Button>
        <Button size="sm" className="w-full" variant="destructive" onClick={() => handleSimulateScan('unknown')}>Simulate: Unknown Code</Button>
      </CardFooter>
    </Card>
  );
}


export default function ProtocolOfficerInterface() {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [view, setView] = useState<'event_selection' | 'dashboard' | 'manual_checkin' | 'qr_scanner'>('event_selection');
  const [isOffline, setIsOffline] = useState(false);
  const [entrance, setEntrance] = useState('A');
  const { toast } = useToast();
  const { guests } = useDemoData();
  
  // This state is just to trigger re-renders on children when data changes.
  const [_, setForceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
        if (activeEvent) {
             setForceUpdate(v => v + 1);
        }
    }, 2000);
    return () => clearInterval(interval);
  }, [activeEvent]);

  useEffect(() => {
    if (isOffline) {
        toast({
            title: "Offline Mode Enabled (Demo)",
            description: "Actions will be synced when connection is restored.",
        });
    }
  }, [isOffline, toast]);


  const handleSelectEvent = (event: Event) => {
    setActiveEvent(event);
    setView('dashboard');
  }

  const handleBackToEvents = () => {
    setActiveEvent(null);
    setView('event_selection');
  }
  
  const handleShowManual = () => {
    setView('manual_checkin');
  }
  
  const handleStartScan = () => {
      setView('qr_scanner');
  }

  const handleBackToDashboard = () => {
      setView('dashboard');
  }

  const getHeaderTitle = () => {
    if (!activeEvent) return "Select Event";
    return activeEvent.name;
  }

  const renderContent = () => {
      if (activeEvent) {
        switch(view) {
            case 'dashboard':
                return <div className="animate-fade-in"><CheckInDashboard event={activeEvent} onBack={handleBackToEvents} onShowManual={handleShowManual} onStartScan={handleStartScan} /></div>;
            case 'manual_checkin':
                return <div className="animate-fade-in"><ManualCheckIn event={activeEvent} onBack={handleBackToDashboard} isOffline={isOffline} /></div>;
            case 'qr_scanner':
                return <div className="animate-fade-in"><QRScanner onBack={handleBackToDashboard} isOffline={isOffline} /></div>;
            default:
                 setView('dashboard');
                 return <div className="animate-fade-in"><CheckInDashboard event={activeEvent} onBack={handleBackToEvents} onShowManual={handleShowManual} onStartScan={handleStartScan} /></div>;
        }
    }
    return <div className="animate-fade-in"><EventSelection onSelectEvent={handleSelectEvent} /></div>;
  }

  return (
    // This layout is optimized for a demo video on a desktop but emulates a phone UI.
    <div className="relative mx-auto h-[80vh] max-h-[800px] w-full max-w-sm overflow-hidden rounded-2xl border-8 border-neutral-800 bg-background shadow-2xl flex flex-col">
        <div className="absolute inset-x-0 top-0 z-10 h-6 w-full rounded-t-lg bg-neutral-800">
            <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-neutral-600"></div>
        </div>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-muted/60 px-3 pt-6">
            <div className="flex items-center gap-2 font-semibold text-foreground">
                {isOffline && <WifiOff className="h-4 w-4 text-muted-foreground animate-pulse" />}
                 <DoorOpen className="h-4 w-4 text-muted-foreground" />
                <p className="truncate">{activeEvent ? `Entrance ${entrance}` : 'Select Event'}</p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical />
                        <span className="sr-only">Options</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Officer Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={entrance} onValueChange={setEntrance}>
                        <DropdownMenuRadioItem value="A">Entrance A</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="B">Entrance B</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={isOffline}
                        onCheckedChange={setIsOffline}
                    >
                        Offline demo mode
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>

        {isOffline && (
            <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-xs text-center p-1.5 animate-pulse">
                Connection unstable - actions will be synced when online.
            </div>
        )}

        <div className="h-full w-full overflow-y-auto">
            {renderContent()}
        </div>
    </div>
  )
}
