
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { pastPaperQuestionMatcher } from '@/ai/flows/past-paper-question-matcher';
import { Loader } from '@/components/loader';
import { PrintButton } from '@/components/print-button';

const formSchema = z.object({
  chapterContent: z.string().min(50, 'Please enter at least 50 characters of chapter content.'),
});

export default function PastPaperMatcherPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [matchedQuestions, setMatchedQuestions] = React.useState<string[] | null>(null);
  const { toast } = useToast();
  const printableRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chapterContent: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMatchedQuestions(null);
    try {
      const result = await pastPaperQuestionMatcher(values);
      setMatchedQuestions(result.matchedQuestions);
      toast({
        title: 'Questions Matched!',
        description: 'We found some relevant past paper questions for you.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem matching questions. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Past Paper Question Matcher"
        description="Paste your chapter content to find relevant questions from past exams."
      />
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Chapter Content</CardTitle>
            <CardDescription>Paste the text from your textbook chapter here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="chapterContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your chapter content here..."
                          className="min-h-[200px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Matching...' : 'Find Questions'}
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
                  <CardTitle className="font-headline">Matched Questions</CardTitle>
                  <CardDescription>Relevant questions from past papers.</CardDescription>
                </div>
                {matchedQuestions && matchedQuestions.length > 0 && <PrintButton />}
              </div>
            </CardHeader>
            <CardContent>
              <div ref={printableRef} className="printable-container">
                {isLoading && <Loader />}
                {!isLoading && !matchedQuestions && (
                  <div className="text-center text-muted-foreground py-16">
                    <p>Matched questions will appear here.</p>
                  </div>
                )}
                {matchedQuestions && matchedQuestions.length === 0 && (
                  <div className="text-center text-muted-foreground py-16">
                    <p>No matching questions found. Try providing more content.</p>
                  </div>
                )}
                {matchedQuestions && matchedQuestions.length > 0 && (
                  <ul className="space-y-4">
                    {matchedQuestions.map((question, index) => (
                      <li key={index} className="flex items-start gap-4 p-4 rounded-md border bg-secondary/50">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0 mt-1">
                          {index + 1}
                        </span>
                        <p className="font-body text-sm">{question}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
