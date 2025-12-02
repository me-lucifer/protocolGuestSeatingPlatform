
'use client';

import { useParams, useRouter } from 'next/navigation';
import { type Event, type Guest } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserCheck,
  UserX,
  XCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
  Printer,
  Download,
} from 'lucide-react';
import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useDemoData } from '@/contexts/DemoContext';

export default function EventSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { events, guests: allGuests } = useDemoData();

  const event: Event | undefined = useMemo(() => events.find((e) => e.id === id), [events, id]);
  const guests: Guest[] = useMemo(() => allGuests.filter((g) => g.eventId === id), [allGuests, id]);

  const stats = useMemo(() => {
    if (!guests) return null;
    const accepted = guests.filter(g => g.rsvpStatus === 'Accepted').length;
    const checkedIn = guests.filter(g => g.checkInStatus === 'Checked-in').length;
    const absent = accepted - checkedIn;
    const declined = guests.filter(g => g.rsvpStatus === 'Declined').length;
    const invited = guests.length;
    const noResponse = invited - accepted - declined;
    const lateArrivals = guests.filter(g => g.isLate).length;

    return { accepted, checkedIn, absent, declined, noResponse, invited, lateArrivals };
  }, [guests]);

  const chartData = [
    { name: 'RSVP', Accepted: stats?.accepted, Declined: stats?.declined, 'No Response': stats?.noResponse },
  ];

  const chartConfig = {
    Accepted: { label: 'Accepted', color: 'hsl(var(--chart-2))' },
    Declined: { label: 'Declined', color: 'hsl(var(--destructive))' },
    'No Response': { label: 'No Response', color: 'hsl(var(--muted))' },
  } satisfies import('@/components/ui/chart').ChartConfig;


  if (!event || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested event summary could not be generated.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <style type="text/css" media="print">
        {`
          @page { size: auto; margin: 20mm; }
          body { -webkit-print-color-adjust: exact; background-color: white !important; }
          .no-print { display: none !important; }
          .page-shell-container { display: none !important; }
          .print-container { padding: 0 !important; }
          .print-card { box-shadow: none !important; border: none !important; }
        `}
      </style>
      <div className="flex justify-center print-container">
        <Card className="w-full max-w-4xl print-card">
          <CardHeader>
            <CardDescription>Post-Event Summary Report</CardDescription>
            <CardTitle className="page-title">{event.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Generated on {format(new Date(), 'PPPP')}
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="section-title mb-4">Final Attendance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Invited</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.invited}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                    <UserCheck className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.checkedIn}</div>
                    <p className="text-xs text-muted-foreground">out of {stats.accepted} accepted</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Absent</CardTitle>
                    <UserX className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.absent}</div>
                    <p className="text-xs text-muted-foreground">accepted but did not attend</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.lateArrivals}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <h3 className="section-title mb-4">RSVP Breakdown</h3>
              <div className="h-48">
                <ChartContainer config={chartConfig}>
                  <BarChart data={chartData} layout="vertical" stackOffset="expand">
                    <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={false} />
                    <XAxis type="number" hide={true} />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="Accepted" fill="var(--color-Accepted)" radius={[4, 0, 0, 4]} />
                    <Bar dataKey="No Response" fill="var(--color-No Response)" />
                    <Bar dataKey="Declined" fill="var(--color-Declined)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="mt-4 flex justify-around text-center text-sm">
                  <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]"></div> <div>Accepted: {stats.accepted}</div></div>
                  <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-[hsl(var(--muted))]"></div> <div>No Response: {stats.noResponse}</div></div>
                  <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-[hsl(var(--destructive))]"></div> <div>Declined: {stats.declined}</div></div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row justify-between gap-2 border-t pt-6 no-print">
            <Button variant="outline" onClick={() => router.push(`/protocol-admin/events/${id}`)}>
              <ArrowLeft />
              Back to Event
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => window.print()}>
                  <Printer />
                  Print Report
              </Button>
              <Button>
                  <Download />
                  Download PDF (demo)
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
