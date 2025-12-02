
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { guests as allGuests, type Guest } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, User, Building2, Armchair, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

function SuccessResult({ guest }: { guest: Guest }) {
  return (
    <div className="flex flex-col items-center text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
      <CardTitle className="text-2xl mb-2">Check-in Successful</CardTitle>
      <p className="text-xl font-semibold text-foreground">{guest.fullName}</p>
      <p className="text-muted-foreground">{guest.organization}</p>
      <Badge variant="outline" className="mt-4">{guest.category}</Badge>
      
      <Card className="w-full mt-6 text-left">
          <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Armchair /> Seating Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary font-mono text-center">{guest.seatAssignment || 'N/A'}</p>
          </CardContent>
      </Card>
    </div>
  );
}

function ErrorResult({ title, message, icon: Icon }: { title: string; message: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon className="w-20 h-20 text-destructive mb-4" />
      <CardTitle className="text-2xl mb-2">{title}</CardTitle>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export default function ScanResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const guestId = searchParams.get('guestId');

  const guest = allGuests.find(g => g.id === guestId);

  useEffect(() => {
    // In a real app, this would be an API call.
    // For this prototype, we'll mutate the shared data directly.
    if (guest && guest.checkInStatus !== 'Checked-in') {
      const guestIndex = allGuests.findIndex((g) => g.id === guest.id);
      if (guestIndex !== -1) {
        allGuests[guestIndex].checkInStatus = 'Checked-in';
      }
    }
  }, [guest]);

  const renderResult = () => {
    if (!guestId) {
      return <ErrorResult title="Scan Error" message="No guest information was provided." icon={AlertTriangle} />;
    }
    
    if (guestId === 'unknown') {
      return <ErrorResult title="Unknown Code" message="This QR code is not valid for this event." icon={XCircle} />;
    }

    if (!guest) {
      return <ErrorResult title="Guest Not Found" message="This guest is not on the list for this event." icon={XCircle} />;
    }

    if (guest.checkInStatus === 'Checked-in') {
        return <ErrorResult title="Already Checked In" message={`${guest.fullName} has already been checked in.`} icon={AlertTriangle} />;
    }

    return <SuccessResult guest={guest} />;
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="border-0 shadow-none rounded-none flex-1">
        <CardHeader className="pt-2">
            <CardTitle className="text-xl font-bold tracking-tight">Scan Result</CardTitle>
        </CardHeader>
        <CardContent>
          {renderResult()}
        </CardContent>
      </Card>
      <CardFooter className="mt-auto p-4">
        <Button className="w-full" size="lg" onClick={() => router.back()}>
            <ArrowLeft className="mr-2" />
            Back to Scanner
        </Button>
      </CardFooter>
    </div>
  );
}
