import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageShell } from '@/components/layout/PageShell';

export default function NotFound() {
  return (
    <PageShell role="Error">
        <div className="flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
                    <CardDescription>The page you are looking for does not exist.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6">It seems you've taken a wrong turn. Let's get you back on track.</p>
                    <Button asChild>
                        <Link href="/">Back to Role Selection</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </PageShell>
  );
}
