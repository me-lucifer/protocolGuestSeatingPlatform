
'use client';

import { useState, useMemo, useEffect } from 'react';
import { type User, type UserRole } from '@/lib/data';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserPlus, Trash2, SlidersHorizontal } from 'lucide-react';
import { AddUserDialog } from '@/components/super-admin/AddUserDialog';
import { useToast } from '@/hooks/use-toast';
import { useDemoData } from '@/contexts/DemoContext';

const userRoles: UserRole[] = ['Super Admin', 'Protocol Admin', 'Protocol Officer'];

export default function UsersPage() {
  const { users: initialUsers, organizations, setUsers: setInitialUsers } = useDemoData();
  const [users, setUsers] = useState(initialUsers);
  const [roleFilter, setRoleFilter] = useState('all');
  const [orgFilter, setOrgFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesOrg = orgFilter === 'all' || user.organization === orgFilter;
        return matchesRole && matchesOrg;
    });
  }, [users, roleFilter, orgFilter]);
  
  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    const userWithId: User = { ...newUser, id: `usr-${Date.now()}` };
    setInitialUsers(prev => [...prev, userWithId]);
  };
  
  const handleToggleStatus = (userId: string) => {
    setInitialUsers(prev => prev.map(user => {
        if (user.id === userId) {
            const newStatus = user.status === 'Active' ? 'Disabled' : 'Active';
            toast({
                title: `User ${newStatus}`,
                description: `${user.name}'s account has been ${newStatus.toLowerCase()}.`
            });
            return { ...user, status: newStatus };
        }
        return user;
    }));
  };

  const getStatusVariant = (status: User['status']) => {
    return status === 'Active' ? 'default' : 'secondary';
  }

  const getRoleVariant = (role: User['role']) => {
    switch(role) {
        case 'Super Admin': return 'destructive';
        case 'Protocol Admin': return 'default';
        case 'Protocol Officer': return 'secondary';
        default: return 'outline';
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <CardTitle className="page-title">Users & Roles</CardTitle>
                    <CardDescription>
                        Manage user accounts, roles, and platform access.
                    </CardDescription>
                </div>
                <AddUserDialog organizations={organizations.map(o => o.name)} onAddUser={handleAddUser} />
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {userRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
                </Select>
                 <Select value={orgFilter} onValueChange={setOrgFilter}>
                <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Filter by organization" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Organizations</SelectItem>
                    {organizations.map(o => <SelectItem key={o.id} value={o.name}>{o.name}</SelectItem>)}
                </SelectContent>
                </Select>
            </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                      <div>{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                      <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.organization}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                {user.status === 'Active' ? 'Disable' : 'Enable'} User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredUsers.length === 0 && (
            <div className="text-center text-muted-foreground p-8">
                No users found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
