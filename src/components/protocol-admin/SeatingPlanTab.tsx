
'use client';

import { useState, useMemo, useEffect } from 'react';
import { allGuests, roomLayouts, type Guest, type RoomLayout, type Seat as SeatType, type Table as TableType } from '@/lib/data';
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
import { Printer, RotateCcw, Wand2, User, Info, X, Hand } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Label } from '../ui/label';
import { Combobox } from '../ui/combobox';
import { Badge } from '../ui/badge';

const getInitialLayout = (eventId: string) => roomLayouts.find(rl => rl.eventId === eventId);
const getInitialGuests = (eventId: string) => allGuests.filter(g => g.eventId === eventId && g.rsvpStatus === 'Accepted');

function Seat({ seat, onSeatSelect, isAssignmentMode }: { seat: any, onSeatSelect: (seat: any) => void, isAssignmentMode: boolean }) {
    const guest = allGuests.find(g => g.id === seat.guestId);
    
    const canAssign = isAssignmentMode && !guest;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    variant="outline" 
                    className="h-auto p-2 flex flex-col items-center justify-center text-center w-24 h-24 relative shadow-sm hover:bg-accent/80"
                    onClick={() => onSeatSelect(seat)}
                    data-state={canAssign ? 'assignable' : ''}
                >
                    <div className="absolute top-1 left-1 text-xs font-mono text-muted-foreground">{seat.label}</div>
                    <div className="flex flex-col items-center justify-center">
                        {guest ? (
                            <>
                                <User className="w-5 h-5 mb-1" />
                                <p className="text-xs font-medium leading-tight text-foreground line-clamp-2">{guest.fullName}</p>
                                <p className="text-[10px] text-muted-foreground line-clamp-1">{guest.organization}</p>
                            </>
                        ) : (
                             <>
                                {canAssign && <Hand className="w-5 h-5 mb-1 text-primary animate-pulse" />}
                                <p className="text-xs text-muted-foreground">{canAssign ? 'Click to assign' : 'Empty'}</p>
                            </>
                        )}
                    </div>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {guest ? <p>{guest.fullName}</p> : <p>Empty Seat</p>}
                 <p className="text-sm text-muted-foreground">Click to assign/edit</p>
            </TooltipContent>
        </Tooltip>
    )
}

function SeatingTable({ table, onSeatSelect, isAssignmentMode }: { table: any, onSeatSelect: (seat: any) => void, isAssignmentMode: boolean }) {
    return (
        <div className="border rounded-lg p-4 bg-muted/20">
            <h4 className="font-semibold text-center mb-4 text-foreground">{table.name}</h4>
            <div className="flex flex-wrap gap-2 justify-center">
                {table.seats.map((seat: any) => {
                    return <Seat key={seat.id} seat={seat} onSeatSelect={() => onSeatSelect({ ...seat, tableName: table.name })} isAssignmentMode={isAssignmentMode} />;
                })}
            </div>
        </div>
    );
}

