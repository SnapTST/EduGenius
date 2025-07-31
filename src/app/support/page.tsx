
'use client';

import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Support"
        description="We're here to help. Reach out to us through any of the channels below."
      />
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Mail className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="font-headline">Email Support</CardTitle>
              <CardDescription>Best for non-urgent inquiries.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <Link href="mailto:support@edugenius.com" className="font-medium text-primary hover:underline">
              support@edugenius.com
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Phone className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="font-headline">Phone Support</CardTitle>
              <CardDescription>For urgent issues.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Our support team is available from 9 AM to 5 PM, Monday to Friday.
            </p>
            <Link href="tel:+1234567890" className="font-medium text-primary hover:underline">
              +1 (234) 567-890
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
