
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
import { PageShell } from '@/components/layout/PageShell';
import { TimerOff } from 'lucide-react';

export default function SessionExpiredPage() {
  return (
    <PageShell role="Error">
        <div className="flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
                        <TimerOff className="w-10 h-10 text-destructive" />
                    </div>
                    <CardTitle className="page-title">Session Expired</CardTitle>
                    <CardDescription>For security reasons, your session has expired.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6 text-muted-foreground">In a production environment, you would be automatically logged out after a period of inactivity.</p>
                    <Button asChild>
                        <Link href="/">Return to Role Selection</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </PageShell>
  );
}
