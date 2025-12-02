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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { QrCode, ArrowLeft, Home, Download, Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function RsvpConfirmedPage() {
  const { toast } = useToast();
  // For this prototype, we'll just show the details for the same VIP guest.
  const guest = guests.find((g) => g.category === 'VIP');
  const event = events.find((e) => e.id === guest?.eventId);

  if (!guest || !event) {
    return (
      <div className="flex justify-center items-start p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sample guest or event details could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    toast({
      title: 'Action Simulated',
      description: 'In a real app, the QR code image would be downloaded.',
    });
  };

  return (
    <div className="flex justify-center items-start">
      <Card className="max-w-2xl w-full text-center shadow-lg">
        <CardHeader className="p-6">
          <CardTitle className="page-title">Attendance Confirmed</CardTitle>
          <CardDescription>
            Your RSVP for the {event.name} has been accepted.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-muted/30 p-6 rounded-lg flex flex-col items-center justify-center">
            <div className="w-48 h-48 mb-4 bg-background flex items-center justify-center rounded-md border shadow-inner">
               <div className="flex flex-col items-center text-muted-foreground">
                <QrCode className="h-16 w-16" />
                <p className="mt-2 text-xs font-semibold">QR Code (demo)</p>
              </div>
            </div>
            <p className="font-semibold text-lg text-foreground">{guest.fullName}</p>
            <p className="text-muted-foreground">{guest.organization}</p>
            <Separator className="my-4" />
            <Badge variant="default" className="text-base">Accepted</Badge>
            <p className="mt-4 text-muted-foreground">
              Please present this code at the event entrance for check-in.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full">
              <Button onClick={handleDownload} variant="outline" className="w-full">
                <Download />
                Download QR (demo)
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/guest-invitee/invitation/printable" target="_blank">
                    <Printer />
                    Print Invitation (demo)
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/30 rounded-b-lg flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/guest-invitee/invitation/sample">
              <ArrowLeft />
              View Invitation Again
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Home />
              Back to Role Selection
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
