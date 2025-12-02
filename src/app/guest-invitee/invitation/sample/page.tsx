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
import { MapPin, Calendar, Clock, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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

export default function GuestInviteeInvitationView() {
  const { toast } = useToast();
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

  const handleRsvp = (status: 'Accepted' | 'Declined') => {
    toast({
      title: `RSVP action (demo only)`,
      description: `You have ${status.toLowerCase()} the invitation.`,
    });
  };

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
          <p className="text-xs text-muted-foreground mt-6 text-center">
            This is a prototype for demonstration purposes. Your response will not be recorded.
          </p>
        </CardContent>
        <CardFooter className="p-6 bg-muted/30 rounded-b-lg flex flex-col sm:flex-row justify-center gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto">Confirm Attendance</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Attendance</AlertDialogTitle>
                <AlertDialogDescription>
                  This is a prototype action. No confirmation will be sent. Do you want to simulate this action?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleRsvp('Accepted')}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">Decline Invitation</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Decline Invitation</AlertDialogTitle>
                <AlertDialogDescription>
                  This is a prototype action. Your response will not be saved. Do you want to simulate declining?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleRsvp('Declined')}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
