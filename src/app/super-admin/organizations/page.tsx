
'use client';

import { useState, useEffect } from 'react';
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
import { Pencil } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useDemoData } from '@/contexts/DemoContext';
import type { Organization } from '@/lib/data';

const timezones = ['UTC-8', 'UTC-7', 'UTC-6', 'UTC-5', 'UTC-4', 'UTC'];
const locales = ['en-US', 'en-GB', 'fr-CA', 'fr-FR', 'es-ES'];

function EditOrganizationSheet({
  org,
  isOpen,
  onOpenChange,
  onSave,
}: {
  org: Organization;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedOrg: Organization) => void;
}) {
  const [formData, setFormData] = useState(org);

  useEffect(() => {
    setFormData(org);
  }, [org]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Organization</SheetTitle>
          <SheetDescription>
            Update the details for {org.name}.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="org-short-code">Short Code / Acronym</Label>
            <Input
              id="org-short-code"
              value={formData.shortCode}
              onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="org-timezone">Default Timezone</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => setFormData({ ...formData, timezone: value })}
            >
              <SelectTrigger id="org-timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="org-locale">Default Locale</Label>
            <Select
              value={formData.locale}
              onValueChange={(value) => setFormData({ ...formData, locale: value })}
            >
              <SelectTrigger id="org-locale">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locales.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Save Changes (demo)</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default function OrganizationsPage() {
  const { organizations: initialOrganizations } = useDemoData();
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setOrganizations(initialOrganizations);
  }, [initialOrganizations]);

  const handleEditClick = (org: Organization) => {
    setSelectedOrg(org);
    setIsSheetOpen(true);
  };

  const handleSave = (updatedOrg: Organization) => {
    setOrganizations((prevOrgs) =>
      prevOrgs.map((o) => (o.id === updatedOrg.id ? updatedOrg : o))
    );
    toast({
      title: 'Organization Updated (Demo)',
      description: `${updatedOrg.name} has been updated in this session.`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="page-title">Organizations & Environments</CardTitle>
          <CardDescription>
            Manage the different organizations using this platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{org.type}</Badge>
                  </TableCell>
                  <TableCell>{org.eventCount}</TableCell>
                  <TableCell>
                    <Badge variant={org.status === 'Active' ? 'default' : 'secondary'}>
                      {org.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(org)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit {org.name}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedOrg && (
        <EditOrganizationSheet
          org={selectedOrg}
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onSave={handleSave}
        />
      )}
    </>
  );
}
