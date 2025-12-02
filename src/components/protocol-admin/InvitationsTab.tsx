
'use client';

import { useState, useMemo, useEffect } from 'react';
import { type Guest } from '@/lib/data';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Send, MailWarning, User, Eye, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDemoData } from '@/contexts/DemoContext';

export function InvitationsTab({ eventId }: { eventId: string }) {
  const { toast } = useToast();
  const { guests: allGuests } = useDemoData();
  const [guests, setGuests] = useState(() => allGuests.filter(g => g.eventId === eventId));

  useEffect(() => {
    setGuests(allGuests.filter(g => g.eventId === eventId));
  }, [allGuests, eventId]);

  const rsvpSummary = useMemo(() => {
    return guests.reduce(
      (acc, guest) => {
        if (guest.rsvpStatus !== 'Not Invited') {
            acc.invited += 1;
        }
        if (guest.rsvpStatus === 'Accepted') acc.accepted += 1;
        else if (guest.rsvpStatus === 'Declined') acc.declined += 1;
        else if (guest.rsvpStatus === 'Invited') acc.noResponse += 1;
        return acc;
      },
      { invited: 0, accepted: 0, declined: 0, noResponse: 0 }
    );
  }, [guests]);

  const handleSimulatedAction = (title: string, description: string) => {
    toast({
      title: `Simulated: ${title}`,
      description,
    });
  };

  const getRsvpVariant = (status: Guest['rsvpStatus']) => {
    switch (status) {
      case 'Accepted': return 'success';
      case 'Declined': return 'destructive';
      case 'Invited': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <TooltipProvider>
    <Card>
      <CardHeader>
        <CardTitle className="section-title">Invitations & RSVPs</CardTitle>
        <CardDescription>Monitor guest responses and manage communications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Invited</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rsvpSummary.invited}</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rsvpSummary.accepted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Declined</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rsvpSummary.declined}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">No Response</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rsvpSummary.noResponse}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2">
            <AlertDialog>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild><Button><Send />Send Invitations (demo)</Button></AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>This is a simulated action for the prototype.</p>
                    </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Simulate Sending Invitations</AlertDialogTitle>
                        <AlertDialogDescription>This would send email invitations to all guests currently in 'Not Invited' status.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSimulatedAction('Sent Invitations', 'Invitations have been "sent" to guests.')}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild><Button variant="secondary"><MailWarning />Send Reminders (demo)</Button></AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>This is a simulated action for the prototype.</p>
                    </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Simulate Sending Reminders</AlertDialogTitle>
                        <AlertDialogDescription>This would send a reminder email to all guests who are still in 'Invited' status (have not responded).</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSimulatedAction('Sent Reminders', `Reminders have been "sent" to ${rsvpSummary.noResponse} guests.`)}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>RSVP Status</TableHead>
                <TableHead className="hidden lg:table-cell">Last Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.fullName}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{guest.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{guest.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRsvpVariant(guest.rsvpStatus)} className="capitalize">{guest.rsvpStatus}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {guest.lastEmailSent ? `${formatDistanceToNow(new Date(guest.lastEmailSent))} ago` : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSimulatedAction('Open Record', `Viewing details for ${guest.fullName}.`)}>
                        <Eye />
                        <span className="hidden sm:inline-block ml-2">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
}
