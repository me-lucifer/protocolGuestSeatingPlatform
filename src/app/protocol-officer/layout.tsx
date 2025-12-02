
'use client';

import { PageShell } from '@/components/layout/PageShell';

export default function ProtocolOfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-muted/40">
      <PageShell role="Protocol Officer / Entrance Agent">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <p className="mb-4 hidden text-center text-sm text-muted-foreground md:block">
            This view emulates the mobile experience for Protocol Officers.
          </p>
          {children}
        </div>
      </PageShell>
    </div>
  );
}

    