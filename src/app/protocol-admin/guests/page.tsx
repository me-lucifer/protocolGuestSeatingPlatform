import { guests, events, type Guest } from '@/lib/data';
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

  const getRsvpVariant = (status: Guest['rsvpStatus']) => {
    switch (status) {
      case 'Accepted':
        return 'default';
      case 'Declined':
        return 'destructive';
      case 'Invited':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="page-title">Guest Management</CardTitle>
        <CardDescription>
          Master list of all guests across all events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead className="hidden sm:table-cell">Title</TableHead>
                <TableHead className="hidden md:table-cell">Organization</TableHead>
                <TableHead className="hidden lg:table-cell">Event</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Category</TableHead>
                <TableHead className="text-right">RSVP Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.fullName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{guest.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{guest.organization}</TableCell>
                  <TableCell className="hidden lg:table-cell">{getEventName(guest.eventId)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    <Badge variant="outline">{guest.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={getRsvpVariant(guest.rsvpStatus)}
                      className="capitalize"
                    >
                      {guest.rsvpStatus}
                    </Badge>
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
