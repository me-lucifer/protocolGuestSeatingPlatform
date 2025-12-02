
'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Dot } from 'lucide-react';

type Step = {
  key: 'invitation' | 'respond' | 'qrcode' | 'entrance';
  name: (t: any) => string;
};

const steps: Step[] = [
  { key: 'invitation', name: (t) => t.timelineInvitation },
  { key: 'respond', name: (t) => t.timelineRespond },
  { key: 'qrcode', name: (t) => t.timelineGetCode },
  { key: 'entrance', name: (t) => t.timelinePresentCode },
];


export function GuestTimeline({
  currentStepKey,
  className,
}: {
  currentStepKey: Step['key'];
  className?: string;
}) {
  const { t } = useLanguage();
  const currentStepIndex = steps.findIndex((s) => s.key === currentStepKey);

  return (
    <div className={cn('w-full', className)}>
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.key}
              className={cn(
                'relative',
                stepIdx !== steps.length - 1 ? 'flex-1' : ''
              )}
            >
              <>
                {stepIdx < currentStepIndex ? (
                  // Completed Step
                  <div className="flex items-center gap-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-5 w-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground">{step.name(t)}</span>
                  </div>
                ) : stepIdx === currentStepIndex ? (
                  // Current Step
                  <div className="flex items-center gap-x-2" aria-current="step">
                    <div className="relative flex h-8 w-8 items-center justify-center">
                        <span className="absolute h-4 w-4 rounded-full bg-primary/30" aria-hidden="true" />
                        <span className="relative block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-primary">{step.name(t)}</span>
                  </div>
                ) : (
                  // Upcoming Step
                  <div className="flex items-center gap-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                        <Dot className="text-muted-foreground/50"/>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">{step.name(t)}</span>
                  </div>
                )}

                {/* Connector */}
                {stepIdx < steps.length - 1 ? (
                  <div
                    className={cn(
                        "absolute right-0 top-4 -z-10 h-0.5 w-full",
                        stepIdx < currentStepIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                    aria-hidden="true"
                  />
                ) : null}
              </>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
