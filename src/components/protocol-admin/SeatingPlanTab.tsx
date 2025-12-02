

'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { type Guest, type RoomLayout, type Seat as SeatType, type Table as TableType } from '@/lib/data';
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
import { Printer, Wand2, User, Info, X, Hand, Star, Newspaper, Briefcase, UserPlus, Filter, Users, UserCheck } from 'lucide-react';
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
import { Progress } from '../ui/progress';
import { useDemoData } from '@/contexts/DemoContext';

// Handoff Note: The Seat component is designed to be a flexible representation of a physical seat.
// It's production-ready in terms of structure, but the styling and interactions can be enhanced.
// The different variants (empty, occupied, vip, etc.) are controlled by data and can be expanded.
function Seat({ seat, onSeatSelect, isAssignmentMode, guests }: { seat: any, onSeatSelect: (seat: any) => void, isAssignmentMode: boolean, guests: Guest[] }) {
    const guest = guests.find(g => g.id === seat.guestId);
    
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

function SeatingTable({ table, onSeatSelect, isAssignmentMode, guests }: { table: any, onSeatSelect: (seat: any) => void, isAssignmentMode: boolean, guests: Guest[] }) {
    if (table.seats.length === 0) return null;
    return (
        <div className="border rounded-lg p-4 bg-muted/20">
            <h4 className="font-semibold text-center mb-4 text-foreground">{table.name}</h4>
            <div className="flex flex-wrap gap-2 justify-center">
                {table.seats.map((seat: any) => {
                    return <Seat key={seat.id} seat={seat} onSeatSelect={() => onSeatSelect({ ...seat, tableName: table.name })} isAssignmentMode={isAssignmentMode} guests={guests} />;
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
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-xs">
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

// Handoff Note: This component is a core part of the event management workflow.
// The data management (`useState`, `useMemo`) is based on the demo context. In production,
// this would be replaced with API calls to fetch and update seating data. The UI components
// (Sheet, Combobox, etc.) are production-ready. The auto-arrange feature is a simplified
// placeholder and would need a more sophisticated algorithm based on real protocol rules.
export function SeatingPlanTab({ eventId, guestToAssign, onAssignmentComplete }: { eventId: string; guestToAssign: Guest | null; onAssignmentComplete: () => void; }) {
  const { toast } = useToast();
  const { featureFlags } = useFeatureFlags();
  const { guests: allGuests, roomLayouts: allRoomLayouts, setGuests, setRoomLayouts } = useDemoData();
  
  const [eventLayouts, setEventLayouts] = useState<RoomLayout[]>(() => allRoomLayouts.filter(rl => rl.eventId === eventId));
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>(eventLayouts[0]?.id || '');
  
  const [eventGuests, setEventGuests] = useState(() => allGuests.filter(g => g.eventId === eventId && g.rsvpStatus === 'Accepted'));
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<(SeatType & { tableName: string }) | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  const [activeGuestAssignment, setActiveGuestAssignment] = useState<Guest | null>(null);
  const [seatFilter, setSeatFilter] = useState<'all' | 'empty' | 'vip' | 'unseated'>('all');

  const isAssignmentMode = activeGuestAssignment !== null;

  useEffect(() => {
    // This effect ensures the component's state is updated if the global demo data changes.
    setEventLayouts(allRoomLayouts.filter(rl => rl.eventId === eventId));
    setEventGuests(allGuests.filter(g => g.eventId === eventId && g.rsvpStatus === 'Accepted'));
    if (!allRoomLayouts.find(l => l.id === selectedLayoutId)) {
        setSelectedLayoutId(allRoomLayouts.find(l => l.eventId === eventId)?.id || '');
    }
  }, [allGuests, allRoomLayouts, eventId, selectedLayoutId]);

  const currentLayout = useMemo(() => eventLayouts.find(l => l.id === selectedLayoutId), [eventLayouts, selectedLayoutId]);

  useEffect(() => {
    // This effect is for the demo "Assign Seat" feature from the guest list.
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
    let oldSeatLabel: string | undefined;

    // Handoff Note: This is a simplified conflict check for the demo.
    // A production system would need more robust, server-side validation to handle concurrent edits.
    allRoomLayouts.forEach(layout => {
        layout.tables.forEach(table => {
            const foundSeat = table.seats.find(s => s.guestId === guestId);
            if (foundSeat && foundSeat.id !== seat.id) {
                isAlreadySeated = true;
                oldSeatLabel = foundSeat.label;
            }
        });
    });

    if (isAlreadySeated) {
        toast({
            title: "Assignment Failed",
            description: `This guest is already assigned to seat ${oldSeatLabel}. Please clear that assignment first.`,
            variant: "destructive"
        });
        return false;
    }
    
    // In-memory data update for the demo.
    const newLayouts = allRoomLayouts.map(layout => {
      let layoutModified = false;
      const newTables = layout.tables.map(table => {
        let tableModified = false;
        const newSeats = table.seats.map(s => {
          if (s.guestId === guestId) { // Unseat from old seat
            tableModified = true;
            return { ...s, guestId: null };
          }
          if (s.id === seat.id) { // Assign to new seat
            tableModified = true;
            return { ...s, guestId: guestId };
          }
          return s;
        });

        if (tableModified) {
          layoutModified = true;
          return { ...table, seats: newSeats };
        }
        return table;
      });

      if (layoutModified) {
        return { ...layout, tables: newTables };
      }
      return layout;
    });

    setRoomLayouts(newLayouts);

    setGuests(prevGuests => prevGuests.map(g => {
        if (g.id === guestId) return { ...g, seatAssignment: seat.label };
        if (g.seatAssignment === seat.label) return { ...g, seatAssignment: null }; // Unassign whoever was in the new seat
        return g;
    }));

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

    // Demo-only in-memory update
    setRoomLayouts(prevLayouts => {
        return prevLayouts.map(layout => ({
            ...layout,
            tables: layout.tables.map(table => ({
                ...table,
                seats: table.seats.map(seat => 
                    seat.id === selectedSeat.id ? { ...seat, guestId: null } : seat
                )
            }))
        }));
    });

    setGuests(prev => prev.map(g => g.id === guestToUnseatId ? { ...g, seatAssignment: null } : g));

    const guest = allGuests.find(g => g.id === guestToUnseatId);
    toast({ title: "Seat Cleared", description: `${guest?.fullName || 'Guest'} has been unseated from ${selectedSeat.label}.` });
    setIsPanelOpen(false);
  };

  const handleAutoArrange = () => {
    // Handoff Note: This is a highly simplified auto-arrange for demo purposes.
    // A production version would require a sophisticated algorithm that considers
    // guest rank, delegations, avoidances, and other complex protocol rules.
    const acceptedGuests = allGuests.filter(g => g.eventId === eventId && g.rsvpStatus === 'Accepted');
    const sortedGuests = [...acceptedGuests].sort((a, b) => {
        if (a.rankLevel !== b.rankLevel) return a.rankLevel - b.rankLevel;
        return a.fullName.localeCompare(b.fullName);
    });

    let guestIndex = 0;
    const newLayouts = JSON.parse(JSON.stringify(eventLayouts));
    
    const unseatedGuestsList = sortedGuests.filter(g => !g.seatAssignment);
    let unseatedGuestIndex = 0;

    const newAllLayouts = allRoomLayouts.map(l => {
      if (l.eventId !== eventId) return l;
      
      const newTables = l.tables.map(t => {
        const newSeats = t.seats.map(s => {
          if (!s.guestId && unseatedGuestIndex < unseatedGuestsList.length) {
            const guestToSeat = unseatedGuestsList[unseatedGuestIndex];
            unseatedGuestIndex++;
            return { ...s, guestId: guestToSeat.id };
          }
          return s;
        });
        return { ...t, seats: newSeats };
      });
      return { ...l, tables: newTables };
    });

    setRoomLayouts(newAllLayouts);

    const seatedGuestIds = new Set(newAllLayouts.flatMap(l => l.tables.flatMap(t => t.seats.map(s => s.guestId).filter(Boolean))));
    
    setGuests(prev => prev.map(g => {
        if (seatedGuestIds.has(g.id)) {
            const seat = newAllLayouts.flatMap(l => l.tables.flatMap(t => t.seats)).find(s => s.guestId === g.id);
            return { ...g, seatAssignment: seat?.label || g.seatAssignment };
        }
        return g;
    }));

    toast({ title: 'Auto-arrange Complete (Demo)', description: 'Guests have been assigned to seats based on rank.' });
  }

  const seatingStats = useMemo(() => {
    if (!currentLayout) {
        return { total: 0, assigned: 0, unassigned: 0, progress: 0 };
    }
    const allSeats = currentLayout.tables.flatMap(table => table.seats);
    const total = allSeats.length;
    const assigned = allSeats.filter(seat => seat.guestId).length;
    const unassigned = total - assigned;
    const progress = total > 0 ? Math.round((assigned / total) * 100) : 0;

    return { total, assigned, unassigned, progress };
  }, [currentLayout]);

  const filteredLayout = useMemo(() => {
    if (!currentLayout || seatFilter === 'all' || seatFilter === 'unseated') return currentLayout;

    const newTables = currentLayout.tables.map(table => {
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

    return { ...currentLayout, tables: newTables };
  }, [currentLayout, seatFilter, allGuests]);

  const unseatedGuests = useMemo(() => {
    return eventGuests.filter(g => !g.seatAssignment);
  }, [eventGuests]);


  const guestOptions = eventGuests.map(g => ({
      value: g.id,
      label: `${g.fullName} (${g.organization})`,
  }));

  const selectedGuestForPanel = eventGuests.find(g => g.id === selectedGuestId);

  return (
    <TooltipProvider>
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle className="section-title">Seating Plan</CardTitle>
                <CardDescription>Arrange guest seating for this event.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
                 <Select value={selectedLayoutId} onValueChange={setSelectedLayoutId}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select a room..." />
                    </SelectTrigger>
                    <SelectContent>
                        {eventLayouts.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                    </SelectContent>
                </Select>
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
      <CardContent className="space-y-6">
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

        <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                    <p>Seating Progress ({currentLayout?.name})</p>
                    <p>{seatingStats.progress}% complete</p>
                </div>
                <Progress value={seatingStats.progress} />
                <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><Users /> Total Seats: <strong>{seatingStats.total}</strong></div>
                    <div className="flex items-center gap-2"><UserCheck /> Assigned: <strong>{seatingStats.assigned}</strong></div>
                    <div className="flex items-center gap-2"><User /> Unassigned: <strong>{seatingStats.unassigned}</strong></div>
                </div>
            </CardContent>
        </Card>
          
        <div className="flex justify-between items-center">
            {seatFilter !== 'unseated' && <SeatingLegend />}
        </div>


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
                        <SeatingTable key={table.id} table={table} onSeatSelect={handleSeatSelect} isAssignmentMode={isAssignmentMode} guests={allGuests} />
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
    </TooltipProvider>
  );
}
