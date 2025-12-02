
'use client';

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
import { useLanguage } from '@/contexts/LanguageContext';
import { GuestTimeline } from '@/components/guest/GuestTimeline';
import { useDemoData } from '@/contexts/DemoContext';
import { useMemo } from 'react';

export default function RsvpConfirmedPage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { events, guests } = useDemoData();
  // For this prototype, we'll just show the details for the same VIP guest.
  const guest = useMemo(() => guests.find((g) => g.category === 'VIP'), [guests]);
  const event = useMemo(() => events.find((e) => e.id === guest?.eventId), [events, guest]);

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
          <GuestTimeline currentStepKey="qrcode" className="mb-4" />
          <CardTitle className="page-title">{t.rsvpConfirmedTitle}</CardTitle>
          <CardDescription>
            {t.rsvpAcceptedFor.replace('{eventName}', event.name)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-muted/30 p-6 rounded-lg flex flex-col items-center justify-center">
            <div className="w-48 h-48 mb-4 bg-background flex items-center justify-center rounded-md border shadow-inner">
               <div className="flex flex-col items-center text-muted-foreground">
                <QrCode className="h-16 w-16" />
                <p className="mt-2 text-xs font-semibold">{t.qrCodeDemo}</p>
              </div>
            </div>
            <p className="font-semibold text-lg text-foreground">{guest.fullName}</p>
            <p className="text-muted-foreground">{guest.organization}</p>
            <Separator className="my-4" />
            <Badge variant="default" className="text-base">{t.rsvpStatus}</Badge>
            <p className="mt-4 text-muted-foreground">
              {t.presentAtEntrance}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full">
              <Button onClick={handleDownload} variant="outline" className="w-full">
                <Download />
                {t.downloadQR}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/guest-invitee/invitation/printable" target="_blank">
                    <Printer />
                    {t.printInvitation}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/30 rounded-b-lg flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/guest-invitee/invitation/sample">
              <ArrowLeft />
              {t.viewInvitationAgain}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Home />
              {t.backToRoleSelection}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
