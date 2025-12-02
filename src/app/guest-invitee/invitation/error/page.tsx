
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, AlertCircle, Ticket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';

function InvitationErrorContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');

    const { title, body, helper } = useMemo(() => {
        if (reason === 'expired') {
            return {
                title: t.invitationErrorTitle,
                body: t.invitationExpiredBody,
                helper: t.invitationErrorHelper,
            }
        }
        if (reason === 'removed') {
             return {
                title: t.invitationRemovedTitle,
                body: t.invitationRemovedBody,
                helper: t.invitationErrorHelper,
            }
        }
        // Default error
        return {
            title: t.invitationErrorTitle,
            body: t.invitationErrorBody,
            helper: t.invitationErrorHelper,
        }
    }, [reason, t]);


  return (
    <Card className="max-w-2xl w-full text-center shadow-lg">
        <CardHeader className="p-6 items-center">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <CardTitle className="page-title">{title}</CardTitle>
          <CardDescription>
            {body}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-muted/30 p-6 rounded-lg flex flex-col items-center justify-center">
            <p className="mt-2 text-muted-foreground">
              {helper}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/30 rounded-b-lg flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="secondary">
                <Link href="/guest-invitee/invitation/sample-event">
                    <Ticket />
                    {t.openSampleInvitation}
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
  );
}


export default function InvitationErrorPage() {
  return (
    <div className="flex justify-center items-start">
      <Suspense fallback={<div>Loading...</div>}>
        <InvitationErrorContent />
      </Suspense>
    </div>
  );
}
