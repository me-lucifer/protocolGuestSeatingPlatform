import { events } from '@/lib/data';
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
import { format } from 'date-fns';
import type { Event } from '@/lib/data';

export default function ProtocolAdminEventsPage() {

  const getStatusVariant = (status: Event['status']) => {
    switch (status) {
      case 'Live':
        return 'default';
      case 'Invitations Sent':
        return 'secondary';
      case 'Completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="page-title">Event Management</CardTitle>
        <CardDescription>
          Overview of all configured events for the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden lg:table-cell">Venue</TableHead>
              <TableHead className="text-center">Guests</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell className="hidden md:table-cell">{format(new Date(event.date), 'PPP')}</TableCell>
                <TableCell className="hidden lg:table-cell">{event.venue}</TableCell>
                <TableCell className="text-center">{event.guestCount}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={getStatusVariant(event.status)} className="capitalize">
                    {event.status}
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
