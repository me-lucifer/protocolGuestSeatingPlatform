import { PageShell } from '@/components/layout/PageShell';

export default function ProtocolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell role="Protocol Admin / Event Manager">
      {children}
    </PageShell>
  );
}
