import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ClientButton from "./client-button";

export default function SettingsPage() {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="page-title">Platform Settings</CardTitle>
        <CardDescription>Manage application-wide configurations. This is a demo and actions are not saved.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="section-title mb-2">General</h2>
          <p>This is a placeholder for global settings management such as authentication providers, email templates, and feature flags.</p>
        </div>
        <ClientButton />
      </CardContent>
    </Card>
  );
}
