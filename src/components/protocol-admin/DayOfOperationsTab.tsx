
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { type Guest, type Event } from '@/lib/data';
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
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserCheck, Users, UserX, ExternalLink, RotateCcw, MonitorSmartphone, Star, Clock, FileText, XCircle, HelpCircle, CheckCircle } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
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
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useDemoData } from '@/contexts/DemoContext';

export function DayOfOperationsTab({ eventId }: { eventId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const { guests: allGuests, events: allEvents, resetDemoData, setEvents } = useDemoData();

  const [_, setForceUpdate] = useState(0); // Used to trigger re-renders for demo
  const [isVipFocus, setIsVipFocus] = useState(false);
  const [simulatedTime] = useState('19:25');

  // This effect simulates real-time updates for the dashboard
  useEffect(() => {
    const interval = setInterval(() => {
        setForceUpdate(v => v + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const guests = useMemo(() => allGuests.filter(g => g.eventId === eventId), [allGuests, eventId]);

  const event = useMemo(() => allEvents.find(e => e.id === eventId), [allEvents, eventId]);

  const checkInStats = useMemo(() => {
    const expected = guests.filter(g => g.rsvpStatus === 'Accepted').length;
    const checkedIn = guests.filter(g => g.checkInStatus === 'Checked-in').length;
    const lateArrivals = guests.filter(g => g.isLate).length;
    const absent = expected - checkedIn;
    const progress = expected > 0 ? (checkedIn / expected) * 100 : 0;
    const declined = guests.filter(g => g.rsvpStatus === 'Declined').length;
    const invited = guests.length;
    return { expected, checkedIn, absent, progress, lateArrivals, declined, invited };
  }, [guests]);
  
  const recentCheckIns = useMemo(() => {
    return guests
      .filter(g => g.checkInStatus === 'Checked-in' && g.checkInTime)
      .sort((a,b) => new Date(b.checkInTime!).getTime() - new Date(a.checkInTime!).getTime())
      .slice(0, 5);
  }, [guests]);

  const lateGuests = useMemo(() => {
      return guests.filter(g => g.isLate);
  }, [guests]);

  const vipGuests = useMemo(() => {
    return guests.filter(g => g.category === 'VIP');
  }, [guests]);

  const chartData = [
    { name: 'Status', checkedIn: checkInStats.checkedIn, absent: checkInStats.absent },
  ];
  
  const chartConfig = {
    checkedIn: {
      label: "Checked-in",
      color: "hsl(var(--chart-2))",
    },
    absent: {
      label: "Absent",
      color: "hsl(var(--muted))",
    },
  } satisfies import('@/components/ui/chart').ChartConfig;

  const handleResetState = () => {
    resetDemoData();
    toast({
      title: 'Demo State Reset',
      description: 'All demo data has been reset to its initial state.',
    });
  };

  const handleCloseEvent = () => {
    setEvents(prevEvents => prevEvents.map(e => e.id === eventId ? { ...e, status: 'Completed' } : e));
    router.push(`/protocol-admin/events/${eventId}/summary`);
  };

  const getCheckInStatusVariant = (status: Guest['checkInStatus']) => {
    switch (status) {
        case 'Checked-in': return 'default';
        default: return 'secondary';
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle className="section-title">Live Check-in Dashboard</CardTitle>
                            <CardDescription>Monitor guest arrivals in real-time. Data refreshes for demo purposes.</CardDescription>
                        </div>
                         <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="font-bold text-lg">{simulatedTime}</p>
                                <p className="text-xs text-muted-foreground">Simulated Clock</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="vip-focus-mode" checked={isVipFocus} onCheckedChange={setIsVipFocus} />
                                <Label htmlFor="vip-focus-mode" className="flex items-center gap-2"><Star className="text-yellow-500" /> VIP Focus</Label>
                            </div>
                         </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                     {isVipFocus && (
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2"><Star /> VIP Arrival Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>VIP Guest</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vipGuests.map(vip => (
                                            <TableRow key={vip.id}>
                                                <TableCell className="font-medium">{vip.fullName}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={getCheckInStatusVariant(vip.checkInStatus)}>
                                                        {vip.checkInStatus}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Expected Guests</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-2xl font-bold">{checkInStats.expected}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Checked-in</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-2xl font-bold">{checkInStats.checkedIn}</div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Absent (so far)</CardTitle>
                            <UserX className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-2xl font-bold">{checkInStats.absent}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-base font-semibold text-foreground">Check-in Progress</h3>
                            <span className="text-sm font-medium text-muted-foreground">{checkInStats.checkedIn} / {checkInStats.expected} Guests ({Math.round(checkInStats.progress)}%)</span>
                        </div>
                        <Progress value={checkInStats.progress} />
                    </div>

                     <div className="h-48">
                      <ChartContainer config={chartConfig}>
                        <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                           <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tick={false}
                          />
                          <XAxis dataKey="expected" type="number" hide />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" hideLabel />}
                          />
                          <Bar
                            dataKey="checkedIn"
                            stackId="a"
                            fill="var(--color-checkedIn)"
                            radius={[4, 0, 0, 4]}
                          />
                          <Bar
                            dataKey="absent"
                            stackId="a"
                            fill="var(--color-absent)"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>

                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="section-title flex items-center gap-2">
                        <Clock />
                        Late Arrivals (demo)
                    </CardTitle>
                    <CardDescription>Guests who checked in after the {event ? `event start time of ${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'event start time'}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold mb-2">{checkInStats.lateArrivals}</div>
                    {lateGuests.length > 0 && (
                         <ScrollArea className="h-24">
                            <ul className="text-sm space-y-1 text-muted-foreground">
                                {lateGuests.map(guest => (
                                    <li key={guest.id}>{guest.fullName}</li>
                                ))}
                            </ul>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="section-title">Recent Check-ins</CardTitle>
                    <CardDescription>Latest guests to arrive.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Guest</TableHead>
                                <TableHead>Seat</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentCheckIns.length > 0 ? recentCheckIns.map(guest => (
                                <TableRow key={guest.id}>
                                    <TableCell>
                                        <div className="font-medium">{guest.fullName}</div>
                                        <div className="text-xs text-muted-foreground">{guest.organization}</div>
                                    </TableCell>
                                    <TableCell className="font-mono">{guest.seatAssignment || 'N/A'}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground">No guests checked in yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="section-title">Active Officers (demo)</CardTitle>
                    <CardDescription>Simulated list of on-site staff.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-foreground"><MonitorSmartphone /> Officer at Entrance A</span>
                            <Badge variant="secondary">Online</Badge>
                        </li>
                        <li className="flex items-center justify-between">
                             <span className="flex items-center gap-2 text-foreground"><MonitorSmartphone /> Officer at Entrance B</span>
                            <Badge variant="secondary">Online</Badge>
                        </li>
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="section-title">Demo Scenario Helper</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        <strong>Demo idea:</strong> Start here to see the admin's live view. Then, open the Protocol Officer view to simulate guest check-ins and watch this dashboard update in real-time.
                    </p>
                    <div className="space-y-2">
                        <Button asChild className="w-full">
                            <Link href="/protocol-officer" target="_blank">
                                <ExternalLink />
                                Open Officer View (demo)
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <RotateCcw />
                                    Reset Demo State
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Reset</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will reset all check-in data for this event. Guest statuses will be set to "Not Arrived" and recent check-in lists will be cleared. Are you sure?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleResetState}>Confirm Reset</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full" disabled={event?.status === 'Completed'}>
                                    <FileText />
                                    Close Event (demo)
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Event Summary: {event?.name}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Below is the final attendance summary. Closing the event will mark it as 'Completed'.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="text-sm my-4 space-y-2">
                                     <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground flex items-center gap-2"><Users/> Total Invited</span>
                                        <span className="font-bold">{checkInStats.invited}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground flex items-center gap-2"><UserCheck/> Accepted & Expected</span>
                                        <span className="font-bold">{checkInStats.expected}</span>
                                    </div>
                                     <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground flex items-center gap-2"><CheckCircle className="text-green-500" /> Checked In</span>
                                        <span className="font-bold">{checkInStats.checkedIn}</span>
                                    </div>
                                     <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground flex items-center gap-2"><UserX className="text-red-500" /> Not Arrived (Absent)</span>
                                        <span className="font-bold">{checkInStats.absent}</span>
                                    </div>
                                     <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground flex items-center gap-2"><XCircle/> Declined</span>
                                        <span className="font-bold">{checkInStats.declined}</span>
                                    </div>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleCloseEvent}>Generate Summary Report (demo)</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
