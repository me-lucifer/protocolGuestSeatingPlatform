
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { guests as allGuests, type Guest } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Search, UserPlus, Upload, MoreHorizontal, Pencil, Trash2, Ticket } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ImportGuestsDialog } from './ImportGuestsDialog';
import { AddGuestDialog } from './AddGuestDialog';

const guestCategories: Guest['category'][] = ['VIP', 'Diplomatic', 'Press', 'Staff'];
const rsvpStatuses: Guest['rsvpStatus'][] = ['Accepted', 'Declined', 'Invited', 'Not Invited'];

export function GuestListTab({ eventId }: { eventId: string }) {
  const [guests, setGuests] = useState(() => allGuests.filter(g => g.eventId === eventId));
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rsvpFilter, setRsvpFilter] = useState('all');

  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesSearch = guest.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || guest.category === categoryFilter;
      const matchesRsvp = rsvpFilter === 'all' || guest.rsvpStatus === rsvpFilter;
      return matchesSearch && matchesCategory && matchesRsvp;
    });
  }, [guests, searchTerm, categoryFilter, rsvpFilter]);

  const handleAddGuest = (newGuest: Omit<Guest, 'id' | 'eventId'>) => {
    const newGuestWithId: Guest = {
      ...newGuest,
      id: `gst-${Date.now()}`,
      eventId: eventId,
    };
    setGuests(prev => [...prev, newGuestWithId]);
    // Also update the global list for session consistency
    allGuests.push(newGuestWithId);
  };

  const getRsvpVariant = (status: Guest['rsvpStatus']) => {
    switch (status) {
      case 'Accepted': return 'default';
      case 'Declined': return 'destructive';
      case 'Invited': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
                <CardTitle className="section-title">Guest List</CardTitle>
                <CardDescription>Manage guests for this event.</CardDescription>
            </div>
            <div className="flex gap-2">
                <ImportGuestsDialog />
                <AddGuestDialog onAddGuest={handleAddGuest} />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {guestCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={rsvpFilter} onValueChange={setRsvpFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by RSVP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All RSVPs</SelectItem>
                {rsvpStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
        </div>

        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Organization</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>RSVP Status</TableHead>
                <TableHead className="hidden lg:table-cell">Seat</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">
                    <div>{guest.fullName}</div>
                    <div className="text-xs text-muted-foreground md:hidden">{guest.organization}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{guest.organization}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{guest.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRsvpVariant(guest.rsvpStatus)} className="capitalize">{guest.rsvpStatus}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono">{guest.seatAssignment || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href="/guest-invitee/invitation/sample" target="_blank">
                                    <Ticket className="mr-2 h-4 w-4" />
                                    View Invitation (demo)
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Guest
                            </DropdownMenuItem>
                             <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Guest
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredGuests.length === 0 && (
            <div className="text-center text-muted-foreground p-8">
                No guests found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
