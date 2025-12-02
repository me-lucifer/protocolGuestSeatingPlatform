

'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
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
import { Printer, RotateCcw, Wand2, User, Info, X, Hand, Star, Newspaper, Briefcase, Square, UserPlus, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Label } from '../ui/label';
import { Combobox } from '../ui/combobox';
import { Badge } from '../ui/badge';
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
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

const getInitialLayout = (eventId: string) => roomLayouts.find(rl => rl.eventId === eventId);
const getInitialGuests = (eventId: string) => allGuests.filter(g => g.eventId === eventId && g.rsvpStatus === 'Accepted');

function Seat({ seat, onSeatSelect, isAssignmentMode }: { seat: any, onSeatSelect: (seat: any) => void, isAssignmentMode: boolean }) {
    const guest = allGuests.find(g => g.id === seat.guestId);
    
    const canAssign = isAssignmentMode && !guest;

    const getSeatVariant = () => {
        if (canAssign) return 'assignable';
        if (!guest) return 'empty';
        if (guest.category === 'VIP') return 'vip';
        if (guest.category === 'Press' || guest.category === 'Staff') return 'staff-press';
        return 'occupied';
    }

    const seatVariant = getSeatVariant();

    const seatStyles = {
        'empty': 'bg-background hover:bg-accent/80',
        'occupied': 'bg-secondary/50 hover:bg-secondary',
        'vip': 'bg-yellow-100/50 border-yellow-400 hover:bg-yellow-100/80 shadow-md',
        'staff-press': 'bg-blue-100/30 border-blue-300 hover:bg-blue-100/60',
        'assignable': 'bg-primary/10 border-primary animate-pulse hover:bg-primary/20',
    }

    const getIconForCategory = (category?: Guest['category']) => {
        if (!category) return canAssign ? <Hand className="w-5 h-5 text-primary" /> : <User className="w-5 h-5" />;
        switch(category) {
            case 'VIP': return <Star className="w-5 h-5 text-yellow-600" />;
            case 'Press': return <Newspaper className="w-5 h-5" />;
            case 'Staff': return <Briefcase className="w-5 h-5" />;
            default: return <User className="w-5 h-5" />;
        }
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    variant="outline" 
                    className={cn(
                        "h-auto p-2 flex flex-col items-center justify-center text-center w-24 h-24 relative shadow-sm transition-all",
                        seatStyles[seatVariant]
                    )}
                    onClick={() => onSeatSelect(seat)}
                >
                    <div className="absolute top-1 left-1 text-xs font-mono text-muted-foreground">{seat.label}</div>
                    <div className="flex flex-col items-center justify-center">
                        {guest ? (
                            <>
                                {getIconForCategory(guest.category)}
                                <p className="text-xs font-medium leading-tight text-foreground line-clamp-2 mt-1">{guest.fullName}</p>
                                <p className="text-[10px] text-muted-foreground line-clamp-1">{guest.organization}</p>
                            </>
                        ) : (
                             <>
                                {getIconForCategory()}
                                <p className="text-xs text-muted-foreground mt-1">{canAssign ? 'Click to assign' : 'Empty'}</p>
                            </>
                        )}
                    </div>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {guest ? (
                    <div>
                        <p className="font-semibold">{guest.fullName}</p>
                        <p className="text-sm text-muted-foreground">{guest.category}</p>
                    </div>
                ) : (
                    <p>Empty Seat</p>
                )}
                 <p className="text-xs text-muted-foreground">Click to assign/edit</p>
            </TooltipContent>
        </Tooltip>
    )
}

