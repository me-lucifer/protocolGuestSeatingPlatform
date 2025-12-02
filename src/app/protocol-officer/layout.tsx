
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
          <div className="relative mx-auto h-[75vh] w-full max-w-sm overflow-hidden rounded-2xl border-8 border-neutral-800 bg-background shadow-2xl">
            <div className="absolute inset-x-0 top-0 z-10 h-6 w-full rounded-t-lg bg-neutral-800">
                <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-neutral-600"></div>
            </div>
            <div className="h-full w-full overflow-y-auto pt-6">
                {children}
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
