
import { Briefcase, CheckSquare, Fingerprint, Ticket, type LucideIcon } from 'lucide-react';

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
  venue: string;
  status: 'Draft' | 'Invitations Sent' | 'Live' | 'Completed';
  type: 'State ceremony' | 'Diplomatic reception' | 'Conference';
  guestCount: number;
};

export const events: Event[] = [
  {
    id: 'evt-001',
    name: 'Annual Diplomatic Gala 2024',
    date: '2024-12-15T19:00:00',
    venue: 'Grand Ballroom, The Capital Hotel',
    status: 'Invitations Sent',
    type: 'Diplomatic reception',
    guestCount: 250,
  },
  {
    id: 'evt-002',
    name: 'International Trade Summit',
    date: '2024-11-20T09:00:00',
    venue: 'Exhibition Centre, Hall A',
    status: 'Live',
    type: 'Conference',
    guestCount: 500,
  },
  {
    id: 'evt-003',
    name: 'National Day Celebration',
    date: '2024-10-01T18:00:00',
    venue: 'Presidential Palace Gardens',
    status: 'Completed',
    type: 'State ceremony',
    guestCount: 150,
  },
];

export type Guest = {
  id: string;
  fullName: string;
  title: string;
  organization: string;
  delegation: string;
  category: 'VIP' | 'Diplomatic' | 'Press' | 'Staff';
  rankLevel: number; // Lower number = higher rank
  rsvpStatus: 'Not Invited' | 'Invited' | 'Accepted' | 'Declined';
  seatAssignment: string | null;
  eventId: string;
  checkInStatus: 'Checked-in' | 'Not Arrived' | 'Denied' | 'No Show';
  checkInTime: string | null;
  email: string;
  lastEmailSent: string | null;
  isLate?: boolean;
};

export const guests: Guest[] = [
  // Guests for Annual Diplomatic Gala 2024 (evt-001)
  {
    id: 'gst-001',
    fullName: 'Ambassador Johnathan Pike',
    title: 'Ambassador of Freedonia',
    organization: 'Embassy of Freedonia',
    delegation: 'Freedonia',
    category: 'Diplomatic',
    rankLevel: 2,
    rsvpStatus: 'Accepted',
    seatAssignment: 'T1-A3',
    eventId: 'evt-001',
    checkInStatus: 'Not Arrived',
    checkInTime: null,
    email: 'j.pike@freedonia.gov',
    lastEmailSent: '2024-11-01',
  },
  {
    id: 'gst-002',
    fullName: 'Minister Jane Smith',
    title: 'Minister of Foreign Affairs',
    organization: 'Host Nation Government',
    delegation: 'Host Nation',
    category: 'VIP',
    rankLevel: 1,
    rsvpStatus: 'Accepted',
    seatAssignment: 'T1-A1',
    eventId: 'evt-001',
    checkInStatus: 'Checked-in',
    checkInTime: '2024-12-15T19:05:00',
    email: 'j.smith@gov.host',
    lastEmailSent: '2024-11-01',
  },
  {
    id: 'gst-003',
    fullName: 'Dr. Emily White',
    title: 'Director',
    organization: 'Global Health Council',
    delegation: 'Global Health Council',
    category: 'VIP',
    rankLevel: 4,
    rsvpStatus: 'Invited',
    seatAssignment: null,
    eventId: 'evt-001',
    checkInStatus: 'Not Arrived',
    checkInTime: null,
    email: 'e.white@ghc.org',
    lastEmailSent: '2024-11-01',
  },
  {
    id: 'gst-005',
    fullName: 'Ms. Sarah Green',
    title: 'Journalist',
    organization: 'World News Network',
    delegation: 'Press Corps',
    category: 'Press',
    rankLevel: 10,
    rsvpStatus: 'Declined',
    seatAssignment: null,
    eventId: 'evt-001',
    checkInStatus: 'Not Arrived',
    checkInTime: null,
    email: 's.green@wnn.com',
    lastEmailSent: '2024-11-01',
  },
  {
    id: 'gst-006',
    fullName: 'General Alan Black',
    title: 'Chief of Defense Staff',
    organization: 'Department of Defense',
    delegation: 'Host Nation',
    category: 'VIP',
    rankLevel: 2,
    rsvpStatus: 'Accepted',
    seatAssignment: 'T1-A2',
    eventId: 'evt-001',
    checkInStatus: 'Not Arrived',
    checkInTime: null,
    email: 'a.black@dod.gov.host',
    lastEmailSent: '2024-11-01',
  },
  {
    id: 'gst-007',
    fullName: 'Maria Garcia',
    title: 'Cultural Attaché',
    organization: 'Embassy of Costaguana',
    delegation: 'Costaguana',
    category: 'Diplomatic',
    rankLevel: 7,
    rsvpStatus: 'Accepted',
    seatAssignment: 'T5-B2',
    eventId: 'evt-001',
    checkInStatus: 'Not Arrived',
    checkInTime: null,
    email: 'm.garcia@costaguana.gov',
    lastEmailSent: '2024-11-01',
  },
  {
    id: 'gst-008',
    fullName: 'Chen Wei',
    title: 'Economic Counselor',
    organization: 'Embassy of Shangala',
    delegation: 'Shangala',
    category: 'Diplomatic',
    rankLevel: 6,
    rsvpStatus: 'Accepted',
    seatAssignment: 'T5-B1',
    eventId: 'evt-001',
    checkInStatus: 'Not Arrived',
    checkInTime: null,
    email: 'c.wei@shangala.gov',
    lastEmailSent: '2024-11-01',
  },
  {
    id: 'gst-009',
    fullName: 'David Miller',
    title: 'Event Coordinator',
    organization: 'Protocol Office',
    delegation: 'Staff',
    category: 'Staff',
    rankLevel: 11,
    rsvpStatus: 'Accepted',
    seatAssignment: 'STAFF-1',
    eventId: 'evt-001',
    checkInStatus: 'Checked-in',
    checkInTime: '2024-12-15T18:30:00',
    email: 'd.miller@protocol.gov.host',
    lastEmailSent: null,
  },
  {
    id: 'gst-010',
    fullName: 'Fatima Al-Jamil',
    title: 'CEO',
    organization: 'Global PetroCorp',
    delegation: 'Global PetroCorp',
    category: 'VIP',
    rankLevel: 3,
    rsvpStatus: 'Accepted',
    seatAssignment: 'T2-C1',
    eventId: 'evt-001',
    checkInStatus: 'Not Arrived',
    checkInTime: null,
    email: 'ceo@globalpetro.com',
    lastEmailSent: '2024-11-01',
  },
  {
    id: 'gst-011',
    fullName: 'Pierre Dubois',
    title: 'Photographer',
    organization: 'Associated Press',
    delegation: 'Press Corps',
    category: 'Press',
    rankLevel: 10,
    rsvpStatus: 'Invited',
    seatAssignment: null,
    eventId: 'evt-001',
    checkInStatus: 'Not Arrived',
    checkInTime: null,
    email: 'p.dubois@ap.org',
    lastEmailSent: '2024-11-01',
  },
  // Guests for International Trade Summit (evt-002)
  {
    id: 'gst-004',
    fullName: 'Mr. Robert Brown',
    title: 'CEO',
    organization: 'International Trade Corp',
    delegation: 'International Trade Corp',
    category: 'VIP',
    rankLevel: 3,
    rsvpStatus: 'Accepted',
    seatAssignment: 'C5-12',
    eventId: 'evt-002',
    checkInStatus: 'Not Arrived',
    checkInTime: null,
    email: 'r.brown@itc.com',
    lastEmailSent: '2024-10-15',
  },
];


