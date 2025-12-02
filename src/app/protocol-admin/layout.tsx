
'use client';

import { PageShell } from '@/components/layout/PageShell';
import { FeatureFlagsProvider } from '@/contexts/FeatureFlagsContext';

export default function ProtocolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FeatureFlagsProvider>
        <PageShell role="Protocol Admin / Event Manager">
            {children}
        </PageShell>
    </FeatureFlagsProvider>
  );
}
