
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="font-headline text-3xl font-bold tracking-tight">
              Welcome to EduGenius
            </CardTitle>
            <CardDescription className="pt-2">
              Your AI-powered study partner. Sign in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/dashboard">
                  <Chrome className="mr-2 h-5 w-5" />
                  Sign In with Google
                </Link>
              </Button>
            </div>
            <p className="mt-4 px-8 text-center text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link href="#" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
