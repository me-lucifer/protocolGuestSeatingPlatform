import { format } from 'date-fns';

export type Role = {
  name: string;
  description: string;
  href: string;
};

export const roles: Role[] = [
  {
    name: 'Super Admin / IT Admin',
    description: 'Manage platform settings, user roles, and system configurations. For platform owners.',
    href: '/super-admin',
  },
  {
    name: 'Protocol Admin / Event Manager',
    description: 'Create and manage events, oversee guest lists, and configure seating arrangements.',
    href: '/protocol-admin',
  },
  {
    name: 'Protocol Officer / Entrance Agent',
    description: 'Check in guests upon arrival, view guest details, and provide on-site assistance.',
    href: '/protocol-officer',
  },
  {
    name: 'Guest / Invitee',
    description: 'View event details, confirm your attendance, and access your seating information.',
    href: '/guest',
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
