import { events, guests } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Armchair, Building } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function GuestView() {
  // For this prototype, we'll just show the details for the first guest.
  const guest = guests[0];
  const event = events.find((e) => e.id === guest.eventId);

  if (!event) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Event details could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex justify-center items-start">
      <Card className="max-w-2xl w-full">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
          <CardDescription className="font-semibold">You are invited to</CardDescription>
          <CardTitle className="text-3xl font-headline text-primary">{event.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6 text-muted-foreground">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-4 mt-1 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Date</p>
                <p>{format(new Date(event.date), 'eeee, MMMM do, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-4 mt-1 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Time</p>
                <p>{format(new Date(event.date), 'p')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-4 mt-1 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Venue</p>
                <p>{event.location}</p>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <h3 className="text-xl font-semibold mb-4 text-foreground">Your Details</h3>
          <div className="space-y-6 text-muted-foreground">
            <div className="flex items-start">
              <Building className="h-5 w-5 mr-4 mt-1 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Invitee</p>
                <p>{guest.name}, {guest.organization}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Armchair className="h-5 w-5 mr-4 mt-1 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Assigned Seat</p>
                <p className="text-lg font-bold text-foreground">{guest.seat || 'To be assigned'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
