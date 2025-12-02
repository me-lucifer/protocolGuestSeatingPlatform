
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClientButton from "./client-button";
import { Shield, FileClock, Languages, ToggleRight } from "lucide-react";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { featureFlags, setFeatureFlag } = useFeatureFlags();
  const { toast } = useToast();

  const handleFlagToggle = (flag: keyof typeof featureFlags, value: boolean) => {
    setFeatureFlag(flag, value);
    toast({
      title: 'Feature Flag Updated (Demo)',
      description: `"${flag}" has been ${value ? 'enabled' : 'disabled'}.`
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="page-title">Platform Settings</CardTitle>
          <CardDescription>Manage application-wide configurations. This is a demo and actions are not saved.</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="section-title flex items-center gap-2"><Shield /> Security</CardTitle>
              <CardDescription>Manage security policies and authentication methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="sso" className="font-semibold">Single Sign-On (SSO)</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect to a SAML or OIDC identity provider.
                  </p>
                </div>
                <Select defaultValue="saml">
                  <SelectTrigger id="sso" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Disabled</SelectItem>
                    <SelectItem value="saml">SAML</SelectItem>
                    <SelectItem value="oidc">OpenID Connect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="mfa" className="font-semibold">Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    Require all users to use a second factor for login.
                  </p>
                </div>
                <Switch id="mfa" defaultChecked />
              </div>
              <div>
                <Label>Password Policy (demo)</Label>
                <p className="text-sm text-muted-foreground">
                  Minimum 12 characters, including uppercase, lowercase, number, and symbol.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="section-title flex items-center gap-2"><ToggleRight /> Feature Flags</CardTitle>
              <CardDescription>Enable or disable features across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="ff-2d-seating" className="font-semibold">Enable 2D Seating Plan</Label>
                  <p className="text-sm text-muted-foreground">Core seating arrangement interface.</p>
                </div>
                <Switch 
                  id="ff-2d-seating"
                  checked={featureFlags.enable2DSeating}
                  onCheckedChange={(value) => handleFlagToggle('enable2DSeating', value)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="ff-3d-preview" className="font-semibold">Enable Experimental 3D Preview</Label>
                  <p className="text-sm text-muted-foreground">Adds a 3D visualization to the seating plan.</p>
                </div>
                <Switch 
                  id="ff-3d-preview"
                  checked={featureFlags.enable3DPreview}
                  onCheckedChange={(value) => handleFlagToggle('enable3DPreview', value)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="ff-multi-org" className="font-semibold">Enable Multi-Organization Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow multiple ministries to manage their own events.</p>
                </div>
                 <Switch 
                  id="ff-multi-org"
                  checked={featureFlags.enableMultiOrg}
                  onCheckedChange={(value) => handleFlagToggle('enableMultiOrg', value)}
                />
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="section-title flex items-center gap-2"><FileClock /> Data & Logging</CardTitle>
              <CardDescription>Configure data retention and logging policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="log-retention" className="font-semibold">Audit Log Retention</Label>
                  <p className="text-sm text-muted-foreground">
                    How long to keep detailed system audit logs.
                  </p>
                </div>
                <Select defaultValue="365">
                  <SelectTrigger id="log-retention" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="1825">5 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="section-title flex items-center gap-2"><Languages /> Language & Localization</CardTitle>
              <CardDescription>Set default language and regional settings for the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="default-locale" className="font-semibold">Default Language</Label>
                  <p className="text-sm text-muted-foreground">
                    The default language for new users and public pages.
                  </p>
                </div>
                <Select defaultValue="en-US">
                  <SelectTrigger id="default-locale" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="en-US">English (US)</SelectItem>
                     <SelectItem value="en-GB">English (GB)</SelectItem>
                     <SelectItem value="fr-FR">French (France)</SelectItem>
                     <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Actions here are for demonstration and will not persist.</p>
              <ClientButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
