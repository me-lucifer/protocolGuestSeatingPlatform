import { PageShell } from '@/components/layout/PageShell';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell role="Super Admin / IT Admin">
      {children}
    </PageShell>
  );
}
