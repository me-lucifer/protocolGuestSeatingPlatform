
'use client';

import { events, guests } from '@/lib/data';
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

export default function GuestInviteeInvitationView() {
  const router = useRouter();
  const { t } = useLanguage();
  // For this prototype, we'll just show the details for the first VIP guest.
  const guest = guests.find((g) => g.category === 'VIP');

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

  const event = events.find((e) => e.id === guest.eventId);

  if (!event) {
    return (
      <div className="flex justify-center items-start p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Event details could not be found for this guest.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAccept = () => {
    const guestIndex = guests.findIndex((g) => g.id === guest.id);
    if (guestIndex !== -1) {
      guests[guestIndex].rsvpStatus = 'Accepted';
    }
    router.push('/guest-invitee/invitation/confirmed');
  };

  const handleDecline = () => {
    // In a real app, this would be an API call.
    // For this prototype, we'll mutate the shared data directly.
    const guestIndex = guests.findIndex((g) => g.id === guest.id);
    if (guestIndex !== -1) {
      guests[guestIndex].rsvpStatus = 'Declined';
    }
    router.push('/guest-invitee/invitation/declined');
  };

  const rsvpStatus = guest.rsvpStatus;

  return (
    <div className="flex justify-center items-start p-0 sm:p-4">
      <Card className="max-w-2xl w-full shadow-lg rounded-lg">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
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
        <CardFooter className="p-6 bg-muted/30 rounded-b-lg flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto" onClick={handleAccept} disabled={rsvpStatus === 'Declined'}>
            {t.confirmAttendance}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" disabled={rsvpStatus === 'Accepted'}>{t.declineInvitation}</Button>
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
