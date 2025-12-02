import { PageShell } from '@/components/layout/PageShell';

export default function GuestInviteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell role="Guest / Invitee">
      {children}
    </PageShell>
  );
}
