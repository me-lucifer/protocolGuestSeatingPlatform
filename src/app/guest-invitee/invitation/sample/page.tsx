
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Shirt, Mail, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { GuestTimeline } from '@/components/guest/GuestTimeline';
import { useDemoData } from '@/contexts/DemoContext';
import { useMemo, useEffect } from 'react';

export default function GuestInviteeInvitationView() {
  const router = useRouter();
  const { t } = useLanguage();
  const { events, guests, setGuests } = useDemoData();

  // Handoff Note: For the demo, we are showing two different "sample" guests
  // One is a regular VIP, the other is one who has been "removed"
  const guest = useMemo(() => guests.find((g) => g.id === 'gst-002'), [guests]);
  // const guest = useMemo(() => guests.find((g) => g.id === 'gst-014'), [guests]); 
  
  const event = useMemo(() => events.find((e) => e.id === guest?.eventId), [events, guest]);

  useEffect(() => {
    // Handoff Note: This is a demo-specific check to simulate an expired or invalid invitation.
    // In production, this logic would likely be handled by a server or middleware
    // before the page even loads, redirecting based on the event's actual status.
    if (event?.status === 'Completed') {
      router.replace('/guest-invitee/invitation/error?reason=expired');
    }
    if (guest?.rsvpStatus === 'Removed') {
      router.replace('/guest-invitee/invitation/error?reason=removed');
    }
  }, [event, guest, router]);

  if (!guest) {
    return (
      <div className="flex justify-center items-start p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sample guest details could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event || event.status === 'Completed' || guest.rsvpStatus === 'Removed') {
    // This check prevents rendering while the redirect is happening.
    return null;
  }

  const handleAccept = () => {
    setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, rsvpStatus: 'Accepted' } : g));
    router.push('/guest-invitee/invitation/confirmed');
  };

  const handleDecline = () => {
    setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, rsvpStatus: 'Declined' } : g));
    router.push('/guest-invitee/invitation/declined');
  };

  const rsvpStatus = guest.rsvpStatus;

  return (
    <div className="flex justify-center items-start p-0 sm:p-4">
      <Card className="max-w-2xl w-full shadow-lg rounded-lg">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
          <GuestTimeline currentStepKey="respond" className="mb-4" />
          <CardTitle className="text-3xl font-headline text-primary">
            {event.name}
          </CardTitle>
          <CardDescription>
            {t.cordiallyInvited}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {rsvpStatus !== 'Invited' && (
            <Alert variant={rsvpStatus === 'Declined' ? 'destructive' : 'default'} className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>{t.alreadyResponded}</AlertTitle>
              <AlertDescription>
                {rsvpStatus === 'Accepted'
                  ? t.attendanceConfirmed
                  : t.invitationDeclined}
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <p className="font-semibold text-lg text-foreground">
              {t.dear} {guest.title} {guest.fullName.split(' ').slice(-1)},
            </p>
            <p className="mt-2 text-muted-foreground">
              {t.invitationBody.replace('{eventName}', event.name)}
            </p>
          </div>

          <div className="space-y-6 text-muted-foreground border-t border-b py-6">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-4 mt-1 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">{t.date}</p>
                <p>{format(new Date(event.date), 'eeee, MMMM do, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-4 mt-1 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">{t.time}</p>
                <p>{format(new Date(event.date), 'p')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-4 mt-1 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">{t.venue}</p>
                <p>{event.venue}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Shirt className="h-5 w-5 mr-4 mt-1 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">{t.dressCode}</p>
                <p>{t.dressCodeValue}</p>
              </div>
            </div>
          </div>
           {rsvpStatus === 'Declined' && (
             <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">{t.contactProtocolIfChanged}</p>
                <Button variant="link" asChild className="mt-1">
                    <Link href="mailto:protocol-office@example.com"><Mail /> {t.contactProtocol}</Link>
                </Button>
            </div>
           )}
          <p className="text-xs text-muted-foreground mt-6 text-center">
            {t.prototypeNote}
          </p>
        </CardContent>
        <CardFooter className="p-6 bg-muted/30 rounded-b-lg flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex-1 w-full text-center">
                <Button size="lg" className="w-full sm:w-auto" onClick={handleAccept} disabled={rsvpStatus === 'Declined'}>
                    {t.confirmAttendance}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">{t.confirmAttendanceHelper}</p>
            </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex-1 w-full text-center">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto" disabled={rsvpStatus === 'Accepted'}>{t.declineInvitation}</Button>
                 <p className="text-xs text-muted-foreground mt-2">{t.declineInvitationHelper}</p>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.declineModalTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.declineModalBody}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDecline}>{t.decline}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}

    