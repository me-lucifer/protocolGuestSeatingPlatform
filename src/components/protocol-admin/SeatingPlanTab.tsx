
'use client';

import { useState } from 'react';
import { roomLayouts, guests as allGuests, type Guest, type RoomLayout } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Printer, RotateCcw, Wand2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const getGuestById = (guestId: string | null): Guest | null => {
  if (!guestId) return null;
  return allGuests.find(g => g.id === guestId) || null;
}

function Seat({ seat, guest }: { seat: any, guest: Guest | null }) {
    return (
        <Button variant="outline" className="h-auto p-2 flex flex-col items-center justify-center text-center w-24 h-24 relative shadow-sm hover:bg-accent/80">
            <div className="absolute top-1 left-1 text-xs font-mono text-muted-foreground">{seat.label}</div>
            <div className="flex flex-col items-center justify-center">
                {guest ? (
                    <>
                        <User className="w-5 h-5 mb-1" />
                        <p className="text-xs font-medium leading-tight text-foreground line-clamp-2">{guest.fullName}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{guest.organization}</p>
                    </>
                ) : (
                    <p className="text-xs text-muted-foreground">Empty</p>
                )}
            </div>
        </Button>
    )
}

function SeatingTable({ table }: { table: any }) {
    return (
        <div className="border rounded-lg p-4 bg-muted/20">
            <h4 className="font-semibold text-center mb-4 text-foreground">{table.name}</h4>
            <div className="flex flex-wrap gap-2 justify-center">
                {table.seats.map((seat: any) => {
                    const guest = getGuestById(seat.guestId);
                    return <Seat key={seat.id} seat={seat} guest={guest} />;
                })}
            </div>
        </div>
    );
}

export function SeatingPlanTab({ eventId }: { eventId: string }) {
  const { toast } = useToast();
  const [selectedLayout, setSelectedLayout] = useState<RoomLayout | undefined>(() =>
    roomLayouts.find(rl => rl.eventId === eventId)
  );

  const handleDemoClick = (action: string) => {
      toast({
          title: 'Action Simulated',
          description: `In a real app, this would ${action}.`,
      })
  }

  const roomAreas = ["Main Hall", "VIP Area"]; // Dummy data

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle className="section-title">Seating Plan</CardTitle>
                <CardDescription>Arrange guest seating for this event.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
                 <Select defaultValue={roomAreas[0]}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select room/area" />
                    </SelectTrigger>
                    <SelectContent>
                        {roomAreas.map(area => <SelectItem key={area} value={area}>{area}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="secondary" onClick={() => handleDemoClick('auto-arrange seats based on protocol rules')}>
                            <Wand2 />
                            Auto-arrange (demo)
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Automatically assign seats based on guest rank and delegation.</p>
                    </TooltipContent>
                </Tooltip>
                 <Button variant="outline" onClick={() => handleDemoClick('reset the seating plan')}>
                    <RotateCcw />
                    Reset
                </Button>
                <Button variant="outline" onClick={() => handleDemoClick('open a printable seating chart')}>
                    <Printer />
                    Print (demo)
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
         <div className="bg-background border rounded-lg p-4 sm:p-6 lg:p-8 space-y-8">
            {selectedLayout ? (
                selectedLayout.tables.map(table => (
                    <SeatingTable key={table.id} table={table} />
                ))
            ) : (
                <div className="text-center text-muted-foreground py-16">
                    <p>No seating layout has been created for this event yet.</p>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Click on a seat to assign or change a guest. This is a visual placeholder for the seating arrangement interface.</p>
      </CardFooter>
    </Card>
  );
}
