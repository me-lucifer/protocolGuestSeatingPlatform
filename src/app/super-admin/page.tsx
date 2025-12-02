
'use client';

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
    Warehouse
} from 'lucide-react';
import Link from 'next/link';

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
        title: 'System Settings',
        description: 'Configure authentication, integrations, and feature flags.',
        href: '/super-admin/settings',
        icon: Shield
    },
    {
        title: 'Branding & Templates',
        description: 'Customize platform appearance and email communications.',
        href: '#',
        icon: Palette
    },
    {
        title: 'Audit & Logs',
        description: 'Review system activity and access logs for security.',
        href: '#',
        icon: ScrollText
    }
]

export default function SuperAdminDashboard() {
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
              <CardTitle className="section-title">Administration</CardTitle>
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
    </div>
  );
}
