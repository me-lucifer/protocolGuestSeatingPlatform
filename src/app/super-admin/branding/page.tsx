
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Building2, Upload } from 'lucide-react';
import Image from 'next/image';

export default function BrandingPage() {
  const { toast } = useToast();
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [accentColor, setAccentColor] = useState('#f1f5f9');

  const handleSave = () => {
    toast({
      title: 'Settings Saved (Demo)',
      description: 'Your branding and template changes have been updated for this session.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="page-title">Branding & Email Templates</CardTitle>
          <CardDescription>
            Customize the platform's appearance and the content of automated emails.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="section-title">Visual Branding</CardTitle>
              <CardDescription>Manage your organization's logo and color scheme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Organization Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center border">
                     <Image src="https://picsum.photos/seed/logo/80/80" alt="Organization Logo" width={80} height={80} className="rounded-md" data-ai-hint="logo company" />
                  </div>
                  <Button variant="outline"><Upload /> Upload new logo (demo)</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input id="primary-color" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <Input id="accent-color" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="section-title">Email Templates</CardTitle>
               <CardDescription>Use placeholders like {"{{guestName}}"}, {"{{eventName}}"}, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Invitation Email</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="invite-subject">Subject</Label>
                      <Input id="invite-subject" defaultValue="You are invited to {{eventName}}" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invite-body">Body</Label>
                      <Textarea id="invite-body" rows={6} defaultValue="Dear {{guestName}},\n\nIt is with great pleasure that we invite you to the {{eventName}}. Your presence would greatly honor the occasion." />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>RSVP Confirmation Email</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                     <div className="space-y-2">
                      <Label htmlFor="confirm-subject">Subject</Label>
                      <Input id="confirm-subject" defaultValue="Confirmation for {{eventName}}" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-body">Body</Label>
                      <Textarea id="confirm-body" rows={6} defaultValue="Dear {{guestName}},\n\nThank you for confirming your attendance for the {{eventName}}. Your QR code for entry is attached to this email." />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
             <CardFooter>
                 <Button onClick={handleSave}>Save Changes (demo)</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="section-title">Live Preview</CardTitle>
                    <CardDescription>A sample of how your branding will look.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Card className="w-full" style={{ backgroundColor: accentColor }}>
                        <CardHeader>
                            <CardTitle style={{ color: primaryColor }}>Sample Card Title</CardTitle>
                            <CardDescription>This is a sample description.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button style={{ backgroundColor: primaryColor, color: '#ffffff' }}>Sample Button</Button>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
