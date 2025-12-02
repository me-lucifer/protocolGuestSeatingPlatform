
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type TourStepDefinition = {
  id: string;
  title: string;
  content: string;
  path: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
};

const tourSteps: TourStepDefinition[] = [
  {
    id: 'tour-step-0',
    title: 'Welcome to the Platform',
    content: 'This is the main entry point where users select their role. Each role provides access to different features of the platform.',
    path: '/',
    placement: 'right',
  },
  {
    id: 'tour-step-1',
    title: 'Protocol Admin Role',
    content: 'Let\'s explore the Protocol Admin role. This user is responsible for creating and managing events, guest lists, and seating.',
    path: '/protocol-admin',
    placement: 'right',
  },
  {
    id: 'tour-step-2',
    title: 'Admin Dashboard',
    content: 'This is the admin\'s main dashboard, showing key metrics and a list of all managed events.',
    path: '/protocol-admin',
    placement: 'bottom',
  },
  {
    id: 'tour-step-3',
    title: 'Event Management',
    content: 'Admins can manage event details, guest lists, and seating arrangements from here. Let\'s look at an event.',
    path: '/protocol-admin/events/evt-001',
    placement: 'bottom',
  },
  {
    id: 'tour-step-4',
    title: 'Guest Journey',
    content: 'Now, let\'s see the guest\'s perspective. They receive an invitation, RSVP, and get their QR code for entry.',
    path: '/guest-invitee/invitation/sample-event',
    placement: 'bottom',
  },
  {
    id: 'tour-step-5',
    title: 'On-Site Check-in',
    content: 'Finally, this is the mobile view for Protocol Officers at the event, used for scanning QR codes and checking in guests.',
    path: '/protocol-officer',
    placement: 'left',
  },
];


interface TourContextType {
  isTourActive: boolean;
  currentStep: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  TourStep: React.FC;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const navigateToStep = useCallback((stepIndex: number) => {
    const step = tourSteps[stepIndex];
    if (step) {
      router.push(step.path);
    }
  }, [router]);
  
  const startTour = () => {
    setCurrentStep(0);
    setIsTourActive(true);
    navigateToStep(0);
  };

  const endTour = () => {
    setIsTourActive(false);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      navigateToStep(nextStepIndex);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      navigateToStep(prevStepIndex);
    }
  };

  const TourStepComponent = () => {
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const step = tourSteps[currentStep];

    useEffect(() => {
        if (!isTourActive) return;

        const targetElement = document.getElementById(step.id);
        const updatePosition = () => {
            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                setPosition({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                });
            } else if (step.placement === 'center') {
                setPosition({
                    top: window.innerHeight / 2,
                    left: window.innerWidth / 2,
                    width: 0,
                    height: 0,
                });
            }
        };

        // Delay to allow page to render
        const timeoutId = setTimeout(updatePosition, 100);
        window.addEventListener('resize', updatePosition);
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updatePosition);
        };
    }, [currentStep, isTourActive, step.id, step.placement]);

    if (!isTourActive || !step || position.width === 0 && step.placement !== 'center') return null;

    const getTooltipStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {
            position: 'fixed',
            zIndex: 1001,
        };

        const offset = 12;

        switch (step.placement) {
            case 'top':
                style.left = position.left + position.width / 2;
                style.bottom = window.innerHeight - position.top + offset;
                style.transform = 'translateX(-50%)';
                break;
            case 'bottom':
                style.left = position.left + position.width / 2;
                style.top = position.top + position.height + offset;
                style.transform = 'translateX(-50%)';
                break;
            case 'left':
                style.top = position.top + position.height / 2;
                style.right = window.innerWidth - position.left + offset;
                style.transform = 'translateY(-50%)';
                break;
             case 'center':
                style.top = '50%';
                style.left = '50%';
                style.transform = 'translate(-50%, -50%)';
                break;
            case 'right':
            default:
                style.top = position.top + position.height / 2;
                style.left = position.left + position.width + offset;
                style.transform = 'translateY(-50%)';
                break;
        }
        return style;
    };
    
    const highlightStyle: React.CSSProperties = {
        position: 'fixed',
        top: position.top - 8,
        left: position.left - 8,
        width: position.width + 16,
        height: position.height + 16,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
        borderRadius: '8px',
        zIndex: 1000,
        pointerEvents: 'none',
        transition: 'all 0.3s ease-in-out'
    };

    return (
        <>
            {step.placement !== 'center' && <div style={highlightStyle} />}
            <div style={getTooltipStyle()} className="bg-background p-4 rounded-lg shadow-2xl max-w-sm w-full">
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{step.content}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{currentStep + 1} / {tourSteps.length}</span>
                    <div className="flex gap-2">
                        {currentStep > 0 && <Button variant="ghost" size="sm" onClick={prevStep}>Previous</Button>}
                        <Button size="sm" onClick={nextStep}>
                            {currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}
                        </Button>
                    </div>
                </div>
                 <Button variant="link" size="sm" onClick={endTour} className="absolute top-2 right-2 px-2 py-1 h-auto text-muted-foreground">Skip</Button>
            </div>
        </>
    );
  };

  return (
    <TourContext.Provider value={{ isTourActive, currentStep, startTour, endTour, nextStep, prevStep, TourStep: TourStepComponent }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
