import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SuperAdminDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Super Admin Dashboard</CardTitle>
        <CardDescription>
          Platform-wide settings and administrative tools.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground p-8">
          <h3 className="text-lg font-semibold">Welcome, Administrator</h3>
          <p className="mt-2">
            This is a prototype. Functionality for managing platform settings, users, and roles would be available here.
          </p>
          <p className="mt-4 text-sm">Use the navigation on the left to explore available sections.</p>
        </div>
      </CardContent>
    </Card>
  );
}
