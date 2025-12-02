
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import type { Guest } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type AddGuestProps = {
    onAddGuest: (newGuest: Omit<Guest, 'id' | 'eventId'>) => void;
}

const guestCategories: Guest['category'][] = ['VIP', 'Diplomatic', 'Press', 'Staff'];

export function AddGuestDialog({ onAddGuest }: AddGuestProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState<Guest['category']>('Diplomatic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !organization) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Full Name and Organization are required.",
        });
        return;
    }

    onAddGuest({
      fullName,
      title,
      organization,
      category,
      delegation: organization, // Simple default for demo
      rankLevel: 10, // Default rank
      rsvpStatus: 'Invited',
      seatAssignment: null,
      checkInStatus: 'Not Arrived',
      checkInTime: null,
      email: `${fullName.toLowerCase().replace(/\s/g, '.')}@example.com`,
      lastEmailSent: null
    });

    toast({
        title: 'Guest Added (Demo)',
        description: `${fullName} has been added to the guest list for this session.`
    });
    
    // Reset form and close dialog
    setFullName('');
    setTitle('');
    setOrganization('');
    setCategory('Diplomatic');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Guest (Demo)</DialogTitle>
          <DialogDescription>
            Enter the details for the new guest. This guest will only be added for this demo session.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g., Dr. Jane Doe" required />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Deputy Minister" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" value={organization} onChange={e => setOrganization(e.target.value)} placeholder="e.g., Ministry of Innovation" required />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(value: Guest['category']) => setCategory(value)}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {guestCategories.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Guest</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