export type Seat = {
  id: string;
  label: string; // e.g. "A1", "A2"
  guestId: string | null;
};

export type Table = {
  id: string;
  name: string; // e.g. "Table 1", "Head Table"
  seats: Seat[];
};

export type RoomLayout = {
  id: string;
  name: string;
  eventId: string;
  tables: Table[];
};

export const roomLayouts: RoomLayout[] = [
    {
        id: 'layout-001',
        name: 'Grand Ballroom Layout',
        eventId: 'evt-001',
        tables: [
            {
                id: 'table-1',
                name: 'Head Table',
                seats: [
                    { id: 'seat-1a1', label: 'T1-A1', guestId: 'gst-002' },
                    { id: 'seat-1a2', label: 'T1-A2', guestId: 'gst-006' },
                    { id: 'seat-1a3', label: 'T1-A3', guestId: 'gst-001' },
                    { id: 'seat-1a4', label: 'T1-A4', guestId: null },
                ]
            },
            {
                id: 'table-2',
                name: 'Table 2',
                seats: [
                    { id: 'seat-2c1', label: 'T2-C1', guestId: 'gst-010' },
                    { id: 'seat-2c2', label: 'T2-C2', guestId: null },
                    { id: 'seat-2c3', label: 'T2-C3', guestId: null },
                ]
            },
            {
                id: 'table-5',
                name: 'Table 5',
                seats: [
                    { id: 'seat-5b1', label: 'T5-B1', guestId: 'gst-008' },
                    { id: 'seat-5b2', label: 'T5-B2', guestId: 'gst-007' },
                ]
            }
        ]
    }
];

export type UserRole = 'Super Admin' | 'Protocol Admin' | 'Protocol Officer';
export type UserStatus = 'Active' | 'Disabled';

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    organization: string;
    status: UserStatus;
}

export const users: User[] = [
    {
        id: 'usr-001',
        name: 'Alice Wonder',
        email: 'alice.wonder@protocol.gov',
        role: 'Super Admin',
        organization: 'State Protocol Directorate',
        status: 'Active',
    },
    {
        id: 'usr-002',
        name: 'Bob Builder',
        email: 'bob.builder@protocol.gov',
        role: 'Protocol Admin',
        organization: 'State Protocol Directorate',
        status: 'Active',
    },
    {
        id: 'usr-003',
        name: 'Charlie Chaplin',
        email: 'charlie.chaplin@protocol.gov',
        role: 'Protocol Officer',
        organization: 'State Protocol Directorate',
        status: 'Active',
    },
    {
        id: 'usr-004',
        name: 'Diana Prince',
        email: 'diana.prince@mfa.gov',
        role: 'Protocol Admin',
        organization: 'Ministry of Foreign Affairs',
        status: 'Disabled',
    },
];

export const organizations = [
  { name: 'State Protocol Directorate' },
  { name: 'Ministry of Foreign Affairs' },
  { name: 'Ministry of Innovation & Technology' },
];
