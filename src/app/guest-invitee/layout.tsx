
'use client'

import { PageShell } from '@/components/layout/PageShell';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function GuestInviteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <PageShell role="Guest / Invitee">
        {children}
      </PageShell>
    </LanguageProvider>
  );
}
