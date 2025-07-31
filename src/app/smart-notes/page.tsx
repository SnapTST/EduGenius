
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { summarizeNotes } from '@/ai/flows/summarize-notes';
import { Loader } from '@/components/loader';
import { PrintButton } from '@/components/print-button';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  documentDataUri: z.string().refine((val) => val.startsWith('data:'), {
    message: 'Please upload a valid file.',
  }),
});

export default function SmartNotesPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>('');
  const { toast } = useToast();
  const printableRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUri: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeNotes(values);
      setSummary(result.summary);
      toast({
        title: 'Notes Summarized!',
        description: 'Your smart notes are ready.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem summarizing your document. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Smart Notes Generator"
        description="Upload a textbook chapter image or PDF to get AI-powered summary notes."
      />
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Upload Document</CardTitle>
            <CardDescription>Select an image or PDF file to summarize.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="documentDataUri"
                  render={() => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="file-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center w-full h-32 px-4 text-center border-2 border-dashed rounded-md border-border text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors"
                          >
                            {fileName ? (
                              <span>{fileName}</span>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Upload className="w-8 h-8" />
                                <span>Click to upload or drag and drop</span>
                                <span className="text-xs">PDF or Image file</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full">
                  {isLoading ? 'Summarizing...' : 'Generate Notes'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="sticky top-24">
          <Card className="min-h-[400px]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-headline">Summary</CardTitle>
                  <CardDescription>Review your summarized notes below.</CardDescription>
                </div>
                {summary && <PrintButton />}
              </div>
            </CardHeader>
            <CardContent>
              <div ref={printableRef} className="printable-container">
                {isLoading && <Loader />}
                {!isLoading && !summary && (
                  <div className="text-center text-muted-foreground py-16">
                    <p>Your generated summary will appear here.</p>
                  </div>
                )}
                {summary && <div className="prose prose-sm max-w-none font-body" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
