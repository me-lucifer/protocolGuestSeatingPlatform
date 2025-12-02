import { PageShell } from '@/components/layout/PageShell';

export default function ProtocolOfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell role="Protocol Officer / Entrance Agent">
      {children}
    </PageShell>
  );
}
