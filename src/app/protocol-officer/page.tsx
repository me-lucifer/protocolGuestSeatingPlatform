'use client';

import { useState } from 'react';
import { guests } from '@/lib/data';
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
  const [guestList, setGuestList] = useState(guests);
  const { toast } = useToast();

  const handleCheckIn = (guestId: string) => {
    let guestName = '';
    const updatedGuests = guestList.map((guest) => {
      if (guest.id === guestId) {
        guestName = guest.name;
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
      (guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       guest.organization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="page-title">Guest Check-in: Annual Diplomatic Gala 2024</CardTitle>
        <CardDescription>
          Search for guests by name or organization to check them in.
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
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Organization</TableHead>
                <TableHead className="hidden sm:table-cell">Seat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{guest.organization}</TableCell>
                  <TableCell className="hidden sm:table-cell">{guest.seat || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={guest.checkInStatus === 'Checked-in' ? 'secondary' : 'outline'}>
                      {guest.checkInStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleCheckIn(guest.id)}
                      disabled={guest.checkInStatus === 'Checked-in'}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Check In
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
