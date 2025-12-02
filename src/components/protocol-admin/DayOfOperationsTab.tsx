
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { guests as allGuests, type Guest } from '@/lib/data';
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
import { Progress } from '@/components/ui/progress';
import { UserCheck, Users, UserX, ExternalLink } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export function DayOfOperationsTab({ eventId }: { eventId: string }) {
  const [guests, setGuests] = useState(() => allGuests.filter(g => g.eventId === eventId));

  const checkInStats = useMemo(() => {
    const expected = guests.filter(g => g.rsvpStatus === 'Accepted').length;
    const checkedIn = guests.filter(g => g.checkInStatus === 'Checked-in').length;
    const absent = expected - checkedIn;
    const progress = expected > 0 ? (checkedIn / expected) * 100 : 0;
    return { expected, checkedIn, absent, progress };
  }, [guests]);
  
  const recentCheckIns = useMemo(() => {
    return guests
      .filter(g => g.checkInStatus === 'Checked-in')
      .sort((a,b) => a.fullName.localeCompare(b.fullName)) // Deterministic sort for demo
      .slice(0, 5);
  }, [guests]);

  const chartData = [
    { name: 'Status', checkedIn: checkInStats.checkedIn, expected: checkInStats.expected },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="section-title">Live Check-in Dashboard</CardTitle>
                    <CardDescription>Monitor guest arrivals in real-time.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                      <ChartContainer config={{}}>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="checkedIn" fill="var(--color-chart-2)" radius={4} name="Checked-in" />
                          <Bar dataKey="expected" fill="var(--color-chart-1)" radius={4} name="Expected" />
                        </BarChart>
                      </ChartContainer>
                    </div>

                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
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
                                    <TableCell className="font-mono">{guest.seatAssignment}</TableCell>
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
                    <CardTitle className="section-title">Officer Tools</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Launch the dedicated interface for on-site staff to manage guest arrivals.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/protocol-officer">
                            <ExternalLink />
                            Open Protocol Officer View
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
