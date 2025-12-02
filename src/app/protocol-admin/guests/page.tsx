import { guests, events } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function ProtocolAdminGuestsPage() {
  const getEventName = (eventId: string) => {
    return events.find((e) => e.id === eventId)?.name || 'Unknown Event';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="page-title">Guest Management</CardTitle>
        <CardDescription>
          Master list of all guests across all events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest Name</TableHead>
              <TableHead className="hidden md:table-cell">Organization</TableHead>
              <TableHead className="hidden lg:table-cell">Event</TableHead>
              <TableHead className="text-right">RSVP Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell className="hidden md:table-cell">{guest.organization}</TableCell>
                <TableCell className="hidden lg:table-cell">{getEventName(guest.eventId)}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      guest.rsvpStatus === 'Confirmed'
                        ? 'default'
                        : guest.rsvpStatus === 'Declined'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {guest.rsvpStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
