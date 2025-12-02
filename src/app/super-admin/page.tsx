
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Building,
    Users,
    Calendar,
    Palette,
    Shield,
    ScrollText,
    Warehouse,
    Eye,
    Pencil,
    Settings,
    BookOpen,
    Info,
    X,
    Lightbulb,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDemo } from '@/contexts/DemoContext';

const metricCards = [
  {
    title: 'Managed Organizations',
    value: '3',
    description: '1 Core + 2 Ministries',
    icon: Building,
  },
  {
    title: 'Active Users',
    value: '12',
    description: '(Admins & Officers)',
    icon: Users,
  },
  {
    title: 'Total Events',
    value: '3',
    description: 'Across the platform',
    icon: Calendar,
  },
];

const navCards = [
    {
        title: 'Organizations & Environments',
        description: 'Manage directorates, ministries, and their settings.',
        href: '/super-admin/organizations',
        icon: Warehouse
    },
    {
        title: 'Users & Roles',
        description: 'Manage user accounts and role-based access control.',
        href: '/super-admin/users',
        icon: Users
    },
    {
        title: 'Branding & Templates',
        description: 'Customize platform appearance and email communications.',
        href: '/super-admin/branding',
        icon: Palette
    },
    {
        title: 'System Settings',
        description: 'Configure authentication, integrations, and feature flags.',
        href: '/super-admin/settings',
        icon: Shield
    },
    {
        title: 'Audit & Logs',
        description: 'Review system activity and access logs for security.',
        href: '/super-admin/audit',
        icon: ScrollText
    }
]

const roleDefinitions = [
    {
        name: 'Super Admin',
        icon: Shield,
        permissions: [
            { module: 'User Management', access: 'Read/Write' },
            { module: 'System Settings', access: 'Read/Write' },
            { module: 'Organization Management', access: 'Read/Write' },
            { module: 'Audit Logs', access: 'Read-only' },
        ]
    },
    {
        name: 'Protocol Admin',
        icon: Pencil,
        permissions: [
            { module: 'Event Management', access: 'Read/Write' },
            { module: 'Guest Management', access: 'Read/Write' },
            { module: 'Seating Plans', access: 'Read/Write' },
            { module: 'Reporting', access: 'Read-only' },
        ]
    },
    {
        name: 'Protocol Officer',
        icon: Eye,
        permissions: [
            { module: 'Guest Check-in', access: 'Read/Write' },
            { module: 'Guest List Search', access: 'Read-only' },
            { module: 'Seating Information', access: 'Read-only' },
        ]
    }
]

export default function SuperAdminDashboard() {
  const { isDemoMode } = useDemo();
  const [showDemoTips, setShowDemoTips] = useState(true);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="page-title">Super Admin Dashboard</CardTitle>
          <CardDescription>
            Platform-wide governance, settings, and administration.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {isDemoMode && showDemoTips && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Demo Tips for Super Admin</AlertTitle>
          <AlertDescription>
              <p>This dashboard is for platform-wide governance. Key areas to highlight:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Users & Roles:</strong> Show how new users can be created and roles assigned.</li>
                  <li><strong>Feature Flags (in Settings):</strong> Demonstrate how features can be toggled globally.</li>
                  <li><strong>Audit & Logs:</strong> Emphasize the importance of security and oversight.</li>
              </ul>
          </AlertDescription>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setShowDemoTips(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
          </Button>
        </Alert>
      )}

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {metricCards.map((metric) => (
            <Card key={metric.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                </CardContent>
            </Card>
        ))}
      </div>

      {/* Navigation Cards */}
      <Card>
          <CardHeader>
              <CardTitle className="section-title">Administration Modules</CardTitle>
              <CardDescription>Access key modules for platform management.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
              {navCards.map(card => (
                  <Link href={card.href} key={card.title} className="block group">
                    <Card className="h-full hover:bg-accent hover:border-primary/20 transition-colors">
                        <CardHeader className="flex flex-row items-start gap-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <card.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-primary/90">{card.title}</CardTitle>
                                <CardDescription>{card.description}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                  </Link>
              ))}
          </CardContent>
      </Card>

      {/* About & Scenarios Card */}
        <Card>
            <CardHeader>
                <CardTitle className="section-title flex items-center gap-2">
                    <Info />
                    About & Scenarios
                </CardTitle>
                <CardDescription>
                    The Protocol Platform is a secure, centralized solution for managing high-stakes events with a focus on protocol, security, and efficiency.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <h4 className="font-semibold text-foreground mb-3">Example Scenarios</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mb-6">
                    <li>
                        <strong>State Ceremony:</strong> Manage formal events with strict adherence to national and international protocol, ensuring precedence is respected.
                    </li>
                    <li>
                        <strong>Diplomatic Reception:</strong> Handle large-scale social gatherings for international guests, with complex delegation and seating requirements.
                    </li>
                    <li>
                        <strong>High-Level Conference:</strong> Coordinate multi-day events with dynamic agendas, multiple venues, and secure access control for attendees.
                    </li>
                </ul>
                <Button variant="outline" asChild>
                    <Link href="#">
                        <BookOpen />
                        View Documentation (Coming Soon)
                    </Link>
                </Button>
            </CardContent>
        </Card>

      {/* Role Definitions */}
      <Card>
          <CardHeader>
              <CardTitle className="section-title">Role Definitions</CardTitle>
              <CardDescription>Informational overview of user roles and their permissions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
              {roleDefinitions.map(role => (
                <Card key={role.name}>
                    <CardHeader className="flex-row items-center gap-3">
                        <div className="p-2 bg-muted rounded-md">
                            <role.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-sm">
                            {role.permissions.map(p => (
                                <li key={p.module} className="flex justify-between">
                                    <span className="text-foreground">{p.module}</span>
                                    <span className="text-muted-foreground">{p.access}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
              ))}
          </CardContent>
      </Card>
    </div>
  );
}
