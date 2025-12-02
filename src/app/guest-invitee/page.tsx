
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GuestJourneyPreview() {
  const { t } = useLanguage();
  return (
    <div className="flex justify-center items-start">
      <Card className="max-w-2xl w-full text-center">
        <CardHeader>
          <CardTitle className="page-title">{t.guestJourneySimulation}</CardTitle>
          <CardDescription>
            {t.guestJourneyDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            {t.guestJourneyBody}
          </p>
          <Button asChild size="lg">
            <Link href="/guest-invitee/invitation/sample-event">
              {t.openSampleInvitation}
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
