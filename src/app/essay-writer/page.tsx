'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  topic: z.string().min(5, 'Topic is too short'),
  keywords: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EssayWriterPage() {
  const [essay, setEssay] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      keywords: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setEssay(null);
    try {
      const response = await fetch('/api/generate-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setEssay(result.essay || 'No essay generated.');
    } catch (error) {
      setEssay('Error generating essay.');
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Essay Writer"
        description="Generate full-length essays instantly by just entering a topic."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter Essay Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Essay Topic</Label>
              <Input id="topic" {...register('topic')} placeholder="e.g. The impact of AI on education" />
              {errors.topic && <p className="text-sm text-red-500">{errors.topic.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Optional Keywords</Label>
              <Input id="keywords" {...register('keywords')} placeholder="education, technology, innovation" />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Generating...' : 'Generate Essay'}
            </Button>
          </CardContent>
        </Card>
      </form>

      {essay && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Generated Essay</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={essay} rows={15} readOnly className="resize-none" />
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
}
