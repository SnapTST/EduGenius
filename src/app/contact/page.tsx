
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import * as React from 'react';
import { sendContactEmail } from '@/ai/flows/send-contact-email';
import { Loader } from '@/components/loader';


const formSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(1, 'Please enter a subject.'),
  message: z.string().min(1, 'Please enter a message.'),
});


export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await sendContactEmail(values);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      form.reset();
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        variant: 'destructive',
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sending your message. Please try again later.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Contact Us"
        description="Have a question or feedback? Fill out the form below to get in touch."
      />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Mail className="w-8 h-8 text-primary" />
                    <div>
                    <CardTitle className="font-headline">Email Us Directly</CardTitle>
                    <CardDescription>For any inquiries, email us at:</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Link href="mailto:officialprashant.org@gmail.com" className="font-medium text-primary hover:underline break-all">
                    officialprashant.org@gmail.com
                    </Link>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Full Name</Label>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Email Address</Label>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Subject</Label>
                          <FormControl>
                            <Input placeholder="What is your message about?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Message</Label>
                          <FormControl>
                            <Textarea placeholder="Type your message here." rows={6} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader className="w-6 h-6"/> : 'Send Message'}
                  </Button>
                </form>
                </Form>
              </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
