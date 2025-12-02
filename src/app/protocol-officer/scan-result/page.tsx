
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { type Guest, type Event } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Armchair, ArrowLeft, Bell, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { useDemoData } from '@/contexts/DemoContext';

function SuccessResult({ guest, onConfirm, confirmed }: { guest: Guest, onConfirm: () => void, confirmed: boolean }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
      <CardTitle className="text-2xl mb-2">{confirmed ? 'Check-in Confirmed' : 'Guest Found'}</CardTitle>
      <p className="text-xl font-semibold text-foreground">{guest.fullName}</p>
      <p className="text-muted-foreground">{guest.organization}</p>
      <Badge variant="outline" className="mt-4">{guest.category}</Badge>
      
      {confirmed && guest.category === 'VIP' && (
        <Alert className="mt-6 text-left border-yellow-400 bg-yellow-50">
            <Bell className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">VIP Guest Checked-in (demo)</AlertTitle>
            <AlertDescription className="text-yellow-700">
                In a real app, this could trigger a notification to the head of protocol.
            </AlertDescription>
        </Alert>
      )}

      <Card className="w-full mt-6 text-left">
          <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Armchair /> Seating Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            {guest.seatAssignment ? (
                <p className="text-4xl font-bold text-primary font-mono text-center">{guest.seatAssignment}</p>
            ) : (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No Seat Assigned</AlertTitle>
                    <AlertDescription>
                        Please contact the Protocol Admin for assistance.
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
      </Card>
      
      <div className="w-full mt-6 space-y-2">
        {confirmed ? (
             <Button size="lg" className="w-full" onClick={() => router.push('/protocol-officer')}>
                Scan Next Guest
            </Button>
        ) : (
            <Button size="lg" className="w-full" onClick={onConfirm}>
                Confirm Check-in
            </Button>
        )}
      </div>
    </div>
  );
}

function DuplicateScanResult({ guest, onReEnter }: { guest: Guest, onReEnter: () => void }) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center text-center">
      <History className="w-20 h-20 text-amber-500 mb-4" />
      <CardTitle className="text-2xl mb-2">Guest Already Checked-in</CardTitle>
      <p className="text-lg font-semibold text-foreground">{guest.fullName}</p>
      <p className="text-muted-foreground">
        First checked in at: {guest.checkInTime ? format(new Date(guest.checkInTime), 'p') : 'Unknown time'}
      </p>

      <div className="w-full mt-8 space-y-2">
        <Button size="lg" className="w-full" onClick={onReEnter}>
          Allow Re-entry (demo)
        </Button>
        <Button size="lg" variant="secondary" className="w-full" onClick={() => router.push('/protocol-officer')}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function ErrorResult({ title, message, icon: Icon }: { title: string; message: string; icon: React.ElementType }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center">
      <Icon className="w-20 h-20 text-destructive mb-4" />
      <CardTitle className="text-2xl mb-2">{title}</CardTitle>
      <p className="text-muted-foreground">{message}</p>
       <div className="w-full mt-6 space-y-2">
          <Button size="lg" className="w-full" onClick={() => router.push('/protocol-officer')}>
            Scan Again
          </Button>
          <Button size="lg" variant="secondary" className="w-full" onClick={() => router.push('/protocol-officer')}>
            Find Guest Manually
          </Button>
      </div>
    </div>
  );
}

export default function ScanResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { guests: allGuests, events: allEvents, setGuests } = useDemoData();
  const guestId = searchParams.get('guestId');
  const isDuplicate = searchParams.get('duplicate') === 'true';

  const [guest, setGuest] = useState<Guest | null | undefined>(undefined);
  const [event, setEvent] = useState<Event | null | undefined>(undefined);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const foundGuest = allGuests.find(g => g.id === guestId);
    setGuest(foundGuest || null);
    if (foundGuest) {
        const foundEvent = allEvents.find(e => e.id === foundGuest.eventId);
        setEvent(foundEvent || null);
    }
  }, [guestId, allGuests, allEvents]);


  const handleConfirm = () => {
    if (guest && event) {
        if (guest.checkInStatus === 'Checked-in') {
            router.push(`/protocol-officer/scan-result?guestId=${guest.id}&duplicate=true`);
            return;
        }

        setGuests(prevGuests => {
            return prevGuests.map(g => {
                if (g.id === guest.id) {
                    const checkInTime = new Date();
                    const eventStartTime = new Date(event.date);
                    const isLate = checkInTime > eventStartTime;
                    return {
                        ...g,
                        checkInStatus: 'Checked-in',
                        checkInTime: checkInTime.toISOString(),
                        isLate,
                    }
                }
                return g;
            });
        });

        setConfirmed(true);
        toast({
            title: "Check-in Confirmed",
            description: `${guest.fullName} is now checked in.`,
        });
    }
  }
  
  const handleReEnter = () => {
    if (guest) {
      toast({
        title: "Re-entry Confirmed (Demo)",
        description: `${guest.fullName} was allowed re-entry. This action would be logged.`,
      });
      router.push('/protocol-officer');
    }
  }

  const renderResult = () => {
    if (guest === undefined) {
      return <div className="text-center text-muted-foreground">Loading...</div>;
    }

    if (!guestId) {
      return <ErrorResult title="Scan Error" message="No guest information was provided." icon={AlertTriangle} />;
    }
    
    if (guestId === 'unknown' || !guest) {
      return <ErrorResult title="Unknown Code" message="This QR code is not valid for this event." icon={XCircle} />;
    }
    
    if (guest.checkInStatus === 'Checked-in' && !confirmed) {
      return <DuplicateScanResult guest={guest} onReEnter={handleReEnter} />;
    }

    return <SuccessResult guest={guest} onConfirm={handleConfirm} confirmed={confirmed} />;
  };

  return (
    <div className="relative mx-auto h-[80vh] max-h-[800px] w-full max-w-sm overflow-hidden rounded-2xl border-8 border-neutral-800 bg-background shadow-2xl flex flex-col">
       <div className="absolute inset-x-0 top-0 z-10 h-6 w-full rounded-t-lg bg-neutral-800">
            <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-neutral-600"></div>
        </div>
      <Card className="border-0 shadow-none rounded-none flex-1 mt-6 bg-transparent">
        <CardHeader className="pt-2">
            <CardTitle className="text-xl font-bold tracking-tight">Scan Result</CardTitle>
        </CardHeader>
        <CardContent>
          {renderResult()}
        </CardContent>
      </Card>
      <CardFooter className="mt-auto p-4 border-t bg-muted/30">
        <Button size="lg" variant="secondary" className="w-full" onClick={() => router.push('/protocol-officer')}>
            <ArrowLeft className="mr-2" />
            Back to Dashboard
        </Button>
      </CardFooter>
    </div>
  );
}