function SeatingTable({ table, onSeatSelect, isAssignmentMode }: { table: any, onSeatSelect: (seat: any) => void, isAssignmentMode: boolean }) {
    if (table.seats.length === 0) return null;
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

const legendItems = [
    { label: 'Empty', colorClass: 'bg-background border-border' },
    { label: 'Occupied', colorClass: 'bg-secondary/50 border-border' },
    { label: 'VIP', colorClass: 'bg-yellow-100/50 border-yellow-400' },
    { label: 'Staff/Press', colorClass: 'bg-blue-100/30 border-blue-300' },
    { label: 'Assignable', colorClass: 'bg-primary/10 border-primary' },
]

function SeatingLegend() {
    return (
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center mb-4 text-xs">
            <span className="font-semibold text-muted-foreground">Legend:</span>
            {legendItems.map(item => (
                <div key={item.label} className="flex items-center gap-2">
                    <div className={cn("w-4 h-4 rounded border", item.colorClass)} />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    )
}

export function SeatingPlanTab({ eventId, guestToAssign, onAssignmentComplete }: { eventId: string; guestToAssign: Guest | null; onAssignmentComplete: () => void; }) {
  const { toast } = useToast();
  const { featureFlags } = useFeatureFlags();
  const [layout, setLayout] = useState<RoomLayout | undefined>(() => JSON.parse(JSON.stringify(getInitialLayout(eventId))));
  const [guests, setGuests] = useState(() => getInitialGuests(eventId));
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<(SeatType & { tableName: string }) | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  const [activeGuestAssignment, setActiveGuestAssignment] = useState<Guest | null>(null);
  const [seatFilter, setSeatFilter] = useState<'all' | 'empty' | 'vip' | 'unseated'>('all');

  const isAssignmentMode = activeGuestAssignment !== null;

  useEffect(() => {
    if (guestToAssign) {
        setActiveGuestAssignment(guestToAssign);
        setSeatFilter('empty'); // Automatically filter for empty seats
    }
  }, [guestToAssign]);

  const cancelAssignmentMode = () => {
    setActiveGuestAssignment(null);
    onAssignmentComplete(); // Notify parent
    if (seatFilter === 'empty') {
      setSeatFilter('all'); // Revert filter if it was auto-set
    }
  };

  const assignGuestToSeat = (guestId: string, seat: SeatType) => {
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
    
    setLayout(prevLayout => {
        if (!prevLayout) return;
        const newTables = prevLayout.tables.map(table => ({
            ...table,
            seats: table.seats.map(s => {
                if (s.guestId === guestId && s.id !== seat.id) {
                    return { ...s, guestId: null };
                }
                if (s.id === seat.id) {
                    return { ...s, guestId: guestId };
                }
                return s;
            })
        }));
        return { ...prevLayout, tables: newTables };
    });

    const guestIndex = allGuests.findIndex(g => g.id === guestId);
    if(guestIndex !== -1) {
        allGuests[guestIndex].seatAssignment = seat.label;
    }
    
    // Update local guests state
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, seatAssignment: seat.label } : g));

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
        if (activeGuestAssignment && assignGuestToSeat(activeGuestAssignment.id, seat)) {
            cancelAssignmentMode();
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
    if (!selectedSeat || !selectedSeat.guestId) return;

    const guestToUnseatId = selectedSeat.guestId;

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

    const guest = allGuests.find(g => g.id === guestToUnseatId);
    const guestIndex = allGuests.findIndex(g => g.id === guestToUnseatId);
    if(guestIndex !== -1) {
        allGuests[guestIndex].seatAssignment = null;
    }

    setGuests(prev => prev.map(g => g.id === guestToUnseatId ? { ...g, seatAssignment: null } : g));

    toast({ title: "Seat Cleared", description: `${guest?.fullName || 'Guest'} has been unseated from ${selectedSeat.label}.` });
    setIsPanelOpen(false);
  };

  const handleAutoArrange = () => {
    if (!layout) return;

    const acceptedGuests = allGuests.filter(g => g.eventId === eventId && g.rsvpStatus === 'Accepted');
    
    const sortedGuests = [...acceptedGuests].sort((a, b) => {
        if (a.rankLevel !== b.rankLevel) return a.rankLevel - b.rankLevel;
        return a.fullName.localeCompare(b.fullName);
    });

    let guestIndex = 0;
    const newLayout = JSON.parse(JSON.stringify(layout));

    newLayout.tables.forEach((table: TableType) => {
        table.seats.forEach(seat => seat.guestId = null);
    });
    allGuests.filter(g => g.eventId === eventId).forEach(g => g.seatAssignment = null);
    
    const assignGuest = (seat: SeatType) => {
        if (guestIndex < sortedGuests.length) {
            const guestToSeat = sortedGuests[guestIndex];
            seat.guestId = guestToSeat.id;
            const guestMasterIndex = allGuests.findIndex(g => g.id === guestToSeat.id);
            if (guestMasterIndex !== -1) allGuests[guestMasterIndex].seatAssignment = seat.label;
            guestIndex++;
        }
    }

    const headTable = newLayout.tables.find((t: TableType) => t.name === 'Head Table');
    if (headTable) headTable.seats.forEach(assignGuest);
    
    newLayout.tables.forEach((table: TableType) => {
        if (table.name !== 'Head Table') table.seats.forEach(assignGuest);
    });

    setLayout(newLayout);
    setGuests(getInitialGuests(eventId));
    toast({ title: 'Auto-arrange Complete (Demo)', description: 'Guests have been assigned to seats based on rank.' });
  }

  const filteredLayout = useMemo(() => {
    if (!layout || seatFilter === 'all' || seatFilter === 'unseated') return layout;

    const newTables = layout.tables.map(table => {
        const filteredSeats = table.seats.filter(seat => {
            if (seatFilter === 'empty') return !seat.guestId;
            if (seatFilter === 'vip') {
                const guest = allGuests.find(g => g.id === seat.guestId);
                return guest?.category === 'VIP';
            }
            return true;
        });
        return { ...table, seats: filteredSeats };
    }).filter(table => table.seats.length > 0);

    return { ...layout, tables: newTables };
  }, [layout, seatFilter]);

  const unseatedGuests = useMemo(() => {
    return guests.filter(g => !g.seatAssignment);
  }, [guests, layout]);


  const guestOptions = guests.map(g => ({
      value: g.id,
      label: `${g.fullName} (${g.organization})`,
  }));

  const selectedGuestForPanel = guests.find(g => g.id === selectedGuestId);

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
                 <Select value={seatFilter} onValueChange={(value) => setSeatFilter(value as any)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter seats..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Seats</SelectItem>
                        <SelectItem value="empty">Empty Seats</SelectItem>
                        <SelectItem value="vip">VIP Seats</SelectItem>
                        <SelectItem value="unseated">Unseated Guests</SelectItem>
                    </SelectContent>
                </Select>
                <AlertDialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button variant="secondary"><Wand2 /> Auto-arrange</Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent><p>Automatically assign seats based on guest rank.</p></TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Auto-arrange</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will automatically assign guests to seats based on a simplified ranking. This is a prototype action. Existing assignments will be overridden.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleAutoArrange}>Run Auto-arrange</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Button asChild variant="outline">
                  <Link href={`/protocol-admin/events/${eventId}/seating-plan/print`} target="_blank">
                    <Printer /> Print Plan
                  </Link>
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
                    Assigning a seat for <strong>{activeGuestAssignment?.fullName}</strong>. Click an available empty seat below.
                </AlertDescription>
                 <Button variant="ghost" size="sm" className="mt-2 text-primary" onClick={cancelAssignmentMode}><X className="mr-2 h-4 w-4" />Cancel Assignment</Button>
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
          
        {seatFilter !== 'unseated' && <SeatingLegend />}

        {seatFilter === 'unseated' ? (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Unseated Guests</CardTitle>
                    <CardDescription>{unseatedGuests.length} accepted guests still need a seat.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-96">
                        <div className="space-y-3 pr-4">
                            {unseatedGuests.map(guest => (
                                <Card key={guest.id} className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{guest.fullName}</p>
                                            <p className="text-sm text-muted-foreground">{guest.organization}</p>
                                            <Badge variant="outline" className="mt-1">{guest.category}</Badge>
                                        </div>
                                        <Button size="sm" onClick={() => {
                                            setActiveGuestAssignment(guest);
                                            setSeatFilter('empty');
                                        }}>
                                            <UserPlus /> Assign Seat
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        ) : (
            <div className="bg-background border rounded-lg p-4 sm:p-6 lg:p-8 space-y-8">
                {filteredLayout && filteredLayout.tables.length > 0 ? (
                    filteredLayout.tables.map(table => (
                        <SeatingTable key={table.id} table={table} onSeatSelect={handleSeatSelect} isAssignmentMode={isAssignmentMode} />
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-16">
                        <p>No seats match the current filter.</p>
                    </div>
                )}
            </div>
        )}
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
                    <Button onClick={handleAssignSeatFromPanel} disabled={!selectedGuestId}>Assign Seat</Button>
                </div>
            </div>
        </SheetContent>
    </Sheet>
    </>
  );
}
