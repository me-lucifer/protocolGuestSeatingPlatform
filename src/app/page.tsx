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
          <CardHeader className="text-center p-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary font-headline md:text-4xl">
              Protocol Guest Seating Platform
            </h1>
            <CardDescription className="text-lg pt-2 text-muted-foreground">
              Select your role to access the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 p-8 pt-0 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <Link
                href={role.href}
                key={role.name}
                className="block group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                <Card className="h-full transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-primary">
                      {role.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <p className="text-sm text-muted-foreground flex-grow min-h-[6rem]">
                      {role.description}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-4 text-primary font-semibold"
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      Continue as this role
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
