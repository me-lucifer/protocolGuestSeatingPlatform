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
import { Home, Mail, XCircle } from 'lucide-react';

export default function RsvpDeclinedPage() {
  return (
    <div className="flex justify-center items-start">
      <Card className="max-w-2xl w-full text-center shadow-lg">
        <CardHeader className="p-6 items-center">
            <XCircle className="h-16 w-16 text-destructive mb-4" />
          <CardTitle className="page-title">Invitation Declined</CardTitle>
          <CardDescription>
            Your response has been recorded.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-muted/30 p-6 rounded-lg flex flex-col items-center justify-center">
            <p className="font-semibold text-lg text-foreground">We are sorry you cannot make it.</p>
            <Badge variant="destructive" className="text-base my-4">Declined</Badge>
            <p className="mt-2 text-muted-foreground">
              If this was a mistake, or if your availability changes, please contact the Protocol Office directly.
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/30 rounded-b-lg flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="mailto:protocol-office@example.com">
              <Mail />
              Contact Protocol
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
