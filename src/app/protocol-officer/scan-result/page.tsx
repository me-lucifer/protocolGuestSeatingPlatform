
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
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

function SuccessResult({ guest, onConfirm, confirmed }: { guest: Guest, onConfirm: () => void, confirmed: boolean }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
      <CardTitle className="text-2xl mb-2">{confirmed ? 'Check-in Confirmed' : 'Guest Found'}</CardTitle>
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
      
      <div className="w-full mt-6 space-y-2">
        {confirmed ? (
             <Button className="w-full" size="lg" onClick={() => router.back()}>
                Scan Next Guest
            </Button>
        ) : (
            <Button className="w-full" size="lg" onClick={onConfirm}>
                Confirm Check-in
            </Button>
        )}
      </div>
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
  const { toast } = useToast();
  const guestId = searchParams.get('guestId');

  const [guest, setGuest] = useState<Guest | null | undefined>(undefined);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const foundGuest = allGuests.find(g => g.id === guestId);
    setGuest(foundGuest || null);
  }, [guestId]);


  const handleConfirm = () => {
    if (guest) {
        const guestIndex = allGuests.findIndex((g) => g.id === guest.id);
        if (guestIndex !== -1) {
            allGuests[guestIndex].checkInStatus = 'Checked-in';
            setConfirmed(true);
            toast({
              title: "Check-in Confirmed",
              description: `${guest.fullName} is now checked in.`,
            });
        }
    }
  }

  const renderResult = () => {
    if (guest === undefined) {
      return <div className="text-center text-muted-foreground">Loading...</div>;
    }

    if (!guestId) {
      return <ErrorResult title="Scan Error" message="No guest information was provided." icon={AlertTriangle} />;
    }
    
    if (guestId === 'unknown' || !guest) {
      return <ErrorResult title="Unknown Code" message="This QR code is not valid for this event." icon={XCircle} />;
    }

    if (guest.checkInStatus === 'Checked-in' && !confirmed) {
        return <ErrorResult title="Already Checked In" message={`${guest.fullName} has already been checked in.`} icon={AlertTriangle} />;
    }

    return <SuccessResult guest={guest} onConfirm={handleConfirm} confirmed={confirmed} />;
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
        <Button className="w-full" size="lg" variant="secondary" onClick={() => router.push('/protocol-officer')}>
            <ArrowLeft className="mr-2" />
            Back to Dashboard
        </Button>
      </CardFooter>
    </div>
  );
}
