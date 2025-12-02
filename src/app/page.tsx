import Link from 'next/link';
import { roles } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <Card className="w-full rounded-xl shadow-2xl border-primary/10">
          <CardHeader className="text-center p-6 md:p-10">
            <h1 className="text-3xl font-bold tracking-tight text-primary font-headline md:text-4xl">
              Protocol Guest Seating Platform
            </h1>
            <CardDescription className="text-base md:text-lg pt-2 text-muted-foreground max-w-3xl mx-auto">
              Welcome to the premier solution for managing high-profile events. This platform streamlines guest management, from invitation to seating, ensuring every detail is handled with precision and grace. Select your role to begin.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 p-6 md:p-8 pt-0">
            {roles.map((role) => (
              <Link
                href={role.href}
                key={role.name}
                className="block group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                <Card className="h-full transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-primary/30 flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <role.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-primary">
                        {role.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {role.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow h-full">
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5 flex-grow">
                      {role.keyActions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-4 text-primary font-semibold self-start"
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
