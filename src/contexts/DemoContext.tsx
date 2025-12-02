
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { initialEvents, initialGuests, initialRoomLayouts, initialUsers, initialOrganizations, type Event, type Guest, type RoomLayout, type User, type Organization } from '@/lib/data';

// A deep copy function to avoid reference issues
const deepCopy = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

interface DemoDataContextType {
  events: Event[];
  guests: Guest[];
  roomLayouts: RoomLayout[];
  users: User[];
  organizations: Organization[];
  resetDemoData: () => void;
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setRoomLayouts: React.Dispatch<React.SetStateAction<RoomLayout[]>>;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export const DemoDataProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>(() => deepCopy(initialEvents));
  const [guests, setGuests] = useState<Guest[]>(() => deepCopy(initialGuests));
  const [roomLayouts, setRoomLayouts] = useState<RoomLayout[]>(() => deepCopy(initialRoomLayouts));
  const [users, setUsers] = useState<User[]>(() => deepCopy(initialUsers));
  const [organizations, setOrganizations] = useState<Organization[]>(() => deepCopy(initialOrganizations));

  const resetDemoData = useCallback(() => {
    setEvents(deepCopy(initialEvents));
    setGuests(deepCopy(initialGuests));
    setRoomLayouts(deepCopy(initialRoomLayouts));
    setUsers(deepCopy(initialUsers));
    setOrganizations(deepCopy(initialOrganizations));
  }, []);

  return (
    <DemoDataContext.Provider value={{ events, guests, roomLayouts, users, organizations, resetDemoData, setGuests, setEvents, setRoomLayouts }}>
      {children}
    </DemoDataContext.Provider>
  );
};

export const useDemoData = () => {
  const context = useContext(DemoDataContext);
  if (context === undefined) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
};


interface DemoContextType {
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState(true);

  return (
    <DemoContext.Provider value={{ isDemoMode, setIsDemoMode }}>
      <DemoDataProvider>
        {children}
      </DemoDataProvider>
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
