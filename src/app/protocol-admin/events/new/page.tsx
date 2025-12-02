
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { ArrowLeft } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSave = () => {
    // In a real app, you would collect form data and send it to an API.
    // For this demo, we just show a toast and redirect.
    toast({
      title: 'Event Saved (Demo)',
      description: 'The new event has been created in this demo session.',
    });
    router.push('/protocol-admin');
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="page-title">Create New Event</CardTitle>
          <CardDescription>
            Fill in the details below to set up a new event. This is a demo and data will not be permanently saved.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input id="event-name" placeholder="e.g., Annual Diplomatic Gala 2025" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="event-description">Event Description (Optional)</Label>
            <Textarea
              id="event-description"
              placeholder="Provide a brief summary of the event's purpose."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="event-date">Event Date</Label>
              <DatePicker />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-time">Event Time</Label>
              <Input id="event-time" type="time" defaultValue="19:00" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="event-venue">Venue</Label>
            <Input id="event-venue" placeholder="e.g., Grand Ballroom, The Capital Hotel" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select an event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diplomatic-reception">Diplomatic Reception</SelectItem>
                  <SelectItem value="state-ceremony">State Ceremony</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="luncheon">Luncheon / Dinner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-status">Initial Status</Label>
              <Select defaultValue="Draft">
                <SelectTrigger id="event-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Invitations Sent">Invitations Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/protocol-admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Save Event</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Event Creation</AlertDialogTitle>
                <AlertDialogDescription>
                  This is a prototype. Saving this event will add it to the list for this session only.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSave}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
