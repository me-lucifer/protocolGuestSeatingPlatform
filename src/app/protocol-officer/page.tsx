'use client';

import { useState } from 'react';
import { guests, type Guest } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Search } from 'lucide-react';

export default function ProtocolOfficerInterface() {
  const [searchTerm, setSearchTerm] = useState('');
  const [guestList, setGuestList] = useState<Guest[]>(guests);
  const { toast } = useToast();

  const handleCheckIn = (guestId: string) => {
    let guestName = '';
    const updatedGuests = guestList.map((guest) => {
      if (guest.id === guestId) {
        guestName = guest.fullName;
        return { ...guest, checkInStatus: 'Checked-in' as const };
      }
      return guest;
    });
    setGuestList(updatedGuests);

    toast({
      title: 'Saved (demo only)',
      description: `${guestName} has been checked in.`,
    });
  };

  const filteredGuests = guestList.filter(
    (guest) =>
      guest.eventId === 'evt-001' && // Hard-coding to one event for this demo
      (guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       guest.organization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="border-0 shadow-none rounded-none">
      <CardHeader className="pt-2">
        <CardTitle className="text-xl font-bold tracking-tight">Guest Check-in</CardTitle>
        <CardDescription>
          Annual Diplomatic Gala 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Seat</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    <div>{guest.fullName}</div>
                    <div className="text-xs text-muted-foreground">{guest.organization}</div>
                  </TableCell>
                  <TableCell className="font-mono">{guest.seatAssignment || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleCheckIn(guest.id)}
                      disabled={guest.checkInStatus === 'Checked-in'}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {guest.checkInStatus === 'Checked-in' ? 'Checked-in' : 'Check In'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredGuests.length === 0 && (
                <div className="text-center text-muted-foreground p-8">
                    No guests found.
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
