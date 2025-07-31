
'use client';

import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real application, you would handle form submission here (e.g., send an email).
    // For this demo, we'll just show a success message.
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you shortly.",
    });
    // @ts-ignore
    event.target.reset();
  };

  return (
    <AppLayout>
      <PageHeader
        title="Contact Us"
        description="Have a question or feedback? Fill out the form below to get in touch."
      />
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
            <CardHeader className="flex flex-row items-center gap-4">
                <Mail className="w-8 h-8 text-primary" />
                <div>
                <CardTitle className="font-headline">Email Us Directly</CardTitle>
                <CardDescription>For any inquiries, you can email us at:</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Link href="mailto:officialprashant.org@gmail.com" className="font-medium text-primary hover:underline">
                officialprashant.org@gmail.com
                </Link>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is your message about?" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message here." required rows={6} />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
