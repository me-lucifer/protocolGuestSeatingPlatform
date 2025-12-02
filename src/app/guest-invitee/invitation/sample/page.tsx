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

export default function GuestInviteeInvitationView() {
  const router = useRouter();
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
            <CardTitle>Error</_CardTitle>
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
            You are cordially invited to attend.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {rsvpStatus !== 'Invited' && (
            <Alert variant={rsvpStatus === 'Declined' ? 'destructive' : 'default'} className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>You have already responded</AlertTitle>
              <AlertDescription>
                {rsvpStatus === 'Accepted'
                  ? 'Your attendance has been confirmed.'
                  : 'You have declined this invitation.'}
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <p className="font-semibold text-lg text-foreground">
              Dear {guest.title} {guest.fullName.split(' ').slice(-1)},
            </p>
            <p className="mt-2 text-muted-foreground">
              It is with great pleasure that we invite you to the {event.name},
              a gathering of distinguished leaders and diplomats to celebrate international cooperation and shared progress. Your presence would greatly honor the occasion.
            </p>
          </div>

          <div className="space-y-6 text-muted-foreground border-t border-b py-6">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-4 mt-1 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Date</p>
                <p>{format(new Date(event.date), 'eeee, MMMM do, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-4 mt-1 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Time</p>
                <p>{format(new Date(event.date), 'p')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-4 mt-1 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Venue</p>
                <p>{event.venue}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Shirt className="h-5 w-5 mr-4 mt-1 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Dress Code</p>
                <p>Black Tie</p>
              </div>
            </div>
          </div>
           {rsvpStatus === 'Declined' && (
             <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">If your availability has changed, please contact the Protocol Office.</p>
                <Button variant="link" asChild className="mt-1">
                    <Link href="mailto:protocol-office@example.com"><Mail /> Contact Protocol</Link>
                </Button>
            </div>
           )}
          <p className="text-xs text-muted-foreground mt-6 text-center">
            This is a prototype for demonstration purposes. Your response will be reflected in this demo session.
          </p>
        </CardContent>
        <CardFooter className="p-6 bg-muted/30 rounded-b-lg flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto" onClick={handleAccept} disabled={rsvpStatus === 'Declined'}>
            Confirm Attendance
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" disabled={rsvpStatus === 'Accepted'}>Decline Invitation</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Decline Invitation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to decline the invitation? This action will be reflected in the prototype session.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDecline}>Decline</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
