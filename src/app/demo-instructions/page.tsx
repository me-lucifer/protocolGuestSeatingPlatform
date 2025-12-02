
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Lightbulb, Shield, Briefcase, UserCheck, Zap, AlertTriangle } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';


const demoFlow = [
    {
        title: "Introduction (Start at Role Selection)",
        role: "Overview",
        duration: "1 min",
        points: [
            "Introduce the Protocol Platform: a solution for managing high-stakes events.",
            "Briefly explain the four roles, establishing the concept of role-based access control (RBAC)."
        ]
    },
    {
        title: "Protocol Admin: Event Management",
        role: "Protocol Admin",
        duration: "3-4 mins",
        points: [
            "Select the 'Protocol Admin' role to enter the main dashboard.",
            "Point out the key metrics and the list of events.",
            "Click 'View Details' on the 'Annual Diplomatic Gala 2024'.",
            "Show the 'Guest List' tab: mention filtering and searching.",
            "Switch to the 'Seating Plan' tab: highlight the visual layout, legend, and the 'Auto-arrange' feature (explain its purpose).",
            "Briefly show the 'Day-of Operations' tab as a preview of what's to come."
        ]
    },
    {
        title: "Guest: Invitation & RSVP",
        role: "Guest / Invitee",
        duration: "2-3 mins",
        points: [
            "Return to the role selection page.",
            "Select the 'Guest / Invitee' role.",
            "Open the sample invitation and walk through the details.",
            "Click 'Yes, I will attend' to show the RSVP confirmation and the QR code screen.",
            "Mention the multi-language toggle (EN/FR) to highlight international readiness."
        ]
    },
    {
        title: "Protocol Officer: Day-of Check-in",
        role: "Protocol Officer",
        duration: "2-3 mins",
        points: [
            "Return to the role selection page.",
            "Select the 'Protocol Officer' role to show the mobile-emulated view.",
            "Choose the 'Annual Diplomatic Gala 2024' event.",
            "Use 'Start Scanning' and simulate a successful VIP guest scan.",
            "Point out the successful check-in, the VIP notification, and the assigned seat display."
        ]
    },
     {
        title: "Conclusion: Closing the Loop",
        role: "Protocol Admin",
        duration: "1 min",
        points: [
            "Quickly navigate back to the 'Protocol Admin' -> 'Day-of Operations' tab for the Gala.",
            "Show that the VIP guest's check-in is now reflected on the dashboard in real-time.",
            "Conclude by summarizing how the platform provides a seamless, end-to-end solution."
        ]
    }
]


export default function DemoInstructionsPage() {
  return (
    <PageShell role="Demo Instructions">
        <div className="mx-auto w-full max-w-4xl space-y-8">
            <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                <CardTitle className="page-title">Demo Instructions & Presenter's Guide</CardTitle>
                <CardDescription>
                    Your guide to delivering a smooth and effective presentation of the Protocol Platform prototype.
                </CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="section-title flex items-center gap-2"><Lightbulb /> Prototype Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>This interactive prototype showcases a sophisticated platform for managing protocol-level events. It demonstrates a user-centric design with role-based access for different user personas: the high-level <strong>Super Admin</strong>, the detail-oriented <strong>Protocol Admin</strong>, the on-site <strong>Protocol Officer</strong>, and the end-user <strong>Guest</strong>.</p>
                    <p>The primary goal is to illustrate a seamless, end-to-end workflow from event creation and guest management to final on-site check-in, all wrapped in a professional, enterprise-grade user interface.</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="section-title flex items-center gap-2"><Zap /> Suggested 5-10 Minute Demo Flow</CardTitle>
                    <CardDescription>Follow these steps for a concise and impactful video presentation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {demoFlow.map((step, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-6 p-4 border rounded-lg">
                            <div className="flex-shrink-0 sm:w-40">
                                <h4 className="font-semibold text-foreground">{index + 1}. {step.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">~ {step.duration}</p>
                                <Badge variant="outline" className="mt-2">{step.role}</Badge>
                            </div>
                            <div className="flex-1">
                                <ul className="list-disc pl-5 space-y-2 text-sm">
                                    {step.points.map((point, pIndex) => (
                                        <li key={pIndex}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="section-title flex items-center gap-2"><AlertTriangle /> Key Limitations to Acknowledge</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-3 text-sm text-muted-foreground">
                            <li><strong>Front-End Only:</strong> This is a UI/UX prototype. There is no live backend or database; all data is mocked and stored in-session.</li>
                            <li><strong>Simulated Actions:</strong> Critical actions like "sending emails", "importing files", or "generating PDFs" are simulated with toasts and dialogs to demonstrate workflow, but no actual process occurs.</li>
                            <li><strong>No Authentication:</strong> The role selection screen simulates logging in, but there is no real authentication system.</li>
                            <li><strong>Simplified Logic:</strong> Features like "Auto-arrange Seating" use placeholder logic and do not reflect the complex rules of real-world protocol.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="section-title flex items-center gap-2"><Shield /> Talking Points</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="list-disc pl-5 space-y-3 text-sm text-muted-foreground">
                        <li><strong>Professional & Premium UI:</strong> Emphasize the clean, well-spaced, and consistent design suitable for a high-stakes government or enterprise environment.</li>
                        <li><strong>Role-Based Access Control (RBAC):</strong> Mention how the different roles provide tailored experiences and secure access to relevant information.</li>
                        <li><strong>End-to-End Workflow:</strong> Highlight how the platform handles the entire event lifecycle from administrative setup to the final guest experience.</li>
                        <li><strong>Data-Driven & Centralized:</strong> Explain that in a real system, this would be a single source of truth, reducing errors and improving efficiency.</li>
                        <li><strong>Future-Ready Design:</strong> Point out elements like multi-language support and feature flags that show the platform is built for scalability and customization.</li>
                    </ul>
                </CardContent>
            </Card>

            <CardFooter className="flex justify-center">
                <Button asChild>
                    <Link href="/">
                        <Home /> Back to Role Selection
                    </Link>
                </Button>
            </CardFooter>
        </div>
    </PageShell>
  );
}
