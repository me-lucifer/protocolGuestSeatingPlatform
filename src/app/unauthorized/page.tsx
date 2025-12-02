
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
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <PageShell role="Error">
        <div className="flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
                        <ShieldAlert className="w-10 h-10 text-destructive" />
                    </div>
                    <CardTitle className="page-title">Unauthorized Access</CardTitle>
                    <CardDescription>You do not have permission to view this section.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6 text-muted-foreground">In a real application, your assigned role would determine which pages you can access. This is a demonstration of that security feature.</p>
                    <Button asChild>
                        <Link href="/">Back to Role Selection</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </PageShell>
  );
}
