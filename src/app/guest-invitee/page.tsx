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

export default function GuestJourneyPreview() {
  return (
    <div className="flex justify-center items-start">
      <Card className="max-w-2xl w-full text-center">
        <CardHeader>
          <CardTitle className="page-title">Guest Journey Simulation</CardTitle>
          <CardDescription>
            This page simulates the entry point for an invited guest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            From here, you can view a sample invitation to see what a guest would experience. The sample uses data for a VIP guest attending the "Annual Diplomatic Gala 2024" event.
          </p>
          <Button asChild size="lg">
            <Link href="/guest-invitee/invitation/sample">
              Open Sample Invitation
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
