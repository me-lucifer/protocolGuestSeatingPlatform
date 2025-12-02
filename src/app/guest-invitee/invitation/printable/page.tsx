
'use client';

import { useEffect } from 'react';
import { events, guests } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Shirt, QrCode } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrintableInvitationPage() {
  const { t } = useLanguage();
  const guest = guests.find((g) => g.category === 'VIP');
  const event = events.find((e) => e.id === guest?.eventId);

  useEffect(() => {
    // This is a demo; trigger print dialog automatically.
    // In a real app, this might be handled differently.
    window.print();
  }, []);

  if (!guest || !event) {
    return (
      <div className="p-8">
        <p>Error: Guest or event data not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground font-sans p-4 sm:p-8">
      <style type="text/css" media="print">
        {`
          @page { size: auto; margin: 0; }
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
        `}
      </style>
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-none border-0">
          <CardHeader className="text-center space-y-4">
            <CardDescription className="text-lg">{t.youAreInvitedTo}</CardDescription>
            <CardTitle className="text-4xl font-headline text-primary">{event.name}</CardTitle>
          </CardHeader>
          <CardContent className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
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
              <div className="flex flex-col items-center justify-center bg-muted/30 p-6 rounded-lg">
                <p className="text-sm font-semibold text-muted-foreground mb-4">{t.presentAtEntrancePrint}</p>
                 <div className="w-40 h-40 mb-4 bg-background flex items-center justify-center rounded-md border shadow-inner">
                    <div className="flex flex-col items-center text-muted-foreground">
                        <QrCode className="h-12 w-12" />
                        <p className="mt-2 text-xs font-semibold">{t.qrCodeDemo}</p>
                    </div>
                </div>
                <p className="font-semibold text-lg text-foreground">{guest.fullName}</p>
                <p className="text-muted-foreground">{guest.organization}</p>
              </div>
            </div>
            <Separator className="my-8" />
            <div className="text-center text-muted-foreground">
              <p className="font-semibold text-lg">{t.eventDetails}</p>
              <p className="mt-2 max-w-2xl mx-auto">
                {t.invitationBody.replace('{eventName}', event.name)}
              </p>
            </div>
             <p className="text-center text-xs text-muted-foreground mt-8 no-print">
                {t.printablePrototypeNote}
              </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
