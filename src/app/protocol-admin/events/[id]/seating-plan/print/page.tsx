
'use client';

import { useParams } from 'next/navigation';
import { type Event, type RoomLayout } from '@/lib/data';
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
import { useEffect, useMemo } from 'react';
import { Separator } from '@/components/ui/separator';
import { useDemoData } from '@/contexts/DemoContext';

export default function PrintableSeatingPlanPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { guests: allGuests, events, roomLayouts } = useDemoData();

  const event = useMemo(() => events.find((e) => e.id === eventId), [events, eventId]);
  const layout = useMemo(() => roomLayouts.find((l) => l.eventId === eventId), [roomLayouts, eventId]);

  useEffect(() => {
    // This is a demo; trigger print dialog automatically.
    // In a real app, this might be handled by a user click.
    setTimeout(() => window.print(), 500);
  }, []);

  if (!event || !layout) {
    return (
      <div className="p-8">
        <p>Error: Event or layout data not found for printing.</p>
      </div>
    );
  }
  
  const allSeatedGuests = layout.tables.flatMap(table => 
    table.seats
      .filter(seat => seat.guestId)
      .map(seat => {
        const guest = allGuests.find(g => g.id === seat.guestId);
        return {
          seatLabel: seat.label,
          tableName: table.name,
          guestName: guest?.fullName || 'Unknown Guest',
          guestOrg: guest?.organization || 'Unknown Organization',
        };
      })
  ).sort((a,b) => a.tableName.localeCompare(b.tableName) || a.seatLabel.localeCompare(b.seatLabel));


  return (
    <div className="bg-background text-foreground font-sans p-4 sm:p-8">
      <style type="text/css" media="print">
        {`
          @page { size: auto; margin: 20mm; }
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
        `}
      </style>
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-none border-0">
          <CardHeader className="text-center space-y-2">
            <CardDescription className="text-lg">Seating Plan</CardDescription>
            <CardTitle className="text-4xl font-headline text-primary">{event.name}</CardTitle>
             <p className="text-sm text-muted-foreground pt-2 no-print">
                This is a prototype print preview. You can close this tab to return to the application.
              </p>
          </CardHeader>

          <CardContent className="mt-8">
            {layout.tables.map(table => (
              <div key={table.id} className="mb-8 break-inside-avoid">
                <h3 className="text-2xl font-semibold mb-3 border-b pb-2">{table.name}</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Seat</TableHead>
                            <TableHead>Guest</TableHead>
                            <TableHead>Organization</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.seats.map(seat => {
                            const guest = allGuests.find(g => g.id === seat.guestId);
                            return (
                                <TableRow key={seat.id}>
                                    <TableCell className="font-mono font-bold">{seat.label}</TableCell>
                                    <TableCell>{guest?.fullName || <span className="text-muted-foreground/70">-- Empty --</span>}</TableCell>
                                    <TableCell>{guest?.organization || ''}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