export function SeatingPlanTab({ eventId, guestToAssign, onAssignmentComplete }: { eventId: string; guestToAssign: Guest | null; onAssignmentComplete: () => void; }) {
  const { toast } = useToast();
  const { featureFlags } = useFeatureFlags();
  const [layout, setLayout] = useState<RoomLayout | undefined>(() => getInitialLayout(eventId));
  const [guests] = useState(() => getInitialGuests(eventId));
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<(SeatType & { tableName: string }) | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  const isAssignmentMode = guestToAssign !== null;

  useEffect(() => {
    // If we enter assignment mode, close the panel if it's open
    if (isAssignmentMode) {
      setIsPanelOpen(false);
    }
  }, [isAssignmentMode]);

  const assignGuestToSeat = (guestId: string, seat: SeatType) => {
     // Check if guest is already seated
    let isAlreadySeated = false;
    layout?.tables.forEach(table => {
        table.seats.forEach(s => {
            if (s.guestId === guestId && s.id !== seat.id) {
                isAlreadySeated = true;
            }
        });
    });

    if (isAlreadySeated) {
        toast({ title: "Assignment Failed", description: "This guest is already assigned to another seat.", variant: "destructive" });
        return false;
    }
    
    // Update layout state
    setLayout(prevLayout => {
        if (!prevLayout) return;
        const newTables = prevLayout.tables.map(table => ({
            ...table,
            seats: table.seats.map(s => {
                // Clear the seat if another guest was there
                if (s.guestId === guestId && s.id !== seat.id) {
                    return { ...s, guestId: null };
                }
                // Assign to new seat
                if (s.id === seat.id) {
                    return { ...s, guestId: guestId };
                }
                return s;
            })
        }));
        return { ...prevLayout, tables: newTables };
    });

    const guest = allGuests.find(g => g.id === guestId);
    toast({ title: "Seat Assigned", description: `${guest?.fullName} has been assigned to seat ${seat.label}.` });
    return true;
  };


  const handleSeatSelect = (seat: SeatType & { tableName: string }) => {
    if (isAssignmentMode) {
        if (seat.guestId) {
            toast({ title: "Seat Occupied", description: "This seat is already taken. Choose an empty seat.", variant: "destructive"});
            return;
        }
        if (assignGuestToSeat(guestToAssign.id, seat)) {
            onAssignmentComplete();
        }
    } else {
        setSelectedSeat(seat);
        setSelectedGuestId(seat.guestId);
        setIsPanelOpen(true);
    }
  };
  
  const handleAssignSeatFromPanel = () => {
    if (!selectedSeat || !selectedGuestId) {
        toast({ title: "Error", description: "No seat or guest selected.", variant: "destructive" });
        return;
    }
    
    if (assignGuestToSeat(selectedGuestId, selectedSeat)) {
        setIsPanelOpen(false);
    }
  };

  const handleClearSeat = () => {
    if (!selectedSeat) return;

     setLayout(prevLayout => {
        if (!prevLayout) return;
        const newTables = prevLayout.tables.map(table => ({
            ...table,
            seats: table.seats.map(seat => 
                seat.id === selectedSeat.id ? { ...seat, guestId: null } : seat
            )
        }));
        return { ...prevLayout, tables: newTables };
    });

    toast({ title: "Seat Cleared", description: `Seat ${selectedSeat.label} is now empty.` });
    setIsPanelOpen(false);
  };

  const handleDemoClick = (action: string) => {
      toast({
          title: 'Action Simulated',
          description: `In a real app, this would ${action}.`,
      })
  }

  const guestOptions = guests.map(g => ({
      value: g.id,
      label: `${g.fullName} (${g.organization})`,
  }));

  const selectedGuestForPanel = guests.find(g => g.id === selectedGuestId);

  const roomAreas = ["Main Hall", "VIP Area"]; // Dummy data

  return (
    <>
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
         {isAssignmentMode && (
            <Alert className="mb-4 border-primary/50 text-primary">
                <Hand className="h-4 w-4" />
                <AlertTitle>Assignment Mode</AlertTitle>
                <AlertDescription>
                    You are assigning a seat for <strong>{guestToAssign.fullName}</strong>. Click an available empty seat below.
                </AlertDescription>
                 <Button variant="ghost" size="sm" className="mt-2 text-primary" onClick={onAssignmentComplete}>Cancel Assignment</Button>
            </Alert>
         )}
         {featureFlags.enable3DPreview === false && (
            <Alert variant="destructive" className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>3D Preview Disabled</AlertTitle>
              <AlertDescription>
                The experimental 3D preview feature is currently disabled by a Super Admin.
              </AlertDescription>
            </Alert>
          )}

         <div className="bg-background border rounded-lg p-4 sm:p-6 lg:p-8 space-y-8">
            {layout ? (
                layout.tables.map(table => (
                    <SeatingTable key={table.id} table={table} onSeatSelect={handleSeatSelect} isAssignmentMode={isAssignmentMode} />
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

    <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Assign Seat</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
                 {selectedSeat && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Seat Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p><strong>Seat:</strong> {selectedSeat.label}</p>
                            <p><strong>Table:</strong> {selectedSeat.tableName}</p>
                            <p><strong>Room:</strong> Main Hall (demo)</p>
                        </CardContent>
                    </Card>
                 )}
                 <div className="space-y-2">
                    <Label htmlFor="guest-select">Assign Guest</Label>
                    <Combobox
                        options={guestOptions}
                        value={selectedGuestId}
                        onValueChange={setSelectedGuestId}
                        placeholder="Search for a guest..."
                        notFoundMessage="No guest found."
                    />
                 </div>
                 {selectedGuestForPanel && (
                    <Card className="bg-muted/30">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">Guest Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                           <p className="font-semibold">{selectedGuestForPanel.fullName}</p>
                           <p className="text-muted-foreground">{selectedGuestForPanel.organization}</p>
                           <div className="flex gap-2 pt-2">
                                <Badge variant="outline">{selectedGuestForPanel.category}</Badge>
                                <Badge>RSVP: {selectedGuestForPanel.rsvpStatus}</Badge>
                           </div>
                        </CardContent>
                    </Card>
                 )}
            </div>
            <div className="flex justify-between">
                <Button variant="destructive" onClick={handleClearSeat} disabled={!selectedSeat?.guestId}>
                    <X />
                    Clear Seat
                </Button>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                    <Button onClick={handleAssignSeatFromPanel} disabled={!selectedGuestId}>Assign Seat (demo)</Button>
                </div>
            </div>
        </SheetContent>
    </Sheet>
    </>
  );
}
