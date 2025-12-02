
'use client';

import { PageShell } from '@/components/layout/PageShell';
import { FeatureFlagsProvider } from '@/contexts/FeatureFlagsContext';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FeatureFlagsProvider>
      <PageShell role="Super Admin / IT Admin">
        {children}
      </PageShell>
    </FeatureFlagsProvider>
  );
}
