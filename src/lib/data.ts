import { format } from 'date-fns';
import { Briefcase, CalendarCheck, CheckSquare, Fingerprint, Settings, Ticket, Users, type LucideIcon } from 'lucide-react';

export type Role = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  keyActions: string[];
};

export const roles: Role[] = [
  {
    name: 'Super Admin / IT Admin',
    description: 'For platform owners.',
    href: '/super-admin',
    icon: Fingerprint,
    keyActions: [
        'Manage platform-wide settings.',
        'Configure user roles and permissions.',
        'Monitor system health and logs.'
    ]
  },
  {
    name: 'Protocol Admin / Event Manager',
    description: 'For event planners.',
    href: '/protocol-admin',
    icon: Briefcase,
    keyActions: [
        'Create and manage official events.',
        'Oversee and curate guest lists.',
        'Design and finalize seating plans.'
    ]
  },
  {
    name: 'Protocol Officer / Entrance Agent',
    description: 'For on-site staff.',
    href: '/protocol-officer',
    icon: CheckSquare,
    keyActions: [
        'Check in guests upon arrival.',
        'Quickly look up guest details.',
        'View seating and table assignments.'
    ]
  },
  {
    name: 'Guest / Invitee',
    description: 'For attendees.',
    href: '/guest-invitee',
    icon: Ticket,
    keyActions: [
        'View official event invitation.',
        'See date, time, and location details.',
        'Check your assigned seat.'
    ]
  },
];

export type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  guestCount: number;
  status: 'Upcoming' | 'Past' | 'Draft';
};

export const events: Event[] = [
  {
    id: 'evt-001',
    name: 'Annual Diplomatic Gala 2024',
    date: '2024-12-15T19:00:00',
    location: 'Grand Ballroom, The Capital Hotel',
    guestCount: 250,
    status: 'Upcoming',
  },
  {
    id: 'evt-002',
    name: 'International Trade Summit',
    date: '2024-11-20T09:00:00',
    location: 'Exhibition Centre, Hall A',
    guestCount: 500,
    status: 'Upcoming',
  },
  {
    id: 'evt-003',
    name: 'National Day Celebration',
    date: '2024-10-01T18:00:00',
    location: 'Presidential Palace Gardens',
    guestCount: 150,
    status: 'Past',
  },
];

export type Guest = {
  id: string;
  name: string;
  organization: string;
  rsvpStatus: 'Confirmed' | 'Pending' | 'Declined';
  seat: string | null;
  eventId: string;
  checkInStatus: 'Checked-in' | 'Pending';
};

export const guests: Guest[] = [
  {
    id: 'gst-001',
    name: 'Ambassador John Doe',
    organization: 'Embassy of Freedonia',
    rsvpStatus: 'Confirmed',
    seat: 'T1-A3',
    eventId: 'evt-001',
    checkInStatus: 'Pending',
  },
  {
    id: 'gst-002',
    name: 'Minister Jane Smith',
    organization: 'Ministry of Foreign Affairs',
    rsvpStatus: 'Confirmed',
    seat: 'T1-A1',
    eventId: 'evt-001',
    checkInStatus: 'Checked-in',
  },
  {
    id: 'gst-003',
    name: 'Dr. Emily White',
    organization: 'Global Health Council',
    rsvpStatus: 'Pending',
    seat: null,
    eventId: 'evt-001',
    checkInStatus: 'Pending',
  },
  {
    id: 'gst-004',
    name: 'Mr. Robert Brown',
    organization: 'International Trade Corp',
    rsvpStatus: 'Confirmed',
    seat: 'C5-12',
    eventId: 'evt-002',
    checkInStatus: 'Pending',
  },
  {
    id: 'gst-005',
    name: 'Ms. Sarah Green',
    organization: 'World Aid Foundation',
    rsvpStatus: 'Declined',
    seat: null,
    eventId: 'evt-001',
    checkInStatus: 'Pending',
  },
  {
    id: 'gst-006',
    name: 'General Alan Black',
    organization: 'Department of Defense',
    rsvpStatus: 'Confirmed',
    seat: 'T1-A2',
    eventId: 'evt-001',
    checkInStatus: 'Pending',
  },
];
