
'use client';

import { useState, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: 'Event Created' | 'Guest Imported' | 'User Login' | 'Settings Updated' | 'Guest Checked-in' | 'Seating Finalized';
  description: string;
};

const dummyLogs: AuditLog[] = [
    { id: 'log-001', timestamp: '2024-07-29T10:00:00Z', user: 'Bob Builder', userRole: 'Protocol Admin', action: 'Event Created', description: 'Created event: Annual Diplomatic Gala 2024' },
    { id: 'log-002', timestamp: '2024-07-29T10:05:00Z', user: 'Bob Builder', userRole: 'Protocol Admin', action: 'Guest Imported', description: 'Imported 250 guests to "Annual Diplomatic Gala 2024"' },
    { id: 'log-003', timestamp: '2024-07-29T11:00:00Z', user: 'Alice Wonder', userRole: 'Super Admin', action: 'Settings Updated', description: 'Updated authentication provider to "SAML"' },
    { id: 'log-004', timestamp: '2024-07-29T14:00:00Z', user: 'Charlie Chaplin', userRole: 'Protocol Officer', action: 'User Login', description: 'User logged in from IP: 192.168.1.100' },
    { id: 'log-005', timestamp: '2024-07-29T14:05:22Z', user: 'Charlie Chaplin', userRole: 'Protocol Officer', action: 'Guest Checked-in', description: 'Checked in guest: Minister Jane Smith' },
    { id: 'log-006', timestamp: '2024-07-29T09:30:00Z', user: 'Alice Wonder', userRole: 'Super Admin', action: 'User Login', description: 'User logged in from IP: 203.0.113.25' },
    { id: 'log-007', timestamp: '2024-07-28T16:00:00Z', user: 'Bob Builder', userRole: 'Protocol Admin', action: 'Seating Finalized', description: 'Seating plan for "Annual Diplomatic Gala 2024" was finalized.' },
];

const actionTypes = [...new Set(dummyLogs.map(log => log.action))];
const users = [...new Set(dummyLogs.map(log => log.user))];

export default function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    return dummyLogs.filter(log => {
        const matchesAction = actionFilter === 'all' || log.action === actionFilter;
        const matchesUser = userFilter === 'all' || log.user === userFilter;
        const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) || log.user.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesAction && matchesUser && matchesSearch;
    }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [actionFilter, userFilter, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="page-title">Audit & Logs</CardTitle>
        <CardDescription>
          Review system activity and access logs. This is a read-only demonstration.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by description or user..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionTypes.map(action => <SelectItem key={action} value={action}>{action}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map(log => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                <TableCell>
                    <div>{log.user}</div>
                    <div className="text-xs text-muted-foreground">{log.userRole}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{log.action}</Badge>
                </TableCell>
                <TableCell>{log.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredLogs.length === 0 && (
            <div className="text-center text-muted-foreground p-8">
                No logs found matching your criteria.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
